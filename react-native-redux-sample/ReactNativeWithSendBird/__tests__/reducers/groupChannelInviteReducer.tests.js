import { groupChannelInviteReducer } from '../../src/reducers';
import {
  INIT_INVITE,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  CREATE_GROUP_CHANNEL_SUCCESS,
  CREATE_GROUP_CHANNEL_FAIL,
  INVITE_GROUP_CHANNEL_SUCCESS,
  INVITE_GROUP_CHANNEL_FAIL
} from '../../src/actions/types';

describe('reducers/groupChannelInviteReducer', () => {
  test('checking initial state', () => {
    const action = { type: 'nonexistent' };
    expect(groupChannelInviteReducer(undefined, action)).toMatchSnapshot();
  });

  test('INIT_INVITE', () => {
    const action = { type: INIT_INVITE };
    expect(groupChannelInviteReducer(undefined, action)).toMatchSnapshot();
  });

  test('USER_LIST_SUCCESS', () => {
    const action = { type: USER_LIST_SUCCESS, list: 'user' };
    expect(groupChannelInviteReducer(undefined, action)).toMatchSnapshot();
  });

  test('USER_LIST_FAIL', () => {
    const action = { type: USER_LIST_FAIL, payload: 'error' };
    expect(groupChannelInviteReducer(undefined, action)).toMatchSnapshot();
  });

  test('CREATE_GROUP_CHANNEL_SUCCESS', () => {
    const action = { type: CREATE_GROUP_CHANNEL_SUCCESS, channel: 'channel' };
    expect(groupChannelInviteReducer(undefined, action)).toMatchSnapshot();
  });

  test('CREATE_GROUP_CHANNEL_FAIL', () => {
    const action = { type: CREATE_GROUP_CHANNEL_FAIL };
    expect(groupChannelInviteReducer(undefined, action)).toMatchSnapshot();
  });

  test('INVITE_GROUP_CHANNEL_SUCCESS', () => {
    const action = { type: INVITE_GROUP_CHANNEL_SUCCESS, channel: 'channel' };
    expect(groupChannelInviteReducer(undefined, action)).toMatchSnapshot();
  });

  test('INVITE_GROUP_CHANNEL_FAIL', () => {
    const action = { type: INVITE_GROUP_CHANNEL_FAIL };
    expect(groupChannelInviteReducer(undefined, action)).toMatchSnapshot();
  });
});
