import { loginReducer } from '../../src/reducers';
import { INIT_LOGIN, LOGIN_SUCCESS, LOGIN_FAIL } from '../../src/actions/types';

describe('reducers/loginReducer', () => {
  test('checking initial state', () => {
    const action = { type: 'nonexistent' };
    expect(loginReducer(undefined, action)).toMatchSnapshot();
  });

  test('INIT_LOGIN', () => {
    const action = { type: INIT_LOGIN };
    expect(loginReducer(undefined, action)).toMatchSnapshot();
  });

  test('LOGIN_SUCCESS', () => {
    const action = { type: LOGIN_SUCCESS, payload: 'user' };
    expect(loginReducer(undefined, action)).toMatchSnapshot();
  });

  test('LOGIN_FAIL', () => {
    const action = { type: LOGIN_FAIL, payload: 'error' };
    expect(loginReducer(undefined, action)).toMatchSnapshot();
  });
});
