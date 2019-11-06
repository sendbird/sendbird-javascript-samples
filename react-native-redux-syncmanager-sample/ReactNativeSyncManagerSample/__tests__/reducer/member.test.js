import { reducer } from '../../src/reducer/member';
import Action from '../../src/action/member';

describe('reducer/member', () => {
  test('checking initial state', () => {
    const action = { type: 'nonexistent' };
    expect(reducer(undefined, action)).toMatchSnapshot();
  });

  test('MEMBER_INIT', () => {
    const action = {
      type: Action.Type.MEMBER_INIT,
      payload: { members: [{ userId: 1 }, { userId: 2 }, { userId: 3 }] }
    };
    expect(reducer(undefined, action)).toMatchSnapshot();
  });

  test('MEMBER_UPDATE', () => {
    const action = {
      type: Action.Type.MEMBER_UPDATE,
      payload: { members: [{ userId: 1 }, { userId: 2 }, { userId: 3 }] }
    };
    expect(reducer(undefined, action)).toMatchSnapshot();
  });
});
