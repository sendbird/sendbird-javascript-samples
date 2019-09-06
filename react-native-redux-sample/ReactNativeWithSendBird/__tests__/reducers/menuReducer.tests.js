import { menuReducer } from '../../src/reducers';
import { INIT_MENU, DISCONNECT_SUCCESS } from '../../src/actions/types';

describe('reducers/menuReducer', () => {
  test('checking initial state', () => {
    const action = { type: 'nonexistent' };
    expect(menuReducer(undefined, action)).toMatchSnapshot();
  });

  test('INIT_MENU', () => {
    const action = { type: INIT_MENU };
    expect(menuReducer(undefined, action)).toMatchSnapshot();
  });

  test('DISCONNECT_SUCCESS', () => {
    const action = { type: DISCONNECT_SUCCESS };
    expect(menuReducer(undefined, action)).toMatchSnapshot();
  });
});
