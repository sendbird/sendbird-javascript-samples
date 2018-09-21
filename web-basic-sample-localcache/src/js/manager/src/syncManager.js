
import LocalDB from './store/engine/localdb.min.js';
import ChannelManager from './channelManager';
import MessageManager from './messageManager';
import ChangeLog from './util/changeLog';
import SyncManagerException from './util/exception';

export default class SyncManager {
  constructor() {
  }
  static init() {
    /** this manager uses LocalDB as a storage engine.
       *  LocalDB requires to call LocalDB.config() to use the storage.
       *  For more information about the engine,
       *  see https://github.com/smilefam/LocalDB.
      */
    LocalDB.config();

    SyncManager.Channel = ChannelManager;
    SyncManager.Message = MessageManager;
    SyncManager.ChangeLog = ChangeLog;
    SyncManager.Exception = SyncManagerException;
  }
}