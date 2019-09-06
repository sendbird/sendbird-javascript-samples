import { INIT_LOGIN, LOGIN_SUCCESS, LOGIN_FAIL } from './types';
import { sbConnect } from '../sendbirdActions';

export const initLogin = () => {
  return { type: INIT_LOGIN };
};

export const sendbirdLogin = ({ userId, nickname }) => {
  return dispatch => {
    return sbConnect(userId, nickname)
      .then(user => loginSuccess(dispatch, user))
      .catch(error => loginFail(dispatch, error));
  };
};

const loginFail = (dispatch, error) => {
  dispatch({
    type: LOGIN_FAIL,
    payload: error
  });
};

const loginSuccess = (dispatch, user) => {
  dispatch({
    type: LOGIN_SUCCESS,
    payload: user
  });
};
