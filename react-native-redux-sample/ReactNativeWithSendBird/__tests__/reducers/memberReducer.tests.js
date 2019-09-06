import { memberReducer } from '../../src/reducers';
import { INIT_MEMBER, MEMBER_LIST_SUCCESS, MEMBER_LIST_FAIL } from '../../src/actions/types';

describe('reducers/memberReducer', () => {
  test('checking initial state', () => {
    const action = { type: 'nonexistent' };
    expect(memberReducer(undefined, action)).toMatchSnapshot();
  });

  test('INIT_MEMBER', () => {
    const action = { type: INIT_MEMBER };
    expect(memberReducer(undefined, action)).toMatchSnapshot();
  });

  test('MEMBER_LIST_SUCCESS', () => {
    const action = { type: MEMBER_LIST_SUCCESS, list: ['1', '2'] };
    expect(memberReducer(undefined, action)).toMatchSnapshot();
  });

  test('MEMBER_LIST_FAIL', () => {
    const action = { type: MEMBER_LIST_FAIL };
    expect(memberReducer(undefined, action)).toMatchSnapshot();
  });
});
