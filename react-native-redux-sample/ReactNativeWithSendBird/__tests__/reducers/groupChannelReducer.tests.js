import { groupChannelReducer } from '../../src/reducers';
import {
  INIT_GROUP_CHANNEL,
  GROUP_CHANNEL_PROGRESS_START,
  GROUP_CHANNEL_PROGRESS_END,
  GROUP_CHANNEL_LIST_SUCCESS,
  GROUP_CHANNEL_LIST_FAIL,
  GET_GROUP_CHANNEL_SUCCESS,
  GET_GROUP_CHANNEL_FAIL,
  CHANNEL_EDIT_SUCCESS,
  CHANNEL_EDIT_FAIL,
  ADD_GROUP_CHANNEL_ITEM,
  CLEAR_SELECTED_GROUP_CHANNEL,
  GROUP_CHANNEL_CHANGED
} from '../../src/actions/types';

describe('reducers/groupChannelReducer', () => {
  test('checking initial state', () => {
    const action = { type: 'nonexistent' };
    expect(groupChannelReducer(undefined, action)).toMatchSnapshot();
  });

  test('INIT_GROUP_CHANNEL', () => {
    const action = { type: INIT_GROUP_CHANNEL };
    expect(groupChannelReducer(undefined, action)).toMatchSnapshot();
  });

  test('GROUP_CHANNEL_PROGRESS_START', () => {
    const action = { type: GROUP_CHANNEL_PROGRESS_START };
    expect(groupChannelReducer(undefined, action)).toMatchSnapshot();
  });

  test('GROUP_CHANNEL_PROGRESS_END', () => {
    const action = { type: GROUP_CHANNEL_PROGRESS_END };
    expect(groupChannelReducer(undefined, action)).toMatchSnapshot();
  });

  test('GROUP_CHANNEL_LIST_SUCCESS', () => {
    const action = { type: GROUP_CHANNEL_LIST_SUCCESS, list: ['1', '2'] };
    expect(groupChannelReducer(undefined, action)).toMatchSnapshot();
  });

  test('GROUP_CHANNEL_LIST_FAIL', () => {
    const action = { type: GROUP_CHANNEL_LIST_FAIL };
    expect(groupChannelReducer(undefined, action)).toMatchSnapshot();
  });

  test('GET_GROUP_CHANNEL_SUCCESS', () => {
    const action = { type: GET_GROUP_CHANNEL_SUCCESS, channel: 'channel' };
    expect(groupChannelReducer(undefined, action)).toMatchSnapshot();
  });

  test('GET_GROUP_CHANNEL_FAIL', () => {
    const action = { type: GET_GROUP_CHANNEL_FAIL };
    expect(groupChannelReducer(undefined, action)).toMatchSnapshot();
  });

  test('CHANNEL_EDIT_SUCCESS', () => {
    const action = { type: CHANNEL_EDIT_SUCCESS, payload: '2' };
    const state = {
      isLoading: false,
      list: [{ url: '1' }, { url: '2' }, { url: '3' }],
      channel: null
    };
    expect(groupChannelReducer(state, action)).toMatchSnapshot();
  });

  test('CHANNEL_EDIT_FAIL', () => {
    const action = { type: CHANNEL_EDIT_FAIL };
    expect(groupChannelReducer(undefined, action)).toMatchSnapshot();
  });

  test('ADD_GROUP_CHANNEL_ITEM which is present', () => {
    const action = { type: ADD_GROUP_CHANNEL_ITEM, channel: { url: 'new' } };
    const state = {
      isLoading: false,
      list: [{ url: '1' }, { url: '2' }, { url: '3' }, { url: 'new' }],
      channel: null
    };
    expect(groupChannelReducer(undefined, action)).toMatchSnapshot();
  });

  test('ADD_GROUP_CHANNEL_ITEM which is present', () => {
    const action = { type: ADD_GROUP_CHANNEL_ITEM, channel: { url: 'new' } };
    const state = {
      isLoading: false,
      list: [{ url: '1' }, { url: '2' }, { url: '3' }],
      channel: null
    };
    expect(groupChannelReducer(undefined, action)).toMatchSnapshot();
  });

  test('CLEAR_SELECTED_GROUP_CHANNEL', () => {
    const action = { type: CLEAR_SELECTED_GROUP_CHANNEL };
    expect(groupChannelReducer(undefined, action)).toMatchSnapshot();
  });

  test('GROUP_CHANNEL_CHANGED present channel', () => {
    const action = { type: GROUP_CHANNEL_CHANGED, channel: { url: 'new', memberCount: 3 } };
    const state = {
      isLoading: false,
      list: [{ url: '1' }, { url: '2' }, { url: 'new', memberCount: 1 }],
      channel: null
    };
    expect(groupChannelReducer(undefined, action)).toMatchSnapshot();
  });

  test('GROUP_CHANNEL_CHANGED not present channel', () => {
    const action = { type: GROUP_CHANNEL_CHANGED, channel: { url: 'new', memberCount: 3 } };
    const state = {
      isLoading: false,
      list: [{ url: '1' }, { url: '2' }, { url: '3' }],
      channel: null
    };
    expect(groupChannelReducer(undefined, action)).toMatchSnapshot();
  });
});
