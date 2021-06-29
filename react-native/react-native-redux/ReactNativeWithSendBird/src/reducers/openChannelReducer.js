import {
  INIT_OPEN_CHANNEL,
  OPEN_CHANNEL_PROGRESS_START,
  OPEN_CHANNEL_PROGRESS_END,
  OPEN_CHANNEL_LIST_SUCCESS,
  OPEN_CHANNEL_LIST_FAIL,
  GET_OPEN_CHANNEL_SUCCESS,
  GET_OPEN_CHANNEL_FAIL,
  ADD_OPEN_CHANNEL_ITEM,
  CLEAR_ADD_OPEN_CHANNEL,
  CLEAR_SELECTED_OPEN_CHANNEL
} from '../actions/types';

const INITAL_STATE = {
  isLoading: false,
  list: [],
  channel: null,
  createdChannel: null
};

export default (state = INITAL_STATE, action) => {
  switch (action.type) {
    case INIT_OPEN_CHANNEL:
      return { ...state, ...INITAL_STATE };
    case OPEN_CHANNEL_PROGRESS_START:
      return { ...state, isLoading: true };
    case OPEN_CHANNEL_PROGRESS_END:
      return { ...state, isLoading: false };
    case OPEN_CHANNEL_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        list: [...state.list, ...action.list]
      };
    case OPEN_CHANNEL_LIST_FAIL:
      return { ...state, isLoading: false };
    case GET_OPEN_CHANNEL_SUCCESS:
      return { ...state, channel: action.channel };
    case GET_OPEN_CHANNEL_FAIL:
      return { ...state, channel: null };
    case ADD_OPEN_CHANNEL_ITEM:
      return { ...state, createdChannel: action.channel };
    case CLEAR_ADD_OPEN_CHANNEL:
      return { ...state, createdChannel: null };
    case CLEAR_SELECTED_OPEN_CHANNEL:
      return { ...state, channel: null };
    default:
      return state;
  }
};
