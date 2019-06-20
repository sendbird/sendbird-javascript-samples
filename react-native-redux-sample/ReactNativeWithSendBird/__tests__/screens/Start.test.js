import 'react-native';
import MockStorage from '../helpers/MockStorage';
import React from 'react';
import store from '../../src/store';
import renderer from 'react-test-renderer';
import { NavigationActions, StackActions } from 'react-navigation';
import Start from '../../src/screens/Start';

const storageCache = {};
const AsyncStorage = new MockStorage(storageCache);
jest.setMock('AsyncStorage', AsyncStorage);

const navigation = {
  setParams: jest.fn(),
  navigate: jest.fn(),
  state: {
    params: {
      channelUrl: 'channelUrl'
    }
  },
  dispatch: jest.fn()
};

describe('screen/Start', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<Start store={store} navigation={navigation} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when no user present', done => {
    const tree = renderer.create(<Start store={store} navigation={navigation} />).toJSON();
    expect(tree).toMatchSnapshot();
    setTimeout(() => {
      expect(navigation.dispatch).toBeCalled();
      expect(StackActions.reset).toBeCalled();
      expect(NavigationActions.navigate).toBeCalledWith({ routeName: 'Login', params: undefined });
      done();
    }, 1000);
  });

  it('renders correctly when user present', done => {
    const user = {
      userId: '1',
      nickname: 'nick'
    };
    AsyncStorage.setItem('user', JSON.stringify(user), error => {
      const tree = renderer.create(<Start store={store} navigation={navigation} />).toJSON();
      expect(tree).toMatchSnapshot();
      setTimeout(() => {
        expect(navigation.dispatch).toBeCalled();
        expect(StackActions.reset).toBeCalled();
        expect(NavigationActions.navigate).toBeCalledWith({ routeName: 'Menu', params: undefined });
        done();
      }, 1000);
    });
  });

  it('renders correctly when malformed user data present', done => {
    const user = {
      userId: null,
      nickname: 'nick'
    };
    AsyncStorage.setItem('user', JSON.stringify(user), error => {
      const tree = renderer.create(<Start store={store} navigation={navigation} />).toJSON();
      expect(tree).toMatchSnapshot();
      setTimeout(() => {
        expect(navigation.dispatch).toBeCalled();
        expect(StackActions.reset).toBeCalled();
        expect(NavigationActions.navigate).toBeCalledWith({ routeName: 'Login', params: undefined });
        done();
      }, 1000);
    });
  });

  // TODO: add test cases
});
