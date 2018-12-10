
import SyncManager from '../SyncManager';
import LocalDB from './engine/localdb.min';

let _cache = {};

/** Channel data model inherits sendBirdInstance.BaseChannel
 *  + serialized BaseChannel (GroupChannel | OpenChannel)
 */
export const ChannelContainer = function(sb) {
  const _col = SyncManager.LocalDB.collection('GroupChannel');
  const _upsertToCache = channel => {
    return new Promise((resolve, reject) => {
      const lastMessageUpdatedAt = channel.lastMessage
        ? channel.lastMessage.createdAt
        : channel.createdAt;
      if(_cache[channel.url]) {
        if(_cache[channel.url].lastMessageUpdatedAt <= lastMessageUpdatedAt) {
          channel.lastMessageUpdatedAt = lastMessageUpdatedAt;
          _cache[channel.url] = channel;
          _col.upsert(_cache[channel.url].serialize()).then(resolve).catch(reject);
        } else {
          resolve(_cache[channel.url]);
        }
      } else {
        channel.lastMessageUpdatedAt = lastMessageUpdatedAt;
        _cache[channel.url] = channel;
        _col.upsert(_cache[channel.url].serialize()).then(resolve).catch(reject);
      }
    });

  };
  const _removeFromCache = channel => {
    return new Promise((resolve, reject) => {
      if(_cache[channel.url]) {
        delete _cache[channel.url];
      }
      _col.remove(channel.url)
        .then(() => {
          const query = new LocalDB.Query({ 'channelUrl': channel.url });
          const chunkCollection = SyncManager.LocalDB.collection('MessageChunk');
          chunkCollection.removeIf(query)
            .then(() => {
              const messageCollection = SyncManager.LocalDB.collection('Message');
              messageCollection.removeIf(query).then(resolve).catch(reject);
            })
            .catch(reject);
        })
        .catch(reject);
    });

  };
  const _clearCache = () => {
    return new Promise((resolve, reject) => {
      _cache = {};
      _col.clear()
        .then(() => {
          const chunkCollection = SyncManager.LocalDB.collection('MessageChunk');
          chunkCollection.clear()
            .then(() => {
              const messageCollection = SyncManager.LocalDB.collection('Message');
              messageCollection.clear().then(resolve).catch(reject);
            })
            .catch(reject);
        })
        .catch(reject);
    });
  };
  const _deserialize = serialized => {
    if(serialized) {
      const channel = sb.GroupChannel.buildFromSerializedData(serialized);
      channel.lastMessageUpdatedAt = channel.lastMessage
        ? channel.lastMessage.createdAt
        : channel.createdAt;
      return channel;
    }
    return null;
  };

  this.query = (whereClause, options) => {
    return new Promise((resolve, reject) => {
      const query = new LocalDB.Query(whereClause);
      if(options) {
        query.offset = options.offset || 0;
        query.limit = options.limit || 20;
        query.orderBy = options.orderBy || 'lastMessageUpdatedAt';
        query.desc = options.hasOwnProperty('desc') ? options.desc : true;
      }
  
      _col.find(query)
        .then(channels => {
          const cachedChannels = [];
          for(let i in channels) {
            const channel = _deserialize(channels[i]);
            cachedChannels.push(channel);
            _cache[channel.url] = channel;
          }
          resolve(cachedChannels);
        })
        .catch(reject);
    });
  };
  this.upsert = channel => {
    return new Promise((resolve, reject) => {
      _upsertToCache(channel)
        .then(item => resolve(_deserialize(item)))
        .catch(reject);
    });
  };
  this.remove = channel => {
    return new Promise((resolve, reject) => {
      _removeFromCache(channel)
        .then(item => resolve(_deserialize(item)))
        .catch(reject);
    });
  };
  this.getItem = url => {
    return new Promise((resolve, reject) => {
      _col.findById(url)
        .then(item => resolve(_deserialize(item)))
        .catch(reject);
    });
  };
  this.clear = () => _clearCache();
  return this;
};