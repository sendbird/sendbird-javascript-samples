
import LocalDB from './engine/localdb.min.js';

let _cache = {};

/** Channel data model inherits sendBirdInstance.BaseChannel
 *  + serialized BaseChannel (GroupChannel | OpenChannel)
 */
export const ChannelContainer = function(sb) {
  const _store = new LocalDB({
    tableName: 'Channel',
    timestampColumn: 'createdAt'
  });

  const _upsertToCache = channel => {
    const lastMessageUpdatedAt = channel.lastMessage
      ? channel.lastMessage.createdAt
      : channel.createdAt;

    if(_cache[channel.url]) {
      if(_cache[channel.url].lastMessageUpdatedAt <= lastMessageUpdatedAt) {
        channel.lastMessageUpdatedAt = lastMessageUpdatedAt;
        _cache[channel.url] = channel;
        _store.setItem(channel.url, _cache[channel.url].serialize());
      }
    } else {
      channel.lastMessageUpdatedAt = lastMessageUpdatedAt;
      _cache[channel.url] = channel;
      _store.setItem(channel.url, _cache[channel.url].serialize());
    }
    return _cache[channel.url];
  };
  const _removeFromCache = channel => {
    if(_cache[channel.url]) {
      delete _cache[channel.url];
    }
    _store.removeItem(channel.url);
  };
  const _clearCache = () => {
    _cache = {};
    _store.clear();
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

  this.query = (whereClause, options, callback) => {
    _store.find({
      condition: whereClause,
      options: options
    },
    channels => {
      const cachedChannels = [];
      for(let i in channels) {
        const channel = _deserialize(channels[i]);
        cachedChannels.push(_upsertToCache(channel));
      }
      callback(null, cachedChannels);
    });
  };
  this.upsert = channel => _upsertToCache(channel);
  this.remove = channel => _removeFromCache(channel);
  this.getItem = url => _deserialize(_store.getItem(url));
  this.clear = () => _clearCache();
  return this;
};