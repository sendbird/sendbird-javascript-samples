
# LocalDB for JavaScript

LocalDB is a SQL-based local database solution for JavaScript.

## Browser Compatibility

- Chrome 40+
- FireFox 34+
- Safari 6+
- IE 10+
- Edge 20+
- Android Browser 4.3+
- iOS WebView 6+
- React Native

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

```js
/// IndexedDB initialization (web browser)
const db = new LocalDB('DatabaseName', VERSION);
db.schema('TableName1', {
    key: 'url', // `url` is used as primary key (default: `id`)
    index: [
      'column1',
      'column2'
    ]
  })
  .schema('TableName2', { ... })
  .build()
  .then(() => {
    ...
    db.close();
  });
```

```js
/// SQLite initialization (React Native, etc)
/// dependency: https://github.com/andpor/react-native-sqlite-storage
const SQLite = require('react-native-sqlite-storage');
LocalDB.useSqlite(SQLite, 'DatabaseName', VERSION)
  .then(db => {
    db.schema('TableName1', {
        'id': { type: 'KEY', primaryKey: true },
        'name': { type: 'TEXT', notNull: true, default: 'UNNAMED' },
        'age': { type: 'INT', notNull: true },
        'createdAt': { type: 'INT', notNull: true }
      })
      .schema('TableName2', {
        ...
      })
      .index('TableName1', [ 'column1', 'column4' ]);
      .build()
      .then(() => {
        ...
        db.close();
      });
  })
  .catch(err => {});
```

```js
/** General LocalDB interface
 */
const collection = db.collection('TableName');

/** LocalDB.Query
 */
const query = new LocalDB.Query({
  'column1': 10,
  'column2.value': 30,
  'column3': { '>=': 20, '<': 30 },
  'column4': { '=': 20 },
  'column5': { '!=': 20 },
  'column6': { '/like': 'abc' },
  'column7': { '/in': [ 2, 6, 10, 14 ] },
  'column8': { '/nin': [ 2, 6, 10, 14 ] }
});

/// concatenate queries
const andQuery = LocalDB.Query.and({ a: 10 }, { b: 20 }, { c: 30 });
const orQuery = LocalDB.Query.or({ a: 10 }, { b: 20 }, { c: 30 });

/// query options
query.orderBy = 'column3';
query.desc = true;
query.offset = 0;
query.limit = 20;

/** collection.findById(id: Any)
 *  then(item: Item)
 *  catch(err: Error)
 */
collection.findById(id)
  .then(item => {})
  .catch(err => {});

/** collection.find(where: Query, options: Object?)
 *  then(list: Array<Item>)
 *  catch(err: Error)
 */
collection.find(query)
  .then(list => {})
  .catch(err => {});

/** collection.count(where: Query?)
 *  then(count: Number)
 *  catch(err: Error)
 */
collection.count(query)
  .then(count => {})
  .catch(err => {});

/** collection.insert(item: Object | Array<Object>)
 *  then(insertedItem: Item | Array<Item>)
 *  catch(err: Error)
 */
collection.insert(item)
  .then(insertedItems => {})
  .catch(err => {});

/** collection.update(item: Item)
 *  then(updatedItem: Item)
 *  catch(err: Error)
 */
collection.update(item)
  .then(updatedItem => {})
  .catch(err => {});

/** collection.upsert(item: Item)
 *  then(upsertedItem: Item)
 *  catch(err: Error)
 */
collection.upsert(item)
  .then(upsertedItem => {})
  .catch(err => {});

/** collection.updateIf(where: Query, updateColumn: Object)
 *  then(updatedItems: Array<Item>)
 *  catch(err: Error)
 */
collection.updateIf(query,
  {
    'column1': 1,
    'column2': 10
  })
  .then(updatedItems => {})
  .catch(err => {});

/** collection.remove(id: Any)
 *  then(void)
 *  catch(err: Error)
 */
collection.remove(id)
  .then(removedItem => {})
  .catch(err => {});

/** collection.removeIf(where: Query)
 *  then(removedItems: Array<Item>)
 *  catch(err: Error)
 */
collection.removeIf(query)
  .then(removedItems => {})
  .catch(err => {});

/** collection.clear()
 *  then(void)
 *  catch(err: Error)
 */
collection.clear()
  .then(() => {})
  .catch(err => {});
```