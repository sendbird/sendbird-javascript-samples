import {
  INIT_BLOCK_USER,
  BLOCK_LIST_SUCCESS,
  BLOCK_LIST_FAIL,
  USER_UNBLOCK_SUCCESS,
  USER_UNBLOCK_FAIL
} from '../actions/types';

const INITAL_STATE = {
  list: [],
  unblockedUserId: ''
};

export default (state = INITAL_STATE, action) => {
  switch (action.type) {
    case INIT_BLOCK_USER:
      return { ...state, ...INITAL_STATE };
    case BLOCK_LIST_SUCCESS:
      return { ...state, list: action.list };
    case BLOCK_LIST_FAIL:
      return { ...state, list: [] };
    case USER_UNBLOCK_SUCCESS:
      return { ...state, unblockedUserId: action.unblockedUserId };
    case USER_UNBLOCK_FAIL:
      return { ...state, unblockedUserId: '' };
    default:
      return state;
  }
};
