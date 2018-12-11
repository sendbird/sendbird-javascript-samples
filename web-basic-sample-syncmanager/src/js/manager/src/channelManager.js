
import ChannelCollection from './collection/channelCollection';
import { ChannelContainer } from './store/ChannelContainer';
import { ChannelBroadcast } from './broadcast/channelBroadcast';
import SyncManagerException from './util/exception';

let _channelManager = null;
const _channelCollections = new WeakMap();
const _container = new WeakMap();
const _broadcast = new WeakMap();

const CONNECTION_HANDLER_KEY = 'syncManager_channelManager_connectionHandler_' + new Date().getTime();
const CHANNEL_HANDLER_KEY = 'syncManager_channelManager_channelHandler_' + new Date().getTime();

export default class ChannelManager {
  constructor(sendBird) {
    if(!_channelManager) {
      _channelManager = this;
      
      const sb = this.sb = sendBird;
      const container = new ChannelContainer(sb);
      const broadcast = new ChannelBroadcast();

      _channelCollections.set(this, []);
      _container.set(this, container);
      _broadcast.set(this, broadcast);

      const connectionHandler = new sb.ConnectionHandler();
      connectionHandler.onReconnectStarted = () => {
        broadcast.pause();
      };
      connectionHandler.onReconnectSucceeded = () => {
        broadcast.reset();
      };
      sb.addConnectionHandler(CONNECTION_HANDLER_KEY, connectionHandler);

      const channelHandler = new sb.ChannelHandler();
      const eventKeys = Object.keys(channelHandler);
      eventKeys.forEach(event => {
        channelHandler[event] = (...args) => {
          const collections = _channelCollections.get(this);
          if(Array.isArray(collections)) {
            switch(event) {
              case 'onUserMuted':
              case 'onUserUnmuted':
              case 'onUserUnbanned':
              case 'onChannelChanged':
              case 'onChannelFrozen':
              case 'onChannelUnfrozen':
              case 'onMetaDataCreated':
              case 'onMetaDataUpdated':
              case 'onMetaDataDeleted':
              case 'onMetaCountersCreated':
              case 'onMetaCountersUpdated':
              case 'onMetaCountersDeleted': {
                container.upsert(args[0])
                  .then(channel => broadcast.upsert(channel))
                  .catch(err => SyncManagerException.throw(err));
                break;
              }

              case 'onReadReceiptUpdated': {
                container.upsert(args[0])
                  .then(() => {})
                  .catch(err => SyncManagerException.throw(err));
                break;
              }
              
              case 'onUserReceivedInvitation':
              case 'onUserJoined': {
                container.upsert(args[0])
                  .then(channel => {
                    const user = args[1];
                    if(sb.currentUser && user.userId === sb.currentUser.userId) {
                      broadcast.upsert(channel);
                    }
                  })
                  .catch(err => SyncManagerException.throw(err));
                break;
              }
        
              case 'onChannelHidden': {
                const channel = args[0];
                container.remove(channel)
                  .then(() => broadcast.remove(channel))
                  .catch(err => SyncManagerException.throw(err));
                break;
              }
        
              case 'onUserLeft':
              case 'onUserBanned': {
                const channel = args[0];
                const user = args[1];
                if(sb.currentUser && user.userId === sb.currentUser.userId) {
                  container.remove(channel)
                    .then(() => broadcast.remove(channel))
                    .catch(err => SyncManagerException.throw(err));
                } else {
                  container.upsert(channel)
                    .then(cachedChannel => broadcast.upsert(cachedChannel))
                    .catch(err => SyncManagerException.throw(err));
                }
                break;
              }
              
              case 'onUserDeclinedInvitation': {
                const channel = args[0];
                const invitee = args[2];
                if(sb.currentUser && invitee.userId === sb.currentUser.userId) {
                  container.remove(channel)
                    .then(() => broadcast.remove(channel))
                    .catch(err => SyncManagerException.throw(err));
                } else {
                  container.upsert(channel)
                    .then(cachedChannel => broadcast.upsert(cachedChannel))
                    .catch(err => SyncManagerException.throw(err));
                }
                break;
              }
        
              case 'onChannelDeleted': {
                const channel = args[0];
                container.remove(channel)
                  .then(() => broadcast.remove(channel))
                  .catch(err => SyncManagerException.throw(err));
                break;
              }
            }
          }
        };
      });
      sb.addChannelHandler(CHANNEL_HANDLER_KEY, channelHandler);
    }
    return _channelManager;
  }
  static get instance() {
    return _channelManager;
  }
  createMyGroupChannelCollection(query) {
    const broadcast = _broadcast.get(this);
    const collection = new ChannelCollection({
      manager: this,
      broadcast,
      channelContainer: _container.get(this),
      type: 'MyGroupChannelListQuery',
      query
    });
    if(collection) {
      const broadcast = _broadcast.get(this);
      broadcast.addCollection(collection);
    }
    return collection;
  }
  createPublicGroupChannelCollection(query) {
    const broadcast = _broadcast.get(this);
    const collection = new ChannelCollection({
      manager: this,
      broadcast,
      channelContainer: _container.get(this),
      type: 'PublicGroupChannelListQuery',
      query
    });
    if(collection) {
      broadcast.addCollection(collection);
    }
    return collection;
  }
  removeChannelCollection(collection) {
    const broadcast = _broadcast.get(this);
    broadcast.removeCollection(collection);
  }
  clearCache() {
    const container = _container.get(this);
    container.clear();
  }
  start() {
    const broadcast = _broadcast.get(this);
    broadcast.reset();
  }
  stop() {
    const broadcast = _broadcast.get(this);
    broadcast.pause();
  }
  reset() {
    if(_channelManager) {
      _channelManager.clearCache();
      _channelManager.sb.removeConnectionHandler(CONNECTION_HANDLER_KEY);
      _channelManager.sb.removeChannelHandler(CHANNEL_HANDLER_KEY);
      _channelManager = null;
    }
  }
}