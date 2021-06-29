export default class MockStorage {
  constructor(cache = {}) {
    this.storageCache = cache;
  }

  setItem = jest.fn((key, value, cb) => {
    if (typeof key !== 'string' || typeof value !== 'string') {
      cb(new Error('Key and value must be string'));
    } else {
      this.storageCache[key] = value;
      cb(null);
    }
  });

  getItem = jest.fn((key, cb) => {
    if (this.storageCache.hasOwnProperty(key)) {
      cb(null, this.storageCache[key]);
    } else {
      cb(new Error('Not present ' + key), null);
    }
  });
}
