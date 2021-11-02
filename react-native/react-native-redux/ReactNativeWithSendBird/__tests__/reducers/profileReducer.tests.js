import { profileReducer } from '../../src/reducers';
import {
  INIT_PROFILE,
  GET_PROFILE_SUCCESS,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL
} from '../../src/actions/types';

describe('reducers/profileReducer', () => {
  test('checking initial state', () => {
    const action = { type: 'nonexistent' };
    expect(profileReducer(undefined, action)).toMatchSnapshot();
  });

  test('INIT_PROFILE', () => {
    const action = { type: INIT_PROFILE };
    expect(profileReducer(undefined, action)).toMatchSnapshot();
  });

  test('GET_PROFILE_SUCCESS', () => {
    const action = { type: GET_PROFILE_SUCCESS, userInfo: 'userInfo' };
    expect(profileReducer(undefined, action)).toMatchSnapshot();
  });

  test('UPDATE_PROFILE_SUCCESS', () => {
    const action = { type: UPDATE_PROFILE_SUCCESS };
    expect(profileReducer(undefined, action)).toMatchSnapshot();
  });

  test('UPDATE_PROFILE_FAIL', () => {
    const action = { type: UPDATE_PROFILE_SUCCESS, error: 'error' };
    expect(profileReducer(undefined, action)).toMatchSnapshot();
  });
});
