
# SendBird SyncManager for Web

This project provides SendBird data sync manager for JavaScript. SyncManager offers an event-based data management framework so that each view would see a single spot by subscribing data event. And it stores the data into localStorage or equivalent storage engine which implements local caching for faster loading.

## Build

SyncManager requires `Node.js` v8.x+ installed. Building SyncManager as library is like below:

```
~$ npm install
~$ npm run build
```

## Usage

### Initialization

```js
// change the path if you put the project into other path
import SyncManager from './manager/src/syncManager';

SyncManager.init(options, () => {
  // do your job here
});
```

### Connection Lifecycle

Connection may not be stable in some environment. If SendBird recognizes disconnection, it would take steps for reconnection and manager would catch it and sync data automatically when the connection is back. For those who call `sb.disconnect()` and `sb.connect()` explicitly to manage the lifecycle by their own, Manager provides methods `manager.start()` and `manager.stop()` to acknowledge the event and do proper action in order to sync content.

### Channel Manager

```js
// change the path if you put the project into other path
import SyncManager from './manager/src/syncManager';

// init with new SendBird({ ... }) and connect() before using it
const sb = SendBird.getInstance();
const manager = new SyncManager.Channel(sb);

const query = sb.GroupChannel.createMyGroupChannelListQuery();
// ...setup your query here

const collection = manager.createChannelCollection(query);
collection.subscribe('unique-event-handler-key', changeLog => {
  // apply to view on each event
  const channel = changeLog.item;
  switch(changeLog.action) {
    case 'insert': {
      break;
    }
    case 'update': {
      break;
    }
    case 'remove': {
      break;
    }
    case 'move': {
      break;
    }
    case 'clear': {
      break;
    }
  }
});

// you can cancel event subscription for the unique key by calling unsubscribe() like:
collection.unsubscribe('unique-event-handler-key');

collection.loadChannels(() => {
  // This callback is useful only to check the end of loading.
  // The fetched channels would be translated into change logs and delivered to subscription.
});

// when the collection is obsolete and no longer used, remove collection explicitly
manager.removeChannelCollection(collection);
```

### Message Manager

```js
// change the path if you put the project into other path
import SyncManager from './manager/src/syncManager';

// init with new SendBird({ ... }) and connect() before using it
const sb = SendBird.getInstance();
const manager = new SyncManager.Message(sb);

const filter = createFilter(); // setup filter and limit
const collection = manager.createMessageCollection(channel, filter);
collection.subscribe('unique-event-handler-key', changeLog => {
  // apply to view on each event
  const message = changeLog.item;
  switch(changeLog.action) {
    case 'insert': {
      break;
    }
    case 'update': {
      break;
    }
    case 'remove': {
      break;
    }
    case 'clear': {
      break;
    }
  }
});

// you can cancel event subscription for the unique key by calling unsubscribe() like:
collection.unsubscribe('unique-event-handler-key');

collection.loadPreviousMessages(() => {
  // This callback is useful only to check the end of loading.
  // The fetched messages would be translated into change logs and delivered to subscription.
});

// when the collection is obsolete and no longer used, remove collection explicitly
manager.removeMessageCollection(collection);
```

SyncManager listens message event handlers such as `onMessageReceived`, `onMessageUpdated`, `onMessageDeleted`, and applies the change automatically. But they would not be called if the message is sent by `currentUser`. You can keep track of the message in callback instead. SyncManager provides some methods to apply the message event to collections.

```js
// call collection.appendMyMessage() after sending message
const params = new sb.UserMessageParams();
params.message = 'your message';
channel.sendUserMessage(params, (message, err) => {
  if(!err) {
    collection.appendMyMessage(message);
  }
});

// call collection.updateMyMessage() after updating message
const params = new sb.UserMessageParams();
params.message = 'updated message';
channel.updateUserMessage(message.messageId, params, (message, err) => {
  if(!err) {
    collection.updateMyMessage(message);
  }
});

// call collection.removeMyMessage() after deleting message
channel.deleteMessage(message, (res, err) => {
  if(!err) {
    collection.removeMyMessage(message);
  }
});
```

Once it is delivered to a collection, it'd not only apply the change into the current collection but also propagate the event into other collections so that the change could apply to other views automatically. It works only for messages sent by `currentUser` which means the message sender should be `currentUser`.