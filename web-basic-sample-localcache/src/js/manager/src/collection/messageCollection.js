import Mutex from '../util/mutex.js';
import SyncManagerException from '../util/exception.js';
import ChangeLog from '../util/changeLog.js';
import { MessageChunk } from '../store/chunkContainer.js';

const _yieldTaskNumber = new WeakMap();
const _broadcast = new WeakMap();
const _messageContainer = new WeakMap();
const _chunkContainer = new WeakMap();

export default class MessageCollection {
  constructor({ manager, broadcast, messageContainer, chunkContainer, channel, filter }) {
    this.manager = manager;
    this.channel = channel;

    /** filter
     *  - reverse
     *  - limit
     *  - messageType
     *  - customType
     *  - senderUserIds
    */
    this.filter = filter || MessageChunk.getDefaultFilter();
    if(!this.filter.limit) this.filter.limit = 20;

    this.isLoading = false;
    this.currentChunk = null;
    this.messages = [];
    this.handlers = {};
    this.mutex = new Mutex();

    let _taskNumberSeed = 0;
    _yieldTaskNumber.set(this, () => {
      return ++_taskNumberSeed;
    });
    _broadcast.set(this, broadcast);
    _messageContainer.set(this, messageContainer);
    _chunkContainer.set(this, chunkContainer);
    this.manager.syncChangeLog(this.channel);
  }
  _pause() {
    this.isLoading = false;
    if(this.currentChunk) {
      const chunkContainer = _chunkContainer.get(this);
      this.currentChunk.isSynced = false;
      chunkContainer.upsert(this.currentChunk);
    }
  }
  _reset() {
    this.loadPreviousMessages(err => {
      if(!err) {
        this.manager.syncChangeLog(this.channel);
      }
    });
  }
  _setCurrentChunk(chunk) {
    this.currentChunk = chunk;
    if(this.currentChunk instanceof MessageChunk) {
      const chunkContainer = _chunkContainer.get(this);
      chunkContainer.upsert(this.currentChunk);
    }
  }
  getIndex(message, list = []) {
    for(let i = 0; i < list.length; i++) {
      if((message.reqId && message.reqId === list[i].reqId)
        || message.messageId === list[i].messageId) {
        return i;
      }
    }
    return -1;
  }
  findIndex(message, list = []) {
    let index = list.length;
    for(let i = 0; i < list.length; i++) {
      if(list[i].createdAt >= message.createdAt) {
        index = i;
        break;
      }
    }
    return index;
  }
  _loadPreviousMessagesFromCache(callback) {
    const _fetchChunkMessages = callback => {
      const messageContainer = _messageContainer.get(this);
      messageContainer.loadChunkMessages(this.currentChunk,
        {
          offset: this.currentChunk ? this.currentChunk.previousCacheOffset : 0,
          limit: this.filter.limit,
          orderBy: 'createdAt',
          desc: true
        },
        (err, messages) => {
          if(!err) {
            this.currentChunk.previousCacheOffset += messages.length;
            if(this.filter.reverse) {
              messages = messages.reverse();
            }
            for(let i in messages) {
              this._addViewItem(messages[i]);
            }
          }
          callback(err, messages);
        });
    };

    if(!this.currentChunk) {
      const chunkContainer = _chunkContainer.get(this);
      const ts = new Date().getTime();
      chunkContainer.getLatestChunkByTimestamp(this.channel.url, this.filter, ts, (err, item) => {
        if(!err) {
          this.currentChunk = item;
          if(this.currentChunk) {
            this.currentChunk.previousCacheOffset = 0;
            _fetchChunkMessages(callback);
          } else {
            callback(null, []);
          }
        } else {
          callback(err, null);
        }
      });
    } else {
      _fetchChunkMessages(callback);
    }
  }
  loadPreviousMessages(callback) {
    if(!this.isLoading) {
      this.isLoading = true;
      if(!callback) callback = () => {};
      this._loadPreviousMessagesFromCache((err, cachedMessages) => {
        if(!err) {
          const ts = (this.currentChunk && this.currentChunk.isSynced) ? this.currentChunk.startAt : new Date().getTime();
          const rest = (this.currentChunk && this.currentChunk.isSynced) ? this.filter.limit - cachedMessages.length : this.filter.limit;
          if(rest > 0) {
            this.channel.getPreviousMessagesByTimestamp(
              ts,
              false, // inclusive
              rest,
              this.filter.reverse || false,
              this.filter.messageType || '',
              this.filter.customType || '',
              (messages, err) => {
                const sb = this.manager.sb;
                const isSynced = sb.getConnectionState() === sb.ConnectionState.OPEN;
                if(sb.getErrorFirstCallback()) {
                  const temp = messages;
                  messages = err;
                  err = temp;
                }
                if(Array.isArray(messages) && messages.length > 0) {
                  const broadcast = _broadcast.get(this);
                  const chunkContainer = _chunkContainer.get(this);
                  const messageContainer = _messageContainer.get(this);
                  const newChunk = new MessageChunk(this.channel.url, this.filter);
                  newChunk.isSynced = isSynced;
                  
                  /// extend new chunk and broadcast update
                  for(let i in messages) {
                    newChunk.extendWithMessage(messages[i]);
                  }
                  if(this.currentChunk) {
                    if(this.currentChunk.isSynced) {
                      /// continuous prepending by merge (abandon newChunk)
                      this.currentChunk.extendWithChunk(newChunk);
                      chunkContainer.mergePreviousChunkOverlap(this.currentChunk);
                    } else if(this.currentChunk.isSame(newChunk)) {
                      // no change found (abandon newChunk)
                      this.currentChunk.isSynced = isSynced;
                    } else if(this.currentChunk.isOverlap(newChunk)) {
                      // merge with currentChunk (abandon newChunk)
                      this.currentChunk.isSynced = isSynced;
                      this.currentChunk.extendWithChunk(newChunk);
                      chunkContainer.mergePreviousChunkOverlap(this.currentChunk);
                    } else {
                      // no overlap > clear
                      this._clearViewItem();
                      this._setCurrentChunk(newChunk);
                    }
                  } else {
                    this._setCurrentChunk(newChunk);
                  }
  
                  /// upsert messages
                  for(let i in messages) {
                    const cachedMessage = messageContainer.getItem(messages[i].messageId);
                    const hasMessage = this.messages.map(m => m.messageId).indexOf(messages[i].messageId) >= 0;
                    const message = messageContainer.upsert(messages[i]);
                    const isDirty = !cachedMessage || !cachedMessage.isEqual(message);
                    if(isDirty) {
                      broadcast.update(message, this);
                    }
                    if(!hasMessage || isDirty) {
                      this._addViewItem(message);
                    }
                  }
                  this.currentChunk.previousCacheOffset = this.messages.length;
                }
                this.isLoading = false;
                callback(err);
              });
          } else {
            // not connected
            this.isLoading = false;
            callback(new SyncManagerException('Message: Connection required'));
          }
        } else {
          // fully loaded from cache
          this.isLoading = false;
          callback(err);
        }
      });
    } else {
      callback(null);
    }
  }
  isMatchingWithFilter(message) {
    if(this.filter) {
      if(message.channelUrl === this.channel.url) {
        if(this.filter.messageType && this.filter.messageType !== message.messageType) {
          return false;
        }
        if(this.filter.customType && this.filter.customType !== message.customType) {
          return false;
        }
        if(Array.isArray(this.filter.senderUserIds)
          && this.filter.senderUserIds.length > 0
          && message.sender
          && (this.filter.senderUserIds.indexOf(message.sender.userId) < 0)) {
          return false;
        }
        return true;
      } else {
        return false;
      }
    } else {
      return message.channelUrl === this.channel.url;
    }
  }
  _addViewItem(message) {
    this.mutex.lock(unlock => {
      const taskNumber = _yieldTaskNumber.get(this)();
      const currentIndex = this.getIndex(message, this.messages);
      const newIndex = this.findIndex(message, this.messages);

      let action = (currentIndex < 0)
        ? ChangeLog.Action.INSERT
        : ChangeLog.Action.UPDATE;
      if(currentIndex < 0) {
        this.messages.splice(newIndex, 0, message);
      } else {
        if(message.messageId) {
          this.messages[currentIndex] = message;
        }
      }
      for(const key in this.handlers) {
        if(typeof this.handlers[key] === 'function') {
          this.handlers[key](new ChangeLog({
            taskNumber: taskNumber,
            action: action,
            item: message
          }));
        }
      }
      unlock();
    });
  }
  _removeViewItem(messageId) {
    this.mutex.lock(unlock => {
      for(let i in this.messages) {
        if(messageId === this.messages[i].messageId) {
          const deletedMessages = this.messages.splice(i, 1);
          const taskNumber = _yieldTaskNumber.get(this)();
          const action = ChangeLog.Action.REMOVE;
          for(const key in this.handlers) {
            if(typeof this.handlers[key] === 'function') {
              this.handlers[key](new ChangeLog({
                taskNumber: taskNumber,
                action: action,
                item: deletedMessages.length > 0 ? deletedMessages[0] : { messageId: messageId }
              }));
            }
          }
          break;
        }
      }
      unlock();
    });
  }
  _clearViewItem() {
    this.currentChunk = null;
    this.messages = [];
    this.mutex.lock(unlock => {
      const taskNumber = _yieldTaskNumber.get(this)();
      const action = ChangeLog.Action.CLEAR;
      for(const key in this.handlers) {
        if(typeof this.handlers[key] === 'function') {
          this.handlers[key](new ChangeLog({
            taskNumber: taskNumber,
            action: action
          }));
        }
      }
      unlock();
    });
  }
  appendMyMessage(message) {
    const sb = this.manager.sb;
    if(message.sender && sb.currentUser && message.sender.userId === sb.currentUser.userId) {
      if(message.messageId) {
        const broadcast = _broadcast.get(this);
        const messageContainer = _messageContainer.get(this);
        messageContainer.upsert(message);
        broadcast.upsert(message);
      } else {
        // add view but not in container (for temporary message)
        this._addViewItem(message);
      }
    } else {
      throw new SyncManagerException('Can\'t append other\'s message');
    }
  }
  updateMyMessage(message) {
    const sb = this.manager.sb;
    if(message.sender && sb.currentUser && message.sender.userId === sb.currentUser.userId) {
      if(message.messageId) {
        const broadcast = _broadcast.get(this);
        const messageContainer = _messageContainer.get(this);
        messageContainer.upsert(message);
        broadcast.update(message);
      } else {
        this._addViewItem(message);
      }
    } else {
      throw new SyncManagerException('Can\'t update other\'s message');
    }
  }
  removeMyMessage(message) {
    const sb = this.manager.sb;
    if(message.sender && sb.currentUser && message.sender.userId === sb.currentUser.userId) {
      if(message.messageId) {
        const broadcast = _broadcast.get(this);
        const messageContainer = _messageContainer.get(this);
        messageContainer.remove(message);
        broadcast.remove(message);
      } else {
        this._removeViewItem(message);
      }
    } else {
      throw new SyncManagerException('Can\'t remove other\'s message');
    }
  }
  subscribe(key, handler) {
    this.handlers[key] = handler;
  }
  unsubscribe(key) {
    if(this.handlers[key]) {
      delete this.handlers[key];
    }
  }
}