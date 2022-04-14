import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useChannelHandler } from './useChannelHandler';

const createGroupChannelListCollection = sdk => {
  const defaultCollection = sdk.GroupChannel.createGroupChannelCollection();
  const filter = new sdk.GroupChannelFilter();
  filter.includeEmpty = true;
  filter.memberStateFilter = sdk.GroupChannelFilter.MemberStateFilter.ALL;
  return defaultCollection
    .setLimit(20)
    .setFilter(filter)
    .setOrder(sdk.GroupChannelCollection.GroupChannelOrder.LATEST_LAST_MESSAGE)
    .build();
};

export const useGroupChannelCollection = (sdk, userId) => {
  const collectionRef = useRef();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [groupChannelMap, setGroupChannelMap] = useState({});
  const groupChannels = useMemo(() => {
    return Object.values(groupChannelMap);
  }, [groupChannelMap]);

  // ---------- internal methods ---------- //
  const updateChannels = (channels, clearPrev) => {
    const gc = channels.filter(c => c.isGroupChannel());
    if (clearPrev) setGroupChannelMap(arrayToMap(gc, 'url'));
    else setGroupChannelMap(prev => ({ ...prev, ...arrayToMap(gc, 'url') }));
    gc.forEach(channel => sdk.markAsDelivered(channel.url));
  };
  const deleteChannels = channelUrls => {
    setGroupChannelMap(({ ...draft }) => {
      channelUrls.forEach(url => delete draft[url]);
      return draft;
    });
  };
  const init = useCallback(
    async uid => {
      if (collectionRef.current) collectionRef.current?.dispose();

      if (uid) {
        collectionRef.current = createGroupChannelListCollection(sdk);
        if (collectionRef.current?.hasMore) {
          updateChannels(await collectionRef.current?.loadMore(), true);
        }

        collectionRef.current?.setGroupChannelCollectionHandler({
          onChannelsAdded(_, channels) {
            updateChannels(channels, false);
          },
          onChannelsUpdated(_, channels) {
            updateChannels(channels, false);
          },
          onChannelsDeleted(_, channelUrls) {
            deleteChannels(channelUrls);
          },
        });
      }
    },
    [sdk],
  );
  // ---------- internal methods ends ---------- //

  // ---------- internal hooks ---------- //
  useEffect(() => {
    return () => {
      if (collectionRef.current) collectionRef.current?.dispose();
    };
  }, []);
  useEffect(() => {
    const run = async () => {
      setLoading(true);
      await init(userId);
      setLoading(false);
    };
    run();
  }, [init, userId]);

  useChannelHandler(
    sdk,
    'group-channel-collection',
    {
      onChannelChanged: channel => updateChannels([channel], false),
      onChannelFrozen: channel => updateChannels([channel], false),
      onChannelUnfrozen: channel => updateChannels([channel], false),
      onChannelMemberCountChanged: channels => updateChannels(channels, false),
      onChannelDeleted: url => deleteChannels([url]),
      onUserJoined: channel => updateChannels([channel], false),
      onUserLeft: (channel, user) => {
        const isMe = user.userId === userId;
        if (isMe) deleteChannels([channel.url]);
        else updateChannels([channel], false);
      },
    },
    [sdk, userId],
  );
  // ---------- internal hooks ends ---------- //

  // ---------- returns methods ---------- //
  const refresh = useCallback(async () => {
    setRefreshing(true);
    await init(userId);
    setRefreshing(false);
  }, [init, userId]);

  const update = useCallback(
    channel => {
      sdk.markAsDelivered(channel.url);
      setGroupChannelMap(prev => ({ ...prev, [channel.url]: channel }));
    },
    [sdk],
  );

  const next = useCallback(async () => {
    if (collectionRef.current?.hasMore) {
      const channels = await collectionRef.current?.loadMore();
      setGroupChannelMap(prev => ({ ...prev, ...arrayToMap(channels, 'url') }));
      channels.forEach(channel => sdk.markAsDelivered(channel.url));
    }
  }, [sdk]);
  // ---------- returns methods ends ---------- //

  return {
    loading,
    groupChannels,
    refresh,
    refreshing,
    next,
    update,
  };
};

function arrayToMap(arr, selector, fallbackSelector, combine) {
  return arr.reduce((accum, curr) => {
    if (combine && fallbackSelector) {
      const _key = curr[selector] + curr[fallbackSelector];
      accum[_key] = curr;
    } else {
      const _key = curr[selector] || curr[fallbackSelector];
      accum[_key] = curr;
    }

    return accum;
  }, {});
}
