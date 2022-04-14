export const channelsReducer = (state, action) => {
  switch (action.type) {
    case 'refresh': {
      return {
        ...state,
        channelMap: {},
        channels: [],
        loading: false,
        error: null,
      };
    }
    case 'fetch-channels': {
      const { channels } = action.payload || {};
      const distinctChannels = channels.filter(channel => !state.channelMap[channel.url]);
      const mergedChannels = [...state.channels, ...distinctChannels].sort((a, b) => {
        const at = a.lastMessage ? a.lastMessage.createdAt : a.createdAt;
        const bt = b.lastMessage ? b.lastMessage.createdAt : b.createdAt;
        return bt - at;
      });
      const channelMap = {};
      for (let i in mergedChannels) {
        const channel = mergedChannels[i];
        channelMap[channel.url] = true;
      }
      return {
        ...state,
        channelMap,
        channels: mergedChannels,
        empty: mergedChannels.length === 0 ? 'Start conversation.' : '',
      };
    }
    case 'join-channel':
    case 'update-channel': {
      const { channel } = action.payload || {};
      return {
        ...state,
        channelMap: { ...state.channelMap, [channel.url]: true },
        channels: [channel, ...state.channels.filter(c => c.url !== channel.url)].sort((a, b) => {
          const at = a.lastMessage ? a.lastMessage.createdAt : a.createdAt;
          const bt = b.lastMessage ? b.lastMessage.createdAt : b.createdAt;
          return bt - at;
        }),
        empty: '',
      };
    }
    case 'leave-channel':
    case 'delete-channel': {
      const { channel } = action.payload || {};
      const slicedChannels = state.channels.filter(c => c.url !== channel.url);
      return {
        ...state,
        channelMap: { ...state.channelMap, [channel.url]: false },
        channels: slicedChannels,
        empty: slicedChannels.length === 0 ? 'Start conversation.' : '',
      };
    }
    case 'start-loading': {
      const { error = null } = action.payload || {};
      return { ...state, loading: true, error };
    }
    case 'end-loading': {
      const { error = null } = action.payload || {};
      return { ...state, loading: false, error };
    }
    case 'error': {
      const { error } = action.payload || {};
      return { ...state, error };
    }
  }
  return state;
};
