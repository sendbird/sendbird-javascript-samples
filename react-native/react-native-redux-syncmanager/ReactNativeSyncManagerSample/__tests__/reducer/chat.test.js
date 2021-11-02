import { reducer } from '../../src/reducer/chat';
import Action from '../../src/action/chat';

describe('reducer/chat', () => {
  test('checking initial state', () => {
    const action = { type: 'nonexistent' };
    expect(reducer(undefined, action)).toMatchSnapshot();
  });

  test('MESSAGE_SELECT', () => {
    const action = {
      type: Action.Type.MESSAGE_SELECT,
      payload: {
        message: {
          messageId: 1
        }
      }
    };
    const initState = {
      channel: null,
      messages: [
        {
          messageId: 1
        },
        {
          messageId: 2
        },
        {
          messageId: 3
        },
        {
          messageId: 4
        }
      ],
      inputMode: 'chat',
      failedMessages: []
    };
    expect(reducer(initState, action)).toMatchSnapshot();
  });

  test('MESSAGE_DESELECT_ALL', () => {
    const action = {
      type: Action.Type.MESSAGE_DESELECT_ALL
    };
    const initState = {
      channel: null,
      messages: [
        {
          messageId: 1,
          _selected: true
        },
        {
          messageId: 2,
          _selected: true
        },
        {
          messageId: 3
        },
        {
          messageId: 4
        }
      ],
      inputMode: 'chat',
      failedMessages: []
    };
    expect(reducer(initState, action)).toMatchSnapshot();
  });

  test('MESSAGE_ADD', () => {
    const action = {
      type: Action.Type.MESSAGE_ADD,
      payload: {
        messages: [
          {
            messageId: 5,
            createdAt: 5,
            sender: {
              userId: 4
            }
          },
          {
            messageId: 6,
            createdAt: 6,
            sender: {
              userId: 4
            }
          },
          {
            messageId: 7,
            createdAt: 7,
            sender: {
              userId: 5
            }
          }
        ]
      }
    };
    const initState = {
      channel: null,
      messages: [
        {
          messageId: 4,
          createdAt: 4,
          sender: {
            userId: 4
          }
        },
        {
          messageId: 3,
          createdAt: 3,
          sender: {
            userId: 4
          }
        },
        {
          messageId: 2,
          createdAt: 2,
          sender: {
            userId: 4
          }
        },
        {
          messageId: 1,
          createdAt: 1,
          sender: {
            userId: 4
          }
        }
      ],
      inputMode: 'chat',
      failedMessages: []
    };
    expect(reducer(initState, action)).toMatchSnapshot();
  });

  test('MESSAGE_UPDATE', () => {
    const action = {
      type: Action.Type.MESSAGE_UPDATE,
      payload: {
        messages: [
          {
            messageId: 4,
            createdAt: 4,
            sender: {
              userId: 4
            },
            message: 'text 4'
          },
          {
            messageId: 3,
            createdAt: 3,
            sender: {
              userId: 4
            },
            message: 'text 3'
          }
        ]
      }
    };
    action.payload.messages.forEach(m => {
      m.isIdentical = om => {
        return om.messageId === m.messageId;
      };
    });
    const initState = {
      channel: null,
      messages: [
        {
          messageId: 4,
          createdAt: 4,
          sender: {
            userId: 4
          },
          message: 'old text 4',
          _isPreviousMessageSentBySameUser: true
        },
        {
          messageId: 3,
          createdAt: 3,
          sender: {
            userId: 4
          },
          message: 'old text 3'
        },
        {
          messageId: 2,
          createdAt: 2,
          sender: {
            userId: 4
          }
        },
        {
          messageId: 1,
          createdAt: 1,
          sender: {
            userId: 4
          }
        }
      ],
      inputMode: 'chat',
      failedMessages: []
    };
    expect(reducer(initState, action)).toMatchSnapshot();
  });

  test('MESSAGE_REMOVE', () => {
    const action = {
      type: Action.Type.MESSAGE_REMOVE,
      payload: {
        messages: [
          {
            messageId: 3,
            createdAt: 3,
            sender: {
              userId: 4
            }
          }
        ]
      }
    };
    action.payload.messages.forEach(m => {
      m.isIdentical = om => {
        return om.messageId === m.messageId;
      };
    });
    const initState = {
      channel: null,
      messages: [
        {
          messageId: 4,
          createdAt: 4,
          sender: {
            userId: 4
          }
        },
        {
          messageId: 3,
          createdAt: 3,
          sender: {
            userId: 4
          }
        },
        {
          messageId: 2,
          createdAt: 2,
          sender: {
            userId: 4
          }
        },
        {
          messageId: 1,
          createdAt: 1,
          sender: {
            userId: 4
          }
        }
      ],
      inputMode: 'chat',
      failedMessages: []
    };
    expect(reducer(initState, action)).toMatchSnapshot();
  });

  test('MESSAGE_CLEAR', () => {
    const action = {
      type: Action.Type.MESSAGE_CLEAR
    };
    const initState = {
      channel: null,
      messages: [
        {
          messageId: 4,
          createdAt: 4,
          sender: {
            userId: 4
          }
        },
        {
          messageId: 3,
          createdAt: 3,
          sender: {
            userId: 4
          }
        },
        {
          messageId: 2,
          createdAt: 2,
          sender: {
            userId: 4
          }
        },
        {
          messageId: 1,
          createdAt: 1,
          sender: {
            userId: 4
          }
        }
      ],
      inputMode: 'chat',
      failedMessages: []
    };
    expect(reducer(initState, action)).toMatchSnapshot();
  });

  test('FAILED_MESSAGE_ADD', () => {
    const action = {
      type: Action.Type.FAILED_MESSAGE_ADD,
      payload: {
        messages: [
          {
            messageId: 5,
            createdAt: 5,
            sender: {
              userId: 4
            }
          },
          {
            messageId: 6,
            createdAt: 6,
            sender: {
              userId: 4
            }
          },
          {
            messageId: 7,
            createdAt: 7,
            sender: {
              userId: 5
            }
          }
        ]
      }
    };
    const initState = {
      channel: null,
      failedMessages: [
        {
          messageId: 4,
          createdAt: 4,
          sender: {
            userId: 4
          }
        },
        {
          messageId: 3,
          createdAt: 3,
          sender: {
            userId: 4
          }
        },
        {
          messageId: 2,
          createdAt: 2,
          sender: {
            userId: 4
          }
        },
        {
          messageId: 1,
          createdAt: 1,
          sender: {
            userId: 4
          }
        }
      ],
      inputMode: 'chat',
      messages: []
    };
    expect(reducer(initState, action)).toMatchSnapshot();
  });

  test('FAILED_MESSAGE_REMOVE', () => {
    const action = {
      type: Action.Type.FAILED_MESSAGE_REMOVE,
      payload: {
        messages: [
          {
            messageId: 3,
            createdAt: 3,
            sender: {
              userId: 4
            }
          }
        ]
      }
    };
    action.payload.messages.forEach(m => {
      m.isIdentical = om => {
        return om.messageId === m.messageId;
      };
    });
    const initState = {
      channel: null,
      failedMessages: [
        {
          messageId: 4,
          createdAt: 4,
          sender: {
            userId: 4
          }
        },
        {
          messageId: 3,
          createdAt: 3,
          sender: {
            userId: 4
          }
        },
        {
          messageId: 2,
          createdAt: 2,
          sender: {
            userId: 4
          }
        },
        {
          messageId: 1,
          createdAt: 1,
          sender: {
            userId: 4
          }
        }
      ],
      inputMode: 'chat',
      messages: []
    };
    expect(reducer(initState, action)).toMatchSnapshot();
  });

  test('FAILED_MESSAGE_CLEAR', () => {
    const action = {
      type: Action.Type.FAILED_MESSAGE_CLEAR
    };
    const initState = {
      channel: null,
      failedMessages: [
        {
          messageId: 4,
          createdAt: 4,
          sender: {
            userId: 4
          }
        },
        {
          messageId: 3,
          createdAt: 3,
          sender: {
            userId: 4
          }
        },
        {
          messageId: 2,
          createdAt: 2,
          sender: {
            userId: 4
          }
        },
        {
          messageId: 1,
          createdAt: 1,
          sender: {
            userId: 4
          }
        }
      ],
      inputMode: 'chat',
      messages: []
    };
    expect(reducer(initState, action)).toMatchSnapshot();
  });
});
