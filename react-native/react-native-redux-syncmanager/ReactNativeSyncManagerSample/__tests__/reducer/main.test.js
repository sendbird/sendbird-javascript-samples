import { reducer } from '../../src/reducer/main';
import Action from '../../src/action/main';

describe('reducer/main', () => {
  test('checking initial state', () => {
    const action = { type: 'nonexistent' };
    expect(reducer(undefined, action)).toMatchSnapshot();
  });

  test('CHANNEL_ADD initially empty', () => {
    const action = {
      type: Action.Type.CHANNEL_ADD,
      payload: { channels: [{ url: 'url 1' }, { url: 'url 2' }] }
    };
    expect(reducer(undefined, action)).toMatchSnapshot();
  });

  test('CHANNEL_ADD initially non-empty, insert by createdAt', () => {
    const action = {
      type: Action.Type.CHANNEL_ADD,
      payload: { channels: [{ createdAt: 4, url: '4' }, { createdAt: 6, url: '6' }] }
    };
    const initState = {
      channels: [
        {
          createdAt: 5,
          url: '5'
        },
        {
          createdAt: 3,
          url: '3'
        },
        {
          createdAt: 2,
          url: '2'
        },
        {
          createdAt: 1,
          url: '1'
        }
      ]
    };
    expect(reducer(initState, action)).toMatchSnapshot();
  });

  test('CHANNEL_ADD initially non-empty, insert by lastMessage', () => {
    const action = {
      type: Action.Type.CHANNEL_ADD,
      payload: { channels: [{ createdAt: 4, url: '4' }, { createdAt: 6, url: '6' }] }
    };
    const initState = {
      channels: [
        {
          lastMessage: {
            createdAt: 5
          },
          url: '5'
        },
        {
          lastMessage: {
            createdAt: 3
          },
          url: '3'
        },
        {
          lastMessage: {
            createdAt: 2
          },
          url: '2'
        },
        {
          lastMessage: {
            createdAt: 1
          },
          url: '1'
        }
      ]
    };
    expect(reducer(initState, action)).toMatchSnapshot();
  });

  test('CHANNEL_UPDATE', () => {
    const action = {
      type: Action.Type.CHANNEL_UPDATE,
      payload: { channels: [{ url: '1', updated: true }, { url: '2', updated: true }, { url: '6', updated: true }] }
    };
    const initState = {
      channels: [
        {
          url: '5'
        },
        {
          url: '3'
        },
        {
          url: '2'
        },
        {
          url: '1'
        }
      ]
    };
    expect(reducer(initState, action)).toMatchSnapshot();
  });

  test('CHANNEL_REMOVE', () => {
    const action = {
      type: Action.Type.CHANNEL_REMOVE,
      payload: { channels: [{ url: '1' }, { url: '2' }, { url: '6' }] }
    };
    const initState = {
      channels: [
        {
          url: '5'
        },
        {
          url: '3'
        },
        {
          url: '2'
        },
        {
          url: '1'
        }
      ]
    };
    expect(reducer(initState, action)).toMatchSnapshot();
  });

  test('CHANNEL_MOVE', () => {
    const action = {
      type: Action.Type.CHANNEL_MOVE,
      payload: { channels: [{ url: '1', createdAt: 10 }] }
    };
    const initState = {
      channels: [
        {
          url: '5',
          createdAt: 5
        },
        {
          url: '3',
          createdAt: 3
        },
        {
          url: '2',
          createdAt: 2
        },
        {
          url: '1',
          createdAt: 1
        }
      ]
    };
    expect(reducer(initState, action)).toMatchSnapshot();
  });

  test('CHANNEL_CLEAR', () => {
    const action = {
      type: Action.Type.CHANNEL_CLEAR
    };
    const initState = {
      channels: [
        {
          url: '5'
        },
        {
          url: '3'
        },
        {
          url: '2'
        },
        {
          url: '1'
        }
      ]
    };
    expect(reducer(initState, action)).toMatchSnapshot();
  });
});
