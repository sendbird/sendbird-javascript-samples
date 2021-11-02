import { openChannelCreateReducer } from '../../src/reducers';
import {
  INIT_OPEN_CHANNEL_CREATE,
  OPEN_CHANNEL_CREATE_SUCCESS,
  OPEN_CHANNEL_CREATE_FAIL
} from '../../src/actions/types';

describe('reducers/openChannelCreateReducer', () => {
  test('checking initial state', () => {
    const action = { type: 'nonexistent' };
    expect(openChannelCreateReducer(undefined, action)).toMatchSnapshot();
  });

  test('INIT_OPEN_CHANNEL_CREATE', () => {
    const action = { type: INIT_OPEN_CHANNEL_CREATE };
    expect(openChannelCreateReducer(undefined, action)).toMatchSnapshot();
  });

  test('OPEN_CHANNEL_CREATE_SUCCESS', () => {
    const action = { type: OPEN_CHANNEL_CREATE_SUCCESS, channel: 'channel' };
    expect(openChannelCreateReducer(undefined, action)).toMatchSnapshot();
  });

  test('OPEN_CHANNEL_CREATE_FAIL', () => {
    const action = { type: OPEN_CHANNEL_CREATE_FAIL, error: 'error' };
    expect(openChannelCreateReducer(undefined, action)).toMatchSnapshot();
  });
});
