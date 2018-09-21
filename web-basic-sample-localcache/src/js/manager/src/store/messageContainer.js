
import LocalDB from './engine/localdb.min.js';

let _cache = {};

/** Message data model inherits sendBirdInstance.BaseMessage
 *  + serialized BaseMessage (UserMessage | FileMessage | AdminMessage)
 *  - chunkId (string)
 */
export const MessageContainer = function(sb) {
  const _store = new LocalDB({
    tableName: 'Message',
    timestampColumn: 'createdAt',
    dependency: {
      'Channel': {
        key: 'channelUrl',
        constraint: true
      }
    },
    index: [
      [ 'channelUrl', 'createdAt' ]
    ]
  });

  const _upsertToCache = (message) => {
    _cache[message.messageId] = message;
    _store.setItem(message.messageId, _cache[message.messageId].serialize());
    return _cache[message.messageId];
  };
  const _removeFromCache = (messageId) => {
    if(_cache[messageId]) {
      delete _cache[messageId];
    }
    _store.removeItem(messageId);
    return messageId;
  };
  const _clearCache = () => {
    _cache = {};
    _store.clear();
  };
  const _deserialize = serialized => {
    let message = null;
    if(serialized) {
      if(serialized.messageType === 'user') {
        message = sb.UserMessage.buildFromSerializedData(serialized);
      } else if(serialized.messageType === 'file') {
        message = sb.FileMessage.buildFromSerializedData(serialized);
      } else if(serialized.messageType === 'admin') {
        message = sb.AdminMessage.buildFromSerializedData(serialized);
      }
    }
    return message;
  };

  this.query = (whereClause, options, callback) => {
    _store.find({
      condition: whereClause,
      options: options
    },
    messages => {
      const cachedMessages = [];
      for(let i in messages) {
        const message = _deserialize(messages[i]);
        if(message) {
          cachedMessages.push(_upsertToCache(message));
        }
      }
      callback(null, cachedMessages);
    });
  };
  this.upsert = message => _upsertToCache(message);
  this.remove = messageId => _removeFromCache(messageId);
  this.getItem = messageId => _deserialize(_store.getItem(messageId));
  this.clear = () => _clearCache();

  this.loadChunkMessages = (chunk, options, callback) => {
    const where = {
      'channelUrl': chunk.channelUrl,
      'createdAt': {
        '>=': chunk.startAt,
        '<=': chunk.endAt
      }
    };
    if(chunk.filter.messageType) {
      where['messageType'] = chunk.filter.messageType;
    }
    if(chunk.filter.customType) {
      where['customType'] = chunk.filter.customType;
    }
    if(chunk.filter.senderUserIds && chunk.filter.senderUserIds.length > 0) {
      where['sender.userId'] = {
        '/in': chunk.filter.senderUserIds
      };
    }
    if(!options) {
      options = {
        orderBy: 'createdAt',
        desc: true
      };
    }

    _store.find({
      condition: where,
      options: options
    },
    (err, messages) => {
      const cachedMessages = [];
      if(!err) {
        for(let i in messages) {
          cachedMessages.push(_deserialize(messages[i]));
        }
      }
      callback(err, cachedMessages);
    });
  };
  return this;
};