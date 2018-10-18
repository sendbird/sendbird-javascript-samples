
import LocalDB from './engine/localdb.min.js';
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
    return JSON.parse(JSON.stringify(this));
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
  const _store = new LocalDB({
    tableName: 'MessageChunk',
    timestampColumn: 'endAt',
    dependency: {
      'Channel': {
        key: 'channelUrl',
        constraint: true
      }
    },
    index: [
      [ 'channelUrl', 'filterKey', 'endAt' ]
    ]
  });

  const _upsertToCache = (chunk) => {
    _cache[chunk.chunkId] = chunk;
    _store.setItem(chunk.chunkId, _cache[chunk.chunkId].serialize());
    return _cache[chunk.chunkId];
  };
  const _removeFromCache = (chunkId) => {
    if(_cache[chunkId]) {
      delete _cache[chunkId];
    }
    _store.removeItem(chunkId);
  };
  const _clearCache = () => {
    _cache = {};
    _store.clear();
  };

  this.query = (whereClause, options, callback) => {
    _store.find({
      condition: whereClause,
      options: options
    },
    chunks => {
      const cachedChunks = [];
      for(let i in chunks) {
        const chunk = MessageChunk.createFromJson(chunks[i]);
        cachedChunks.push(_upsertToCache(chunk));
      }
      callback(null, cachedChunks);
    });
  };
  this.upsert = chunk => _upsertToCache(chunk);
  this.remove = chunkId => _removeFromCache(chunkId);
  this.clear = () => _clearCache();

  this.getLatestChunkByTimestamp = (channelUrl, filter, ts, callback) => {
    _store.findOne({
      condition: {
        'channelUrl': channelUrl,
        'filterKey': _createFilterKey(filter),
        'startAt': { '<=': ts }
      },
      options: {
        orderBy: 'endAt',
        desc: true
      }
    },
    (err, item) => {
      const chunk = item ? MessageChunk.createFromJson(item) : null;
      if(chunk) {
        if(!chunk.hasDefaultFilter()) {
          _store.findOne({
            condition: {
              'channelUrl': channelUrl,
              'filterKey': _createFilterKey(MessageChunk.getDefaultFilter()),
              'startAt': { '<=': ts }
            },
            options: {
              orderBy: 'endAt',
              desc: true
            }
          },
          (err, defaultChunk) => {
            if(!err) {
              if(defaultChunk) {
                if(defaultChunk.endAt > chunk.endAt) {
                  if(defaultChunk.isOverlap(chunk)) {
                    chunk.extendWithChunk(defaultChunk);
                    this.upsert(chunk);
                    callback(null, chunk);
                  } else {
                    const copiedChunk = new MessageChunk(chunk.channelUrl, chunk.filter);
                    copiedChunk.startAt = defaultChunk.startAt;
                    copiedChunk.endAt = defaultChunk.endAt;
                    this.upsert(copiedChunk);
                    callback(null, copiedChunk);
                  }
                } else {
                  callback(null, chunk);
                }
              } else {
                callback(null, chunk);
              }
            } else {
              callback(err, null);
            }
          });
        } else {
          callback(null, chunk);
        }
      } else {
        callback(err, null);
      }
    });
  };
  this.mergePreviousChunkOverlap = (chunk, callback) => {
    if(!callback) callback = () => {};
    this.query({
      'chunkId': { '!==': chunk.chunkId },
      'channelUrl': chunk.channelUrl,
      'filterKey': chunk.filterKey,
      'endAt': { '>=': chunk.startAt }
    },
    {
      limit: Infinity
    },
    (err, chunks) => {
      if(!err && chunks && chunks.length > 0) {
        for(let i in chunks) {
          chunk.extendWithChunk(chunks[i]);
          this.remove(chunks[i].chunkId);
        }
        this.upsert(chunk);
      }
      callback(err, chunk);
    });
  };
  return this;
};