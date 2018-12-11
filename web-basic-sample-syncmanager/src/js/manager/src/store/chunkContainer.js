
import SyncManager from '../SyncManager';
import LocalDB from './engine/localdb.min';
import { deepEqual, createId } from '../util/tools.js';

let _cache = {};

const _createFilterKey = function(filter) {
  const list = [];
  for(let key in filter) {
    list.push(`${key}=${filter[key]}`);
  }
  return list.join('&');
};

export class MessageChunk {
  constructor(channelUrl, filter) {
    this.chunkId = createId();
    this.channelUrl = channelUrl;
    this.filterKey = _createFilterKey(filter);
    this.filter = filter;
    this.isSynced = false;
    this.startAt = new Date().getTime();
    this.endAt = 0;
  }
  static createFromJson(item) {
    const chunk = new MessageChunk(item.channelUrl, item.filter);
    chunk.chunkId = item.chunkId;
    chunk.startAt = item.startAt;
    chunk.endAt = item.endAt;
    return chunk;
  }
  static getDefaultFilter() {
    return {
      messageTypeFilter: null,
      customTypeFilter: null,
      senderUserIdsFilter: []
    };
  }
  hasDefaultFilter() {
    const defaultFilter = MessageChunk.getDefaultFilter();
    return deepEqual(this.filter, defaultFilter);
  }
  isOverlap(chunk) {
    return (chunk.startAt <= this.startAt && this.startAt <= chunk.endAt)
      || (chunk.startAt <= this.endAt && this.endAt <= chunk.endAt);
  }
  isSame(chunk) {
    return chunk.startAt === this.startAt && this.endAt === chunk.endAt;
  }
  containsMessage(message) {
    return this.startAt <= message.createdAt && message.createdAt <= this.endAt;
  }
  serialize() {
    return Object.freeze(JSON.parse(JSON.stringify(this)));
  }
  extendWithChunk(chunk) {
    this.extendForwardWithChunk(chunk);
    this.extendBackwardWithChunk(chunk);
    return this;
  }
  extendForwardWithChunk(chunk) {
    this.endAt = Math.max(this.endAt, chunk.endAt);
    return this;
  }
  extendBackwardWithChunk(chunk) {
    this.startAt = Math.min(this.startAt, chunk.startAt);
    return this;
  }
  extendWithMessage(message) {
    this.extendForwardWithMessage(message);
    this.extendBackwardWithMessage(message);
    return this;
  }
  extendForwardWithMessage(message) {
    this.endAt = Math.max(this.endAt, message.createdAt);
    return this;
  }
  extendBackwardWithMessage(message) {
    this.startAt = Math.min(this.startAt, message.createdAt);
    return this;
  }
}

/** MessageChunk data model
 *  - chunkId (string)
 *  - channelUrl (string)
 *  - filterKey (string)
 *  - filter (object)
 *    - messageType (string)
 *    - customType (string)
 *    - senderUserIds (array)
 *  - startAt (integer) timestamp of the oldest message in chunk
 *  - endAt (integer) timestamp of the latest message in chunk
 */
export const MessageChunkContainer = function() {
  const _col = SyncManager.LocalDB.collection('MessageChunk');
  const _upsertToCache = chunk => {
    _cache[chunk.chunkId] = chunk;
    return _col.upsert(_cache[chunk.chunkId].serialize());
  };
  const _removeFromCache = chunkId => {
    if(_cache[chunkId]) {
      delete _cache[chunkId];
    }
    return _col.remove(chunkId);
  };
  const _clearCache = () => {
    _cache = {};
    return _col.clear();
  };

  this.query = (whereClause, options) => {
    return new Promise((resolve, reject) => {
      const query = new LocalDB.Query(whereClause);
      if(options) {
        query.offset = options.offset || 0;
        query.limit = options.limit || 20;
        query.orderBy = options.orderBy || 'endAt';
        query.desc = options.hasOwnProperty('desc') ? options.desc : true;
      }
  
      _col.find(query)
        .then(chunks => {
          const cachedChunks = [];
          for(let i in chunks) {
            const chunk = MessageChunk.createFromJson(chunks[i]);
            cachedChunks.push(chunk);
            _cache[chunk.chunkId] = chunk;
          }
          resolve(cachedChunks);
        })
        .catch(reject);
    });
  };
  this.upsert = chunk => {
    return new Promise((resolve, reject) => {
      _upsertToCache(chunk)
        .then(item => resolve(MessageChunk.createFromJson(item)))
        .catch(reject);
    });
  };
  this.remove = chunkId => {
    return new Promise((resolve, reject) => {
      _removeFromCache(chunkId)
        .then(() => resolve(chunkId))
        .catch(reject);
    });
  };
  this.clear = () => _clearCache();

  this.getLatestChunkByTimestamp = (channelUrl, filter, ts) => {
    return new Promise((resolve, reject) => {
      const query = new LocalDB.Query({
        'channelUrl': channelUrl,
        'filterKey': _createFilterKey(filter),
        'startAt': { '<=': ts }
      });
      query.limit = 1;
      query.orderBy = 'endAt';
      query.desc = true;
  
      _col.find(query)
        .then(chunks => {
          const chunk = chunks.length > 0 ? MessageChunk.createFromJson(chunks[0]) : null;
          if(chunk) {
            if(!chunk.hasDefaultFilter()) {
              const query = new LocalDB.Query({
                'channelUrl': channelUrl,
                'filterKey': _createFilterKey(MessageChunk.getDefaultFilter()),
                'startAt': { '<=': ts }
              });
              query.limit = 1;
              query.orderBy = 'endAt';
              query.desc = true;
  
              _col.find(query)
                .then(chunks => {
                  const defaultChunk = chunks.length > 0 ? MessageChunk.createFromJson(chunks[0]) : null;
                  if(defaultChunk) {
                    if(defaultChunk.endAt > chunk.endAt) {
                      if(defaultChunk.isOverlap(chunk)) {
                        chunk.extendWithChunk(defaultChunk);
                        this.upsert(chunk).then(resolve).catch(reject);
                      } else {
                        const copiedChunk = new MessageChunk(chunk.channelUrl, chunk.filter);
                        copiedChunk.startAt = defaultChunk.startAt;
                        copiedChunk.endAt = defaultChunk.endAt;
                        this.upsert(copiedChunk).then(resolve).catch(reject);
                      }
                    } else {
                      resolve(chunk);
                    }
                  } else {
                    resolve(chunk);
                  }
                })
                .catch(reject);
            } else {
              resolve(chunk);
            }
          } else {
            resolve(null);
          }
        })
        .catch(reject);
    });
  };
  this.mergePreviousChunkOverlap = chunk => {
    return new Promise((resolve, reject) => {
      const query = new LocalDB.Query({
        'chunkId': { '!=': chunk.chunkId },
        'channelUrl': chunk.channelUrl,
        'filterKey': chunk.filterKey,
        'endAt': { '>=': chunk.startAt }
      });
      query.limit = Infinity;
  
      _col.find(query)
        .then(chunks => {
          if(chunks.length > 0) {
            const query = new LocalDB.Query({
              'chunkId': {
                '/in' : chunks.map(cnk => cnk.chunkId)
              }
            });
            _col.removeIf(query)
              .then(() => {
                for(let i in chunks) {
                  chunk.extendWithChunk(chunks[i]);
                }
                this.upsert(chunk).then(resolve).catch(reject);
              })
              .catch(reject);
          } else {
            resolve();
          }
        })
        .catch(reject);
    });
  };
  return this;
};