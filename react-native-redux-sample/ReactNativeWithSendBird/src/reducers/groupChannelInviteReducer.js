import {
  INIT_INVITE,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  CREATE_GROUP_CHANNEL_SUCCESS,
  CREATE_GROUP_CHANNEL_FAIL,
  INVITE_GROUP_CHANNEL_SUCCESS,
  INVITE_GROUP_CHANNEL_FAIL
} from '../actions/types';

const INITAL_STATE = {
  list: [],
  channel: null
};

const uniqueList = list => {
  return list.reduce((uniqList, currentValue) => {
    let ids = uniqList.map(item => {
      return item.userId;
    });
    if (ids.indexOf(currentValue.userId) < 0) {
      uniqList.push(currentValue);
    }
    return uniqList;
  }, []);
};

export default (state = INITAL_STATE, action) => {
  switch (action.type) {
    case INIT_INVITE:
      return { ...state, ...INITAL_STATE };
    case USER_LIST_SUCCESS:
      return { ...state, list: uniqueList([...state.list, ...action.list]) };
    case USER_LIST_FAIL:
      return { ...state, list: [...state.list] };
    case CREATE_GROUP_CHANNEL_SUCCESS:
      return { ...state, channel: action.channel };
    case CREATE_GROUP_CHANNEL_FAIL:
      return { ...state, channel: null };
    case INVITE_GROUP_CHANNEL_SUCCESS:
      return { ...state, channel: action.channel };
    case INVITE_GROUP_CHANNEL_FAIL:
      return { ...state, channel: null };
    default:
      return state;
  }
};
