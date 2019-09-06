import 'react-native';
import React from 'react';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { sendbirdLogout, initMenu } from '../../src/actions';
import { INIT_MENU, DISCONNECT_SUCCESS } from '../../src/actions/types';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('actions/menuActions', () => {
  it('initMenu', () => {
    const store = mockStore({});
    store.dispatch(initMenu());
    const actions = store.getActions();
    const expectedPayload = { type: INIT_MENU };
    expect(actions).toEqual([expectedPayload]);
  });

  it('sendbirdLogout success', () => {
    const store = mockStore({});
    return store.dispatch(sendbirdLogout()).then(() => {
      const actions = store.getActions();
      const expectedPayload = {
        type: DISCONNECT_SUCCESS
      };
      expect(actions).toEqual([expectedPayload]);
    });
  });
});
