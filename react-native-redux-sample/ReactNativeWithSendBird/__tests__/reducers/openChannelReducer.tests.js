import { openChannelReducer } from '../../src/reducers';
import {
  INIT_OPEN_CHANNEL,
  OPEN_CHANNEL_PROGRESS_START,
  OPEN_CHANNEL_PROGRESS_END,
  OPEN_CHANNEL_LIST_SUCCESS,
  OPEN_CHANNEL_LIST_FAIL,
  GET_OPEN_CHANNEL_SUCCESS,
  GET_OPEN_CHANNEL_FAIL,
  ADD_OPEN_CHANNEL_ITEM,
  CLEAR_ADD_OPEN_CHANNEL,
  CLEAR_SELETED_OPEN_CHANNEL
} from '../../src/actions/types';

describe('reducers/openChannelReducer', () => {
  test('checking initial state', () => {
    const action = { type: 'nonexistent' };
    expect(openChannelReducer(undefined, action)).toMatchSnapshot();
  });

  test('INIT_OPEN_CHANNEL', () => {
    const action = { type: INIT_OPEN_CHANNEL };
    expect(openChannelReducer(undefined, action)).toMatchSnapshot();
  });

  test('OPEN_CHANNEL_PROGRESS_START', () => {
    const action = { type: OPEN_CHANNEL_PROGRESS_START };
    expect(openChannelReducer(undefined, action)).toMatchSnapshot();
  });

  test('OPEN_CHANNEL_PROGRESS_END', () => {
    const action = { type: OPEN_CHANNEL_PROGRESS_END };
    expect(openChannelReducer(undefined, action)).toMatchSnapshot();
  });

  test('OPEN_CHANNEL_LIST_SUCCESS', () => {
    const action = { type: OPEN_CHANNEL_LIST_SUCCESS, list: ['1', '2', '3'] };
    expect(openChannelReducer(undefined, action)).toMatchSnapshot();
  });

  test('OPEN_CHANNEL_LIST_FAIL', () => {
    const action = { type: OPEN_CHANNEL_LIST_FAIL };
    expect(openChannelReducer(undefined, action)).toMatchSnapshot();
  });

  test('GET_OPEN_CHANNEL_SUCCESS', () => {
    const action = { type: GET_OPEN_CHANNEL_SUCCESS, channel: 'channel' };
    expect(openChannelReducer(undefined, action)).toMatchSnapshot();
  });

  test('GET_OPEN_CHANNEL_FAIL', () => {
    const action = { type: GET_OPEN_CHANNEL_FAIL };
    expect(openChannelReducer(undefined, action)).toMatchSnapshot();
  });

  test('ADD_OPEN_CHANNEL_ITEM', () => {
    const action = { type: ADD_OPEN_CHANNEL_ITEM, channel: 'channel' };
    expect(openChannelReducer(undefined, action)).toMatchSnapshot();
  });

  test('CLEAR_ADD_OPEN_CHANNEL', () => {
    const action = { type: CLEAR_ADD_OPEN_CHANNEL };
    expect(openChannelReducer(undefined, action)).toMatchSnapshot();
  });

  test('CLEAR_SELETED_OPEN_CHANNEL', () => {
    const action = { type: CLEAR_SELETED_OPEN_CHANNEL };
    expect(openChannelReducer(undefined, action)).toMatchSnapshot();
  });
});
