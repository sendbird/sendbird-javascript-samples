
# LocalDB for JavaScript

LocalDB is a document-based local database solution for JavaScript using localStorage. It's compatible with browser, node.js, and other hybrid mobile development frameworks using JavaScript.

## Features

LocalDB provides the following features:

- document-based data structure (like MongoDB)
- query with where clause
- highly customizable database options
- batch update to boost the performance
- storage event handler (add/update/remove/evict/clear)
- encryption/description on write/read
- relation between tables with dependency
- indexing for better traversing performance

## Browser Compatibility

- Chrome 40+
- FireFox 34+
- Safari 6+
- IE 8+
- Edge 20+
- Android Browser 4.3+
- iOS WebView 6+

> LocalDB system detects browser automatically in order to find proper size limit. For most modern web browsers, the size limit is 10MB.

## Installation
```
npm install
npm run build
```

## Unit Test
```
npm run test
```

## Usage

The values for each setting are default values, which means you don't have to put all options because every option is `OPTIONAL`.

```js
/// initialization
LocalDB.config({
  /** batchInterval
   *  set batch update interval for internal file system
   *  the more the value is, the faster the performance is
   *  (warning, db may not persist if batch interval is too big)
   */
  batchInterval : 2000,

  /** totalLimit
   *  set total maximum data limit regardless of table data limit
   *  it priors to table data limit (hard cap)
   *  if total limit is 0, it has no limit
  */
  totalLimit : 0,

  /** defaultTableItemLimit
   *  set default table item limit
   *  if # of data exceeds the limit, it kicks out the oldest one
   *  if table limit is 0, it has no limit but caps in global limit
   * 
   *  WARNING!
   *  make sure that the size limit of localStorage is usually 5MB or less per origin
   *  increasing table limit may cause a problem due to the limit
   */
  defaultTableItemLimit : 0,

  /** defaultKickoutDelay
   *  set kickout delay on db kickout
   *  it doesn't affect in integrity of data as it defers the deletion of real data
   *  cached in memory would be removed instantly
   */
  defaultKickoutDelay : 5000,

  /** storageEngine
   *  default storage engine which MUST have interfaces like below:
   *  - length
   *  - getItem(key)
   *  - setItem(key, value)
   *  - removeItem(key)
   *  - clear()
   *  e.i. window.localStorage, global.localStorage, etc
   * 
   *  if you'd like to use other storage engine such as AsyncStorage in React Native,
   *  build your own wrapper to meet the interface
   */
  storageEngine: window.localStorage,

  /** storageEvictionBuffer
   *  set eviction buffer size
   *  when eviction occurs, the system evicts [overflowed size] + [eviction buffer size] of data.
   */
  storageEvictionBuffer : 256,

  /** storageEvictionPolicy
   *  set eviction policy
   *  - default: evict the oldest data from any table
   *  - TODO: round-robin: evict the oldest data from each table in turn
   *  - TODO: even-break: evict the oldest data from each table (dividing eviction size)
   *  - cascade: evict the oldest data from the least dependent tables
   */
  storageEvictionPolicy : 'default',

  /** encryption
   *  add encryption to data store
   *  (may decrease performance)
   */
  encryption : {
    encrypt : (value, salt) => { /* return encrypted value */ },
    decrypt : (value, salt) => { /* return decrypted value */ },
    salt : (seed) => { /* return salt generated with seed */ }
  }
});

/// flush data in memory into localStorage
LocalDB.flush();

/// storage usage and limit
LocalDB.storageUsed;
LocalDB.storageLimit;

/// get table instance by table name
/// create new instance if there's no instance for the table available
LocalDB.getTableInstance(tableName);

/// create or get db by table
const db = new LocalDB({
  tableName: tableName,
  tableItemLimit : 0,

  /**
   * Constraint in dependency means that when an item in the tableName is removed,
   * all items which have foreignKey with the removed item would be removed too.
   * 
   * If table A has constraint with table B where the foreignKey is 'fk', for instance,
   * deletion of an item in table B with key 'X' would cause items in table A
   * which foreign key 'fk' is 'X', to be removed as well.
   * 
   */
  dependency : {
    'tableName' : {
      key: 'foreignKey',
      constraint: true
    }
  },
  index: [
    // NOTE: indexing on array/object type column is NOT supported
    [ 'column1', 'column2', 'column3' ],
    [ 'column1', 'column3' ]
  ],
  // timestampColumn value is the key to determine old value to evict on cache exceeded
  timestampColumn : 'timestampColumnName',

  // kickoutDelay is the delay to increase performance
  // when multiple values were evicted at the same time
  kickoutDelay : 5000
});

/// check if the key is in database
db.hasItem(key);

/// get data
db.getItem(key);

/// set data (insert or update)
/// returns true if data is created, false if data is updated
db.setItem(key, value);

/// query
const query = db.query({
  condition: {
    'column1': 10,
    'column2.value': 30,
    'column3': { '>=': 20, '<': 30 },
    'column4': { '/regex': /[a-z]{1, 3}/ },
    'column5': { '/in': [ 2, 6, 10, 14 ] },
    'column6': { '/nin': [ 2, 6, 10, 14 ] },
    'column7': {
      '/where': function(value) {
        return value % 2 === 0;
      }
    },
    // if column value is an array of numbers (or other primitive type values)
    // returns item if an item with the array which has value 20 (or not)
    'column8': { '/include': 20 },
    'column9': { '/exclude': 20 },

    // if column value is an array of objects
    'column10': { '/include': { 'innerColumn': 32 } },
    'column11': { '/include': { 'innerColumn.value': 9 } }
  },
  options: {
    offset: 0,
    limit: 20,
    orderBy: 'column3',
    desc: false
  }
});
query.excute((err, result) => {
  /// result is an array
  /// do whatever you want with result
});

/// equivalent to query().execute()
db.find({
    condition: {
      'column1': 10
    },
    options: {
      offset: 0,
      limit: 10
    },
  },
  (err, result) => {
    // result is an array
  });

/// equivalent to query().execute() but returns single object which meets the condition
db.findOne({
    condition: {
      'column1': 10
    }
  },
  (err, item) => {
    // item is an object
  });

/// get the # of data in table
db.count();
db.count({
  /// filter works same as query
  'column1': 10
});

/// update data
db.updateItem(key, {
  'column2': 19,
  'column4': { '/delete': true }
});

/// remove data
db.removeItem(key);

/// update
db.updateAll({
  'column2': 16,
  'column4': { '/delete': true }
},
() => {
  // update done
});

/// conditional update (update everything that meets condition)
db.updateIf({
  /// filter works same as query
  'column2': 14
},
{
  'column3': 32
},
() => {
  // update done
});

/// conditional remove (remove all if it meets conditions)
db.removeIf({
  /// filter works same as query
  'column2': 14
},
() => {
  // remove done
});

/// clear data
db.clear(() => {
  // clear done
});

/// ensure index for columns
db.ensureIndex([ 'column1', 'column4' ]);

/// remove index for columns
db.removeIndex([ 'column1', 'column4' ]);

/// get db limit for table
db.limit;

/// simple iteration
for(let key in db.keys) {
  const value = db.getItem(key);
  /// do whatever you want
}

/** event handler
 *  eventType := add | update | remove | evict | clear
 *  - insert handler: function(key, value) (called after an item is inserted)
 *  - update handler: function(key, oldValue, newValue) (called after an item is updated)
 *  - remove handler: function(key, value) (called before an item is removed from db - including eviction)
 *  - evict handler: function(key, value) (called before an item is evicted by db limit)
 *  - clear handler: function()
 */
db.on('insert', (key, value) => {
  /// do whatever you want
});

```