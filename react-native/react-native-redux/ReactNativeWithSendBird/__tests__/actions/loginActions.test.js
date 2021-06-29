import 'react-native';
import React from 'react';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { user as userObj, resetUser, restoreAllDefaultMocks } from '../../__mocks__/mockSendbird';
import { mockConnect } from '../../__mocks__/mockSendbird';

import { initLogin, sendbirdLogin } from '../../src/actions';
import { INIT_LOGIN, LOGIN_SUCCESS, LOGIN_FAIL } from '../../src/actions/types';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('actions/loginActions', () => {
  beforeEach(() => {
    resetUser();
    restoreAllDefaultMocks();
  });
  afterAll(() => {
    resetUser();
  });
  it('initLogin', () => {
    const store = mockStore({});
    store.dispatch(initLogin());
    const actions = store.getActions();
    const expectedPayload = { type: INIT_LOGIN };
    expect(actions).toEqual([expectedPayload]);
  });

  it('sendbirdLogin success', () => {
    const store = mockStore({});
    return store.dispatch(sendbirdLogin({ userId: 'userId', nickname: 'nick' })).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: LOGIN_SUCCESS,
        payload: { profileUrl: userObj.profileUrl, nickname: userObj.nickname, userId: userObj.userId }
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('sendbirdLogin fail userId missing', () => {
    const store = mockStore({});
    return store.dispatch(sendbirdLogin({ nickname: 'nick' })).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: LOGIN_FAIL,
        payload: 'UserID is required.'
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('sendbirdLogin fail nickname missing', () => {
    const store = mockStore({});
    return store.dispatch(sendbirdLogin({ userId: 'userId' })).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: LOGIN_FAIL,
        payload: 'Nickname is required.'
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });

  it('sendbirdLogin fail API request', () => {
    const store = mockStore({});
    mockConnect.mockImplementation((userId, cb) => {
      cb(null, new Error());
    });
    return store.dispatch(sendbirdLogin({ userId: 'userId', nickname: 'nick' })).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: LOGIN_FAIL,
        payload: 'SendBird Login Failed.'
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });
});
