import 'react-native';
import React from 'react';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { user as userObj, setUser, resetUser } from '../../__mocks__/mockSendbird';
import { mockUpdateCurrentUserInfo, restoreAllDefaultMocks } from '../../__mocks__/mockSendbird';

import { initProfile, getCurrentUserInfo, updateProfile } from '../../src/actions';
import {
  INIT_PROFILE,
  GET_PROFILE_SUCCESS,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL
} from '../../src/actions/types';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('actions/profileActions', () => {
  beforeEach(() => {
    resetUser();
    restoreAllDefaultMocks();
  });
  afterAll(() => {
    resetUser();
  });
  it('initProfile', () => {
    const store = mockStore({});
    store.dispatch(initProfile());
    const actions = store.getActions();
    const expectedPayload = { type: INIT_PROFILE };
    expect(actions).toEqual([expectedPayload]);
  });

  it('getCurrentUserInfo', () => {
    const store = mockStore({});
    store.dispatch(getCurrentUserInfo());
    const actions = store.getActions();
    const expectedPayload = {
      type: GET_PROFILE_SUCCESS,
      userInfo: { profileUrl: userObj.profileUrl, nickname: userObj.nickname }
    };
    expect(actions).toEqual([expectedPayload]);
  });

  it('getCurrentUserInfo no user', () => {
    const store = mockStore({});
    setUser(null);
    store.dispatch(getCurrentUserInfo());
    const actions = store.getActions();
    const expectedPayload = {
      type: GET_PROFILE_SUCCESS,
      userInfo: {}
    };
    expect(actions).toEqual([expectedPayload]);
  });

  it('updateProfile success', () => {
    const store = mockStore({});
    return store.dispatch(updateProfile('new nickname')).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: UPDATE_PROFILE_SUCCESS,
        userInfo: { profileUrl: userObj.profileUrl, nickname: userObj.nickname }
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('updateProfile fail', () => {
    const store = mockStore({});
    return store.dispatch(updateProfile(null)).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: UPDATE_PROFILE_FAIL,
        error: 'Nickname is required.'
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('updateProfile fail API request', () => {
    const store = mockStore({});
    mockUpdateCurrentUserInfo.mockImplementation((nickname, profileUrl, cb) => {
      cb(null, new Error());
    });
    return store.dispatch(updateProfile('new nickname')).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: UPDATE_PROFILE_FAIL,
        error: 'Update profile failed.'
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });
});
