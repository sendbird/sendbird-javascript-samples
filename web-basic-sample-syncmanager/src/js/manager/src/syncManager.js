
import LocalDB from './store/engine/localdb.min';
import ChannelManager from './channelManager';
import MessageManager from './messageManager';
import ChangeLog from './util/changeLog';
import SyncManagerException from './util/exception';

export default class SyncManager {
  constructor() {
  }
  static init(options, callback) {
    if(typeof options === 'function') {
      callback = options;
      options = {};
    }
    if(SyncManager.LocalDB) {
      SyncManager.LocalDB.close();
      SyncManager.LocalDB = null;
    }

    /** this manager uses LocalDB as a storage engine.
       *  LocalDB requires to call new LocalDB() to use the storage.
       *  For more information about the engine,
       *  see https://github.com/smilefam/LocalDB.
      */
    const db = new LocalDB('sbsync.db', 1);
    db.schema('GroupChannel', {
        key: 'url',
        index: [
          'lastMessageUpdatedAt',
          'createdAt',
          'name'
        ]
      })
      .schema('MessageChunk', {
        key: 'chunkId',
        index: [
          'channelUrl',
          'filterKey',
          'endAt'
        ]
      })
      .schema('Message', {
        key: 'messageId',
        index: [
          'channelUrl',
          'createdAt'
        ]
      })
      .build()
      .then(() => {
        SyncManager.LocalDB = db;
        SyncManager.Channel = ChannelManager;
        SyncManager.Message = MessageManager;
        SyncManager.ChangeLog = ChangeLog;
        SyncManager.Exception = SyncManagerException;
        callback();
      });
  }
  static start() {
    const channelManager = SyncManager.Channel.instance;
    if(channelManager) {
      channelManager.start();
    }
    const messageManager = SyncManager.Message.instance;
    if(messageManager) {
      messageManager.start();
    }
  }
  static stop() {
    const channelManager = SyncManager.Channel.instance;
    if(channelManager) {
      channelManager.stop();
    }
    const messageManager = SyncManager.Message.instance;
    if(messageManager) {
      messageManager.stop();
    }
  }
  static reset() {
    const channelManager = SyncManager.Channel.instance;
    if(channelManager) {
      channelManager.reset();
    }
    const messageManager = SyncManager.Message.instance;
    if(messageManager) {
      messageManager.reset();
    }
  }
}