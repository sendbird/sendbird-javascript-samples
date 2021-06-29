import {
  INIT_GROUP_CHANNEL,
  GROUP_CHANNEL_PROGRESS_START,
  GROUP_CHANNEL_PROGRESS_END,
  GROUP_CHANNEL_LIST_SUCCESS,
  GROUP_CHANNEL_LIST_FAIL,
  GET_GROUP_CHANNEL_SUCCESS,
  GET_GROUP_CHANNEL_FAIL,
  CHANNEL_EDIT_SUCCESS,
  CHANNEL_EDIT_FAIL,
  ADD_GROUP_CHANNEL_ITEM,
  CLEAR_SELECTED_GROUP_CHANNEL,
  GROUP_CHANNEL_CHANGED
} from '../actions/types';

const INITAL_STATE = {
  isLoading: false,
  list: [],
  channel: null
};

export default (state = INITAL_STATE, action) => {
  switch (action.type) {
    case INIT_GROUP_CHANNEL:
      return { ...state, ...INITAL_STATE };
    case GROUP_CHANNEL_PROGRESS_START:
      return { ...state, isLoading: true };
    case GROUP_CHANNEL_PROGRESS_END:
      return { ...state, isLoading: false };
    case GROUP_CHANNEL_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        list: [...state.list, ...action.list]
      };
    case GROUP_CHANNEL_LIST_FAIL:
      return { ...state, isLoading: false };
    case GET_GROUP_CHANNEL_SUCCESS:
      return { ...state, channel: action.channel };
    case GET_GROUP_CHANNEL_FAIL:
      return { ...state, channel: null };
    case CHANNEL_EDIT_SUCCESS:
      const newEditList = state.list.filter(channel => {
        return channel.url !== action.payload;
      });
      return { ...state, isLoading: false, list: newEditList };
    case CHANNEL_EDIT_FAIL:
      return { ...state };
    case ADD_GROUP_CHANNEL_ITEM:
      const createdChannel = action.channel;
      const searchChannel = state.list.filter(channel => {
        return channel.url === createdChannel.url;
      })[0];
      const createdChannelList = searchChannel ? state.list : [...[action.channel], ...state.list];
      return { ...state, list: createdChannelList };
    case CLEAR_SELECTED_GROUP_CHANNEL:
      return { ...state, channel: null };
    case GROUP_CHANNEL_CHANGED:
      const changedChannel = action.channel;
      const updateList = state.list.map(channel => {
        return channel.url === changedChannel.url ? changedChannel : channel;
      });
      const searchChangedChannel = state.list.filter(channel => {
        return channel.url === changedChannel.url;
      })[0];
      const newList = searchChangedChannel ? updateList : [...[changedChannel], ...updateList];
      return { ...state, list: newList };
    default:
      return state;
  }
};
