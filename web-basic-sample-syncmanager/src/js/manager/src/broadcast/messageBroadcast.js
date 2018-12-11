
import { MessageChunk } from '../store/ChunkContainer.js';

export const MessageBroadcast = function() {
  let _collections = [];

  this.addCollection = col => {
    if(_collections.indexOf(col) < 0) {
      _collections.push(col);
    }
  };
  this.removeCollection = col => {
    const index = _collections.indexOf(col);
    if(index >= 0) {
      _collections[index]._pause();
      _collections.splice(index, 1);
    }
  };
  this.clearCollection = () => {
    _collections = [];
  };
  this.pause = () => {
    for(let i in _collections) {
      _collections[i]._pause();
    }
  };
  this.reset = () => {
    for(let i in _collections) {
      _collections[i]._reset();
    }
  };
  this.upsert = (message, caller) => {
    for(let i in _collections) {
      const col = _collections[i];
      if(col !== caller && col.isMatchingWithFilter(message)) {
        let newChunk = null;
        if(col.currentChunk) {
          if(!col.currentChunk.isSynced && col.messages.map(msg => msg.messageId).indexOf(message.messageId) < 0) {
            newChunk = new MessageChunk(col.channel.url, col.filter);
          }
        } else {
          newChunk = new MessageChunk(col.channel.url, col.filter);
        }
        if(newChunk) {
          newChunk.isSynced = true;
          newChunk.extendWithMessage(message);
          col._clearViewItem();
          col._setCurrentChunk(newChunk);
        }
        col._addViewItem(message);
      }
    }
  };
  this.update = (message, caller) => {
    for(let i in _collections) {
      const col = _collections[i];
      if(col !== caller && col.isMatchingWithFilter(message)) {
        if(col.messages.map(msg => msg.messageId).indexOf(message.messageId) >= 0) {
          col._addViewItem(message);
        }
      }
    }
  };
  this.read = (channel, caller) => {
    for(let i in _collections) {
      const col = _collections[i];
      if(col !== caller && col.channel.url === channel.url) {
        for(let i in col.messages) {
          col._addViewItem(col.messages[i]);
        }
      }
    }
  };
  this.remove = (messageId, caller) => {
    for(let i in _collections) {
      const col = _collections[i];
      if(col !== caller) {
        col._removeViewItem(messageId);
      }
    }
  };
  return this;
};