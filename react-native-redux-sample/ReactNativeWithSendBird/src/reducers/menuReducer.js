import { INIT_MENU, DISCONNECT_SUCCESS } from '../actions/types';

const INITIAL_STATE = {
  isDisconnected: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INIT_MENU:
      return { ...state, ...INITIAL_STATE };
    case DISCONNECT_SUCCESS:
      return { ...state, isDisconnected: true };
    default:
      return state;
  }
};
