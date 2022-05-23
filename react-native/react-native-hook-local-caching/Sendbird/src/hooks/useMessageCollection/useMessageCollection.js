import { useCallback, useEffect, useRef, useState } from 'react';

import { useIsMountedRef } from '../useIsMountedRef';
import { useGroupChannelMessagesReducer } from './reducer';
import { useForceUpdate } from '../useForceUpdate';

const createMessageCollection = (sdk, channel) => {
  const collection = channel.createMessageCollection();
  const filter = new sdk.MessageFilter();
  return collection.setLimit(100).setStartingPoint(Date.now()).setFilter(filter).build();
};

function isDifferentChannel(a, b) {
  if (!a || !b) return true;
  return a.url !== b.url;
}

const hookName = 'useMessageCollection';
const noop = () => null;
export const useMessageCollection = (sdk, staleChannel, userId, onChannelDeleted, onError) => {
  const isMounted = useIsMountedRef();
  const disposeManuallyAfterUnmounted = () => {
    if (!isMounted.current && collectionRef.current) collectionRef.current.dispose();
  };
  const collectionRef = useRef();

  // NOTE: We cannot determine the channel object of Sendbird SDK is stale or not, so force update after setActiveChannel
  const [activeChannel, setActiveChannel] = useState(() => staleChannel);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    setActiveChannel(staleChannel);
  }, [staleChannel.url]);

  const { loading, refreshing, messages, updateMessages, deleteMessages, updateLoading, updateRefreshing } =
    useGroupChannelMessagesReducer(userId);

  const channelMarkAs = async () => {
    try {
      sdk.markAsDelivered(activeChannel.url);
    } catch (e) {
      console.warn(`[${hookName}/channelMarkAs/Delivered]`, e);
      onError(e.message);
    }
    try {
      await sdk.markAsReadWithChannelUrls([activeChannel.url]);
    } catch (e) {
      console.warn(`[${hookName}/channelMarkAs/Read]`, e);
      onError(e.message);
    }
  };

  const init = useCallback(
    async (uid) => {
      if (collectionRef.current) collectionRef.current?.dispose();

      if (uid) {
        collectionRef.current = createMessageCollection(sdk, activeChannel);
        channelMarkAs();

        collectionRef.current
          .initialize(sdk.MessageCollection.MessageCollectionInitPolicy.CACHE_AND_REPLACE_BY_API)
          .onCacheResult((err, msgs) => {
            if (err) {
              if (sdk.isCacheEnabled) {
                console.warn(`[${hookName}/onCacheResult]`, err);
                onError(err.message);
              }
            } else {
              console.log(`[${hookName}/onCacheResult]`, 'message length:', msgs.length);
              updateMessages(msgs, true, sdk.currentUser.userId);
              updateMessages(collectionRef.current?.pendingMessages ?? [], false, sdk.currentUser.userId);
              updateMessages(collectionRef.current?.failedMessages ?? [], false, sdk.currentUser.userId);
            }
          })
          .onApiResult((err, msgs) => {
            if (err) {
              console.warn(`[${hookName}/onApiResult]`, err);
              onError(err.message);
            } else {
              console.log(`[${hookName}/onApiResult]`, 'message length:', msgs.length);
              updateMessages(msgs, true, sdk.currentUser.userId);
              updateMessages(collectionRef.current?.pendingMessages ?? [], false, sdk.currentUser.userId);
              updateMessages(collectionRef.current?.failedMessages ?? [], false, sdk.currentUser.userId);
            }
          });

        collectionRef.current.setMessageCollectionHandler({
          onMessagesAdded(_, __, msgs) {
            disposeManuallyAfterUnmounted();
            channelMarkAs();
            updateMessages(msgs, false, sdk.currentUser.userId);
          },
          onMessagesUpdated(_, __, msgs) {
            disposeManuallyAfterUnmounted();
            updateMessages(msgs, false, sdk.currentUser.userId);
          },
          onMessagesDeleted(_, __, msgs) {
            disposeManuallyAfterUnmounted();
            const msgIds = msgs.map(m => m.messageId);
            const reqIds = msgs.filter(m => 'reqId' in m).map(m => m.reqId);

            deleteMessages(msgIds, reqIds);
          },
          onChannelDeleted(_, channelUrl) {
            disposeManuallyAfterUnmounted();
            if (activeChannel.url === channelUrl) onChannelDeleted?.();
          },
          onChannelUpdated(_, channel) {
            disposeManuallyAfterUnmounted();
            if (channel.isGroupChannel() && !isDifferentChannel(channel, activeChannel)) {
              setActiveChannel(channel);
              forceUpdate();
            }
          },
          onHugeGapDetected() {
            disposeManuallyAfterUnmounted();
            init(uid);
          },
        });
      }
    },
    [sdk, activeChannel.url],
  );

  useEffect(() => {
    return () => {
      if (collectionRef.current) collectionRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    // NOTE: Cache read is heavy synchronous task, It prevents smooth ui transition
    setTimeout(async () => {
      updateLoading(true);
      await init(userId);
      updateLoading(false);
    }, 0);
  }, [init, userId]);

  const refresh = useCallback(async () => {
    updateRefreshing(true);
    await init(userId);
    updateRefreshing(false);
  }, [init, userId]);

  const prev = useCallback(async () => {
    if (collectionRef.current && collectionRef.current?.hasPrevious) {
      try {
        const list = await collectionRef.current?.loadPrevious();
        updateMessages(list, false, sdk.currentUser.userId);
      } catch {}
    }
  }, []);

  const next = useCallback(async () => {
    if (collectionRef.current && collectionRef.current?.hasNext) {
      try {
        const fetchedList = await collectionRef.current?.loadNext();
        updateMessages(fetchedList, false, sdk.currentUser.userId);
      } catch {}
    }
  }, []);

  const sendUserMessage = useCallback(
    (params, onPending) => {
      return new Promise((resolve, reject) => {
        const pendingMessage = activeChannel.sendUserMessage(params, (sentMessage, error) => {
          if (error) reject(error);
          else {
            updateMessages([sentMessage], false, sdk.currentUser.userId);
            resolve(sentMessage);
          }
        });

        onPending?.(pendingMessage);
        updateMessages([pendingMessage], false, sdk.currentUser.userId);
      });
    },
    [activeChannel],
  );
  const sendFileMessage = useCallback(
    (params, onPending) => {
      return new Promise((resolve, reject) => {
        const pendingMessage = activeChannel.sendFileMessage(params, (sentMessage, error) => {
          if (error) reject(error);
          else {
            updateMessages([sentMessage], false, sdk.currentUser.userId);
            resolve(sentMessage);
          }
        });

        updateMessages([pendingMessage], false, sdk.currentUser.userId);
        onPending?.(pendingMessage);
      });
    },
    [activeChannel],
  );
  const updateUserMessage = useCallback(
    async (messageId, params) => {
      const updatedMessage = await activeChannel.updateUserMessage(messageId, params, noop);
      updateMessages([updatedMessage], false, sdk.currentUser.userId);
      return updatedMessage;
    },
    [activeChannel],
  );
  const updateFileMessage = useCallback(
    async (messageId, params) => {
      const updatedMessage = await activeChannel.updateFileMessage(messageId, params, noop);
      updateMessages([updatedMessage], false, sdk.currentUser.userId);
      return updatedMessage;
    },
    [activeChannel],
  );
  const resendMessage = useCallback(
    async failedMessage => {
      if (!failedMessage.isResendable()) return;

      const message = await (() => {
        if (failedMessage.isUserMessage()) return activeChannel.resendUserMessage(failedMessage);
        if (failedMessage.isFileMessage()) return activeChannel.resendFileMessage(failedMessage);
        return null;
      })();

      if (message) updateMessages([message], false, sdk.currentUser.userId);
    },
    [activeChannel],
  );
  const deleteMessage = useCallback(
    async message => {
      if (message.sendingStatus === 'succeeded') {
        if (message.isUserMessage()) await activeChannel.deleteMessage(message);
        if (message.isFileMessage()) await activeChannel.deleteMessage(message);
      } else {
        try {
          await collectionRef.current?.removeFailedMessages([message]);
        } finally {
          deleteMessages([message.messageId], [message.reqId]);
        }
      }
    },
    [activeChannel],
  );

  return {
    loading,
    refreshing,
    refresh,
    messages,
    next,
    prev,
    sendUserMessage,
    sendFileMessage,
    updateUserMessage,
    updateFileMessage,
    resendMessage,
    deleteMessage,
    activeChannel,
  };
};
