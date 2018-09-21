
import MessageCollection from './collection/messageCollection';
import { MessageContainer } from './store/messageContainer';
import { MessageChunkContainer } from './store/chunkContainer';
import { MessageBroadcast } from './broadcast/messageBroadcast';

let _messageManager = null;
const _messageCollections = new WeakMap();
const _chunkContainer = new WeakMap();
const _messageContainer = new WeakMap();
const _broadcast = new WeakMap();

const CONNECTION_HANDLER_KEY = 'syncManager_messageManager_connectionHandler_' + new Date().getTime();
const CHANNEL_HANDLER_KEY = 'syncManager_messageManager_channelHandler_' + new Date().getTime();

export default class MessageManager {
  constructor(sendBird) {
    if(!_messageManager) {
      _messageManager = this;
      
      const sb = this.sb = sendBird;
      const messageContainer = new MessageContainer(sb);
      const chunkContainer = new MessageChunkContainer(sb);
      const broadcast = new MessageBroadcast();

      _messageCollections.set(this, []);
      _messageContainer.set(this, messageContainer);
      _chunkContainer.set(this, chunkContainer);
      _broadcast.set(this, broadcast);

      const connectionHandler = new sb.ConnectionHandler();
      connectionHandler.onReconnectStarted = () => {
        broadcast.pause();
      };
      connectionHandler.onReconnectSucceeded = () => {
        broadcast.reset();
      };
      sb.addConnectionHandler(CONNECTION_HANDLER_KEY, connectionHandler);

      const channelHandler = new sb.ChannelHandler();
      const eventKeys = Object.keys(channelHandler);
      eventKeys.forEach(event => {
        channelHandler[event] = (...args) => {
          const collections = _messageCollections.get(this);
          if(Array.isArray(collections)) {
            switch(event) {
              case 'onMessageReceived': {
                const message = messageContainer.upsert(args[1]);
                broadcast.upsert(message);
                break;
              }

              case 'onReadReceiptUpdated': {
                const channel = args[0];
                broadcast.read(channel);
                break;
              }

              case 'onMessageUpdated': {
                const message = messageContainer.upsert(args[1]);
                broadcast.update(message);
                break;
              }

              case 'onMessageDeleted': {
                const messageId = messageContainer.remove(parseInt(args[1]));
                broadcast.remove(messageId);
                break;
              }
            }
          }
        };
      });
      sb.addChannelHandler(CHANNEL_HANDLER_KEY, channelHandler);
    } else {
      return _messageManager;
    }
  }
  static get instance() {
    return _messageManager;
  }
  createMessageCollection(channel, filter) {
    const broadcast = _broadcast.get(this);
    const collection = new MessageCollection({
      manager: this,
      broadcast,
      messageContainer: _messageContainer.get(this),
      chunkContainer: _chunkContainer.get(this),
      channel,
      filter
    });
    if(collection) {
      broadcast.addCollection(collection);
    }
    return collection;
  }
  removeMessageCollection(collection) {
    const broadcast = _broadcast.get(this);
    broadcast.removeCollection(collection);
  }
  clearCache() {
    const messageContainer = _messageContainer.get(this);
    const chunkContainer = _chunkContainer.get(this);
    messageContainer.clear();
    chunkContainer.clear();
  }
  syncChangeLog(channel) {
    if(localStorage) {
      const messageContainer = _messageContainer.get(this);
      const broadcast = _broadcast.get(this);

      const tokenKey = `last-changeLog-token-${channel.url}`;
      const lastChangeLogToken = localStorage.getItem(tokenKey) || null;
      channel.getMessageChangeLogsByToken(lastChangeLogToken, (result, err) => {
        if(this.sb.getErrorFirstCallback()) {
          const temp = result;
          result = err;
          err = temp;
        }
        if(!err) {
          for(let i in result.updatedMessages) {
            const currentMessage = messageContainer.getItem(result.updatedMessages[i].messageId);
            const message = messageContainer.upsert(result.updatedMessages[i]);
            const isDirty = !currentMessage || !currentMessage.isEqual(message);
            if(isDirty) {
              broadcast.update(message);
            }
          }
          for(let i in result.deletedMessageIds) {
            messageContainer.remove(result.deletedMessageIds[i]);
            broadcast.remove(result.deletedMessageIds[i]);
          }
          localStorage.setItem(tokenKey, result.token);
          if(result.hasMore) {
            this.syncChangeLog(channel);
          }
        }
      });
    }
  }
  start() {
    const broadcast = _broadcast.get(this);
    broadcast.reset();
  }
  stop() {
    const broadcast = _broadcast.get(this);
    broadcast.pause();
  }
  reset() {
    if(_messageManager) {
      _messageManager.clearCache();
      _messageManager.sb.removeConnectionHandler(CONNECTION_HANDLER_KEY);
      _messageManager.sb.removeChannelHandler(CHANNEL_HANDLER_KEY);
      _messageManager = null;
    }
  }
}