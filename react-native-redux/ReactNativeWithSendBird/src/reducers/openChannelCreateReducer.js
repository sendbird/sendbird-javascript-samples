import { INIT_OPEN_CHANNEL_CREATE, OPEN_CHANNEL_CREATE_SUCCESS, OPEN_CHANNEL_CREATE_FAIL } from '../actions/types';

const INITAL_STATE = {
  error: '',
  channel: null
};

export default (state = INITAL_STATE, action) => {
  switch (action.type) {
    case INIT_OPEN_CHANNEL_CREATE:
      return { ...state, ...INITAL_STATE };
    case OPEN_CHANNEL_CREATE_SUCCESS:
      return { ...state, ...INITAL_STATE, channel: action.channel };
    case OPEN_CHANNEL_CREATE_FAIL:
      return { ...state, ...INITAL_STATE, error: action.error };
    default:
      return state;
  }
};
