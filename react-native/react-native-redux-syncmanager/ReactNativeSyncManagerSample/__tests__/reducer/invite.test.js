import { reducer } from '../../src/reducer/invite';
import Action from '../../src/action/invite';

describe('reducer/invite', () => {
  test('checking initial state', () => {
    const action = { type: 'nonexistent' };
    expect(reducer(undefined, action)).toMatchSnapshot();
  });

  test('USER_FETCH', () => {
    const action = {
      type: Action.Type.USER_FETCH,
      payload: {
        users: ['a', 'b', 'c']
      }
    };
    expect(reducer({ users: ['d', 'e', 'f'], err: null }, action)).toMatchSnapshot();
  });
});
