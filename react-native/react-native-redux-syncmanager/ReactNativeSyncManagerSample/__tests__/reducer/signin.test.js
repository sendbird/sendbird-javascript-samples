import { reducer } from '../../src/reducer/signin';
import Action from '../../src/action/signin';

describe('reducer/signin', () => {
  test('checking initial state', () => {
    const action = { type: 'nonexistent' };
    expect(reducer(undefined, action)).toMatchSnapshot();
  });

  test('AUTHENTICATE', () => {
    const action = {
      type: Action.Type.AUTHENTICATE
    };
    expect(reducer(undefined, action)).toMatchSnapshot();
  });

  test('SIGNIN_SUCCESS', () => {
    const action = {
      type: Action.Type.SIGNIN_SUCCESS,
      payload: { user: { userId: 1 } }
    };
    expect(reducer(undefined, action)).toMatchSnapshot();
  });

  test('SIGNIN_FAILED', () => {
    const action = {
      type: Action.Type.SIGNIN_FAILED,
      payload: { err: new Error('authentication failed') }
    };
    expect(reducer(undefined, action)).toMatchSnapshot();
  });
});
