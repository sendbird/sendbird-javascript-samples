import { INIT_MEMBER, MEMBER_LIST_SUCCESS, MEMBER_LIST_FAIL } from '../actions/types';

const INITAL_STATE = {
  list: []
};

export default (state = INITAL_STATE, action) => {
  switch (action.type) {
    case INIT_MEMBER:
      return { ...state, ...INITAL_STATE };
    case MEMBER_LIST_SUCCESS:
      return { ...state, list: action.list };
    case MEMBER_LIST_FAIL:
      return { ...state, list: [] };
    default:
      return state;
  }
};
