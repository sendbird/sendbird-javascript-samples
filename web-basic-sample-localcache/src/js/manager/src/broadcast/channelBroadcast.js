
export const ChannelBroadcast = function() {
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
  this.upsert = (channel, caller) => {
    for(let i in _collections) {
      const col = _collections[i];
      if(col !== caller && col.isMatchingWithQuery(channel)) {
        col._addViewItem(channel);
      }
    }
  };
  this.update = (channel, caller) => {
    for(let i in _collections) {
      const col = _collections[i];
      if(col !== caller && col.isMatchingWithQuery(channel)) {
        if(col.channels.map(ch => ch.url).indexOf(channel.url) >= 0) {
          col._addViewItem(channel);
        }
      }
    }
  };
  this.remove = (channel, caller) => {
    for(let i in _collections) {
      const col = _collections[i];
      if(col !== caller && col.isMatchingWithQuery(channel)) {
        col._removeViewItem(channel);
      }
    }
  };
  return this;
};