import Mutex from '../util/mutex.js';
import SyncManagerException from '../util/exception.js';
import ChangeLog from '../util/changeLog.js';

const _yieldTaskNumber = new WeakMap();
const _broadcast = new WeakMap();
const _channelContainer = new WeakMap();

export default class ChannelCollection {
  constructor({ manager, broadcast, channelContainer, type, query }) {
    this.manager = manager;
    this.type = type;
    this.query = query;

    this.isSynced = false;
    this.isLoading = false;
    this.channels = [];
    this.handlers = {};
    this.mutex = new Mutex();

    let _taskNumberSeed = 0;
    _yieldTaskNumber.set(this, () => {
      return ++_taskNumberSeed;
    });
    _broadcast.set(this, broadcast);
    _channelContainer.set(this, channelContainer);
  }
  _pause() {
    this.isSynced = false;
    this.isLoading = false;
  }
  _reset() {
    const previousQuery = this.query;
    switch(this.type) {
      case 'MyGroupChannelListQuery':
        this.query = new this.manager.sb.GroupChannel.createMyGroupChannelListQuery();
        break;
      case 'PublicGroupChannelListQuery':
        this.query = new this.manager.sb.GroupChannel.createPublicGroupChannelListQuery();
        break;
    }
    for(let key in previousQuery) {
      if(typeof previousQuery[key] !== 'function') {
        this.query[key] = previousQuery[key];
      }
    }
    this.loadChannels();
  }
  getIndex(channel, list = []) {
    return list.map(ch => ch.url).indexOf(channel.url);
  }
  findIndex(channel, list = []) {
    let key = null;
    let desc = false;
    let index = list.length;
    switch(this.query.order) {
      case 'latest_last_message':
        key = 'lastMessageUpdatedAt';
        desc = true;
        break;

      case 'chronological':
        key = 'createdAt';
        desc = true;
        break;

      case 'channel_name_alphabetical':
        key = 'name';
        break;

      default:
        key = 'lastMessageUpdatedAt';
        desc = true;
    }
    for(let i = 0; i < list.length; i++) {
      const comparedChannel = list[i];
      if(channel.url === comparedChannel.url) {
        index = i;
        break;
      } else if((desc && channel[key] > comparedChannel[key])
        || (!desc && channel[key] < comparedChannel[key])) {
        index = i;
        break;
      }
    }
    return index;
  }
  isMatchingWithQuery(channel) {
    const sb = this.manager.sb;
    let matching = true;

    if(channel.isGroupChannel()) {
      if(!channel.isSuper) {
        if(this.query.nicknameContainsFilter) {
          let nicknameContainerFilterMatching = false;
          for(let i in channel.members) {
            if(channel.members[i].nickname.indexOf(this.query.nicknameContainsFilter) >= 0) {
              nicknameContainerFilterMatching = true;
              break;
            }
          }
          if(!nicknameContainerFilterMatching) {
            return false;
          }
        }
        if(this.query.userIdsFilter.length > 0) {
          let userIdsFilterMatching = false;
          const memberIds = channel.members.map(m => m.userId);
          const exactMatch = this.query.userIdsFilterExactMatch;
          const queryType = this.query.queryType;
          if(exactMatch) {
            userIdsFilterMatching = memberIds.length === this.query.userIdsFilter.length
              && this.query.userIdsFilter.every(v => memberIds.indexOf(v) >= 0);
          } else {
            if(queryType === 'AND') {
              userIdsFilterMatching = this.query.userIdsFilter.every(v => memberIds.indexOf(v) >= 0);
            } else if(queryType === 'OR') {
              userIdsFilterMatching = this.query.userIdsFilter.reduce(((a, c) => a = a || memberIds.indexOf(c) >= 0), false);
            }
          }
          if(!userIdsFilterMatching) {
            return false;
          }
        }
      }
    }
    if(this.query.channelNameContainsFilter) {
      matching = matching && channel.name.indexOf(this.query.channelNameContainsFilter) >= 0;
    }
    if(this.query.channelUrlsFilter.length > 0) {
      matching = matching && this.query.channelUrlsFilter.indexOf(channel.url) >= 0;
    }
    if(this.query.memberStateFilter !== sb.GroupChannel.memberStateFilter.ALL) {
      switch(this.query.memberStateFilter) {
        case sb.GroupChannel.memberStateFilter.JOINED:
          matching = matching && channel.myMemberState === sb.GroupChannel.memberStateFilter.JOINED;
          break;

        case sb.GroupChannel.memberStateFilter.INVITED:
        case sb.GroupChannel.memberStateFilter.INVITED_BY_FRIEND:
        case sb.GroupChannel.memberStateFilter.INVITED_BY_NON_FRIEND:
          matching = matching && channel.myMemberState === sb.GroupChannel.memberStateFilter.INVITED;
          break;
      }
    }
    if(this.query.customTypesFilter.length > 0) {
      matching = matching && this.query.customTypesFilter.indexOf(channel.customType) >= 0;
    }
    if(this.query.customTypeStartsWithFilter) {
      matching = matching && channel.customType.startsWith(this.query.customTypeStartsWithFilter);
    }
    if(this.query.superChannelFilter !== 'all') {
      switch(this.query.superChannelFilter) {
        case sb.GroupChannel.superChannelFilter.SUPER:
          matching = matching && channel.isSuper;
          break;
        case sb.GroupChannel.superChannelFilter.NONSUPER:
          matching = matching && !channel.isSuper;
          break;
      }
    }
    if(this.query.publicChannelFilter !== 'all') {
      switch(this.query.publicChannelFilter) {
        case sb.GroupChannel.publicChannelFilter.PUBLIC:
          matching = matching && channel.isPublic;
          break;
        case sb.GroupChannel.publicChannelFilter.PRIVATE:
          matching = matching && !channel.isPublic;
          break;
      }
    }
    return matching;
  }
  _loadChannelsFromCache(callback) {
    /** channel cache is only for fast-load at first
     *  disabled once latest cached channel is loaded
     */
    if(this.channels.length === 0) {
      const channelContainer = _channelContainer.get(this);
      const sb = this.manager.sb;
      const where = {};

      if(this.query.nicknameContainsFilter) {
        where['members'] = {
          '/where': members => {
            for(let i in members) {
              if(members[i].nickname.indexOf(this.query.nicknameContainsFilter) >= 0) {
                return true;
              }
            }
            return false;
          }
        };
      }
      if(this.query.userIdsFilter.length > 0) {
        where['members'] = {
          '/where': members => {
            const memberIds = members.map(m => m.userId);
            if(this.query.userIdsFilterExactMatch) {
              return memberIds.length === this.query.userIdsFilter.length
                && this.query.userIdsFilter.every(userId => memberIds.indexOf(userId) >= 0);
            } else {
              if(this.query.queryType === 'AND') {
                return this.query.userIdsFilter.every(userId => memberIds.indexOf(userId) >= 0);
              } else if(this.query.queryType === 'OR') {
                return this.query.userIdsFilter.reduce(((isMatched, userId) => isMatched = isMatched || memberIds.indexOf(userId) >= 0), false);
              }
            }
            return false;
          }
        };
      }
      if(this.query.channelNameContainsFilter) {
        where['name'] = {
          '/regex': new RegExp(this.query.channelNameContainsFilter)
        };
      }
      if(this.query.channelUrlsFilter.length > 0) {
        where['url'] = {
          '/in': this.query.channelUrlsFilter
        };
      }
      if(this.query.memberStateFilter !== sb.GroupChannel.memberStateFilter.ALL) {
        switch(this.query.memberStateFilter) {
          case sb.GroupChannel.memberStateFilter.JOINED:
            where['myMemberState'] = sb.GroupChannel.memberStateFilter.JOINED;
            break;
  
          case sb.GroupChannel.memberStateFilter.INVITED:
          case sb.GroupChannel.memberStateFilter.INVITED_BY_FRIEND:
          case sb.GroupChannel.memberStateFilter.INVITED_BY_NON_FRIEND:
            where['myMemberState'] = {
              '/in': [
                sb.GroupChannel.memberStateFilter.INVITED,
                sb.GroupChannel.memberStateFilter.INVITED_BY_FRIEND,
                sb.GroupChannel.memberStateFilter.INVITED_BY_NON_FRIEND
              ]
            };
            break;
        }
      }
      if(typeof this.query.customTypeFilter === 'string' && this.query.customTypeFilter) {
        where['customType'] = this.query.customTypeFilter;
      }
      if(Array.isArray(this.query.customTypesFilter) && this.query.customTypesFilter.length > 0) {
        where['customType'] = {
          '/in': this.query.customTypesFilter
        };
      }
      if(typeof this.query.customTypeStartsWithFilter === 'string'
        && this.query.customTypeStartsWithFilter) {
        where['customType'] = {
          '/regex': new RegExp(`^${this.query.customTypeStartsWithFilter}`)
        };
      }
      if(this.query.superChannelFilter !== 'all') {
        switch(this.query.superChannelFilter) {
          case sb.GroupChannel.superChannelFilter.SUPER:
            where['isSuper'] = true;
            break;
          case sb.GroupChannel.superChannelFilter.NONSUPER:
            where['isSuper'] = false;
            break;
        }
      }
      if(this.query.publicChannelFilter !== 'all') {
        switch(this.query.publicChannelFilter) {
          case sb.GroupChannel.publicChannelFilter.PUBLIC:
            where['isPublic'] = true;
            break;
          case sb.GroupChannel.publicChannelFilter.PRIVATE:
            where['isPublic'] = false;
            break;
        }
      }
  
      let orderBy = null;
      let desc = false;
      switch(this.query.order) {
        case 'latest_last_message':
          orderBy = 'lastMessageUpdatedAt';
          desc = true;
          break;
  
        case 'chronological':
          orderBy = 'createdAt';
          desc = true;
          break;
  
        case 'channel_name_alphabetical':
          orderBy = 'name';
          break;
  
        default:
          orderBy = 'lastMessageUpdatedAt';
          desc = true;
      }
      channelContainer.query(where,
        {
          orderBy: orderBy,
          desc: desc,
          offset: this.channels.length,
          limit: this.query.limit
        })
        .then(channels => callback(null, channels))
        .catch(err => callback(err));
    } else {
      callback(null, []);
    }
  }
  loadChannels(callback) {
    if(!callback) callback = () => {};
    if(!this.isLoading) {
      this.isLoading = true;
      this._loadChannelsFromCache((err, cachedChannels) => {
        if(cachedChannels) {
          for(let i in cachedChannels) {
            const index = this.channels.map(ch => ch.url).indexOf(cachedChannels[i].url);
            const isDirty = index < 0 || !this.channels[index].isEqual(cachedChannels[i]);
            if(isDirty) {
              this._addViewItem(cachedChannels[i]);
            }
          }
        }
        if(this.query.hasNext) {
          const sb = this.manager.sb;
          this.query.next((channels, err) => {
            const isSynced = sb.getConnectionState() === sb.ConnectionState.OPEN;
            if(sb.getErrorFirstCallback()) {
              const temp = channels;
              channels = err;
              err = temp;
            }
            if(Array.isArray(channels)) {
              const broadcast = _broadcast.get(this);
              const channelContainer = _channelContainer.get(this);

              const operations = [];
              channels.forEach(channel => {
                operations.push(new Promise((resolve, reject) => {
                  channelContainer.getItem(channel.url)
                    .then(cachedChannel => {
                      const hasChannel = this.channels.map(ch => ch.url).indexOf(channel.url) >= 0;
                      channelContainer.upsert(channel)
                        .then(channel => {
                          const isDirty = !cachedChannel || !cachedChannel.isEqual(channel);
                          if(isDirty) {
                            broadcast.update(channel, this);
                          }
                          if(!hasChannel || isDirty) {
                            this._addViewItem(channel);
                          }
                          resolve();
                        })
                        .catch(reject);
                    })
                    .catch(reject);
                }));
              });
              Promise.all(operations)
                .then(() => {
                  if(!this.isSynced) {
                    this.mutex.lock(unlock => {
                      const loadedChannelUrls = channels.map(ch => ch.url);
                      for(let i in this.channels) {
                        if(loadedChannelUrls.indexOf(this.channels[i].url) < 0) {
                          const taskNumber = _yieldTaskNumber.get(this)();
                          const action = ChangeLog.Action.REMOVE;
                          for(const key in this.handlers) {
                            if(typeof this.handlers[key] === 'function') {
                              this.handlers[key](new ChangeLog({
                                taskNumber: taskNumber,
                                action: action,
                                item: this.channels[i]
                              }));
                            }
                          }
                        }
                      }
                      unlock();
                    });
                    this.isSynced = isSynced;
                  }
                  this.isLoading = false;
                  callback(null);
                })
                .catch(err => {
                  this.isLoading = false;
                  callback(err);
                });
            } else {
              this.isLoading = false;
              callback(err);
            }
          });
        } else {
          this.isLoading = false;
          callback(new SyncManagerException('Channel: Connection required'));
        }
      });
    } else {
      callback(null);
    }
  }
  _addViewItem(channel) {
    this.mutex.lock(unlock => {
      const taskNumber = _yieldTaskNumber.get(this)();
      const currentIndex = this.getIndex(channel, this.channels);
      const newIndex = this.findIndex(channel, this.channels);

      let action = (currentIndex < 0)
        ? ChangeLog.Action.INSERT
        : ChangeLog.Action.UPDATE;
      if(currentIndex < 0) {
        if(newIndex < this.channels.length) {
          this.channels.splice(newIndex, 0, channel);
        } else {
          this.channels.push(channel);
        }
      } else {
        if(currentIndex !== newIndex) {
          action = ChangeLog.Action.MOVE;
          this.channels.splice(currentIndex, 1);
          if(newIndex > currentIndex) {
            this.channels.splice(newIndex - 1, 0, channel);
          } else {
            this.channels.splice(newIndex, 0, channel);
          }
        } else {
          this.channels[currentIndex] = channel;
        }
      }
      for(const key in this.handlers) {
        if(typeof this.handlers[key] === 'function') {
          this.handlers[key](new ChangeLog({
            taskNumber: taskNumber,
            action: action,
            item: channel
          }));
        }
      }
      unlock();
    });
  }
  _removeViewItem(channel) {
    this.mutex.lock(unlock => {
      for(let i in this.channels) {
        if(channel.url === this.channels[i].url) {
          this.channels.splice(i, 1);

          const taskNumber = _yieldTaskNumber.get(this)();
          const action = ChangeLog.Action.REMOVE;
          for(const key in this.handlers) {
            if(typeof this.handlers[key] === 'function') {
              this.handlers[key](new ChangeLog({
                taskNumber: taskNumber,
                action: action,
                item: channel
              }));
            }
          }
          break;
        }
      }
      unlock();
    });
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