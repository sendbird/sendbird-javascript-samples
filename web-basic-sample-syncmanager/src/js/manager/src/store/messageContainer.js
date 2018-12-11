
import SyncManager from '../SyncManager';
import LocalDB from './engine/localdb.min';

let _cache = {};

/** Message data model inherits sendBirdInstance.BaseMessage
 *  + serialized BaseMessage (UserMessage | FileMessage | AdminMessage)
 *  - chunkId (string)
 */
export const MessageContainer = function(sb) {
  const _col = SyncManager.LocalDB.collection('Message');
  const _upsertToCache = message => {
    _cache[message.messageId] = message;
    return _col.upsert(_cache[message.messageId].serialize());
  };
  const _removeFromCache = messageId => {
    if(_cache[messageId]) {
      delete _cache[messageId];
    }
    return _col.remove(messageId);
  };
  const _clearCache = () => {
    _cache = {};
    return _col.clear();
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

  this.query = (whereClause, options) => {
    return new Promise((resolve, reject) => {
      const query = new LocalDB.Query(whereClause);
      if(options) {
        query.offset = options.offset || 0;
        query.limit = options.limit || 20;
        query.orderBy = options.orderBy || 'createdAt';
        query.desc = options.hasOwnProperty('desc') ? options.desc : true;
      }
  
      _col.find(query)
        .then(messages => {
          const cachedMessages = [];
          for(let i in messages) {
            const message = _deserialize(messages[i]);
            cachedMessages.push(message);
            _cache[message.messageId] = message;
          }
          resolve(cachedMessages);
        })
        .catch(reject);
    });

  };
  this.upsert = message => {
    return new Promise((resolve, reject) => {
      _upsertToCache(message)
        .then(item => resolve(_deserialize(item)))
        .catch(reject);
    });
  };
  this.remove = messageId => {
    return new Promise((resolve, reject) => {
      _removeFromCache(messageId)
        .then(() => resolve(messageId))
        .catch(reject);
    });
  };
  this.getItem = messageId => {
    return new Promise((resolve, reject) => {
      _col.findById(messageId)
        .then(item => resolve(_deserialize(item)))
        .catch(reject);
    });
  };
  this.clear = () => _clearCache();

  this.loadChunkMessages = (chunk, options) => {
    if(!options) {
      options = {};
    }
    return new Promise((resolve, reject) => {
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

      const query = new LocalDB.Query(where);
      query.orderBy = options.orderBy || 'createdAt';
      query.desc = options.hasOwnProperty('desc') ? options.desc : true;
      query.offset = options.offset || 0;
      query.limit = options.limit || Infinity;
      _col.find(query)
        .then(messages => {
          const cachedMessages = [];
          for(let i in messages) {
            cachedMessages.push(_deserialize(messages[i]));
          }
          resolve(cachedMessages);
        })
        .catch(reject);
    });
  };
  return this;
};