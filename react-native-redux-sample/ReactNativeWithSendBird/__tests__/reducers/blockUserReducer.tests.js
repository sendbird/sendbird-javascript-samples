import { blockUserReducer } from '../../src/reducers';
import {
  INIT_BLOCK_USER,
  BLOCK_LIST_SUCCESS,
  BLOCK_LIST_FAIL,
  USER_UNBLOCK_SUCCESS,
  USER_UNBLOCK_FAIL
} from '../../src/actions/types';

describe('reducers/blockUserReducer', () => {
  test('checking initial state', () => {
    const action = { type: 'nonexistent' };
    expect(blockUserReducer(undefined, action)).toMatchSnapshot();
  });

  test('INIT_BLOCK_USER', () => {
    const action = { type: INIT_BLOCK_USER };
    expect(blockUserReducer(undefined, action)).toMatchSnapshot();
  });

  test('BLOCK_LIST_SUCCESS', () => {
    const action = { type: BLOCK_LIST_SUCCESS, list: 'list' };
    expect(blockUserReducer(undefined, action)).toMatchSnapshot();
  });

  test('BLOCK_LIST_FAIL', () => {
    const action = { type: BLOCK_LIST_FAIL, payload: 'error' };
    expect(blockUserReducer(undefined, action)).toMatchSnapshot();
  });

  test('USER_UNBLOCK_SUCCESS', () => {
    const action = { type: USER_UNBLOCK_SUCCESS, unblockedUserId: 'id' };
    expect(blockUserReducer(undefined, action)).toMatchSnapshot();
  });

  test('USER_UNBLOCK_FAIL', () => {
    const action = { type: USER_UNBLOCK_FAIL };
    expect(blockUserReducer(undefined, action)).toMatchSnapshot();
  });
});
