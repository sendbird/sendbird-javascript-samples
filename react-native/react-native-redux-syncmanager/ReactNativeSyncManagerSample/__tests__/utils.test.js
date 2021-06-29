import {
  getChannelIndex,
  findChannelIndex,
  getMessageIndex,
  findMessageIndex,
  createChannelTitle,
  toast
} from '../src/utils';
import { Toast } from '../__mocks__/mockToast';

describe('utils', () => {
  it('getChannelIndex', () => {
    const newChannel = {
      url: '123'
    };
    const channels = [{ url: '456' }, { url: '756' }, { url: '901' }, { url: '123' }];
    expect(getChannelIndex(newChannel, channels)).toBe(3);
    expect(getChannelIndex(newChannel, channels.filter(channel => channel.url !== '123'))).toBe(-1);
  });

  it('findChannelIndex', () => {
    let newChannel = {
      url: '123',
      lastMessage: {
        createdAt: 8
      }
    };
    let channels = [
      {
        url: '456',
        lastMessage: {
          createdAt: 8
        }
      },
      {
        url: '756',
        lastMessage: {
          createdAt: 9
        }
      },
      {
        url: '901',
        lastMessage: {
          createdAt: 10
        }
      },
      {
        url: '123',
        lastMessage: {
          createdAt: 7
        }
      }
    ];
    expect(findChannelIndex(newChannel, channels)).toBe(3);
    expect(findChannelIndex(newChannel, channels)).toBe(3);
    newChannel = {
      url: '123',
      createdAt: 8
    };
    channels = [
      {
        url: '456',
        createdAt: 8
      },
      {
        url: '756',
        createdAt: 9
      },
      {
        url: '901',
        createdAt: 10
      },
      {
        url: '123',
        createdAt: 7
      }
    ];
    expect(findChannelIndex(newChannel, channels)).toBe(3);
    expect(findChannelIndex(newChannel, channels.filter(channel => channel.url !== '123'))).toBe(3);
    channels[1].createdAt = 5;
    expect(findChannelIndex(newChannel, channels)).toBe(1);
    newChannel.createdAt = 1;
    expect(findChannelIndex(newChannel, channels)).toBe(channels.length);
  });

  it('getMessageIndex', () => {
    const newMessage = {
      url: '123',
      isIdentical: msg => {
        return msg.url === '123';
      }
    };
    const messages = [{ url: '456' }, { url: '756' }, { url: '901' }, { url: '123' }];
    expect(getMessageIndex(newMessage, messages)).toBe(3);
    expect(getMessageIndex(newMessage, messages.filter(channel => channel.url !== '123'))).toBe(-1);
  });

  it('findMessageIndex createdAt', () => {
    const newMessage = {
      url: '123',
      createdAt: 5,
      reqId: 123
    };
    const messages = [{ createdAt: 6 }, { createdAt: 7 }, { createdAt: 8 }, { createdAt: 4 }];
    expect(findMessageIndex(newMessage, messages, true)).toBe(3);
    expect(findMessageIndex(newMessage, messages.filter(channel => channel.createdAt !== 4), true)).toBe(3);
  });

  it('findMessageIndex reqId', () => {
    const messages = [{ reqId: 6 }, { reqId: 7 }, { reqId: 8 }, { reqId: 4 }];
    expect(findMessageIndex({ reqId: 4 }, messages, true)).toBe(3);
    expect(findMessageIndex({ reqId: 7 }, messages, true)).toBe(1);
  });

  it('findMessageIndex messageId', () => {
    const messages = [{ messageId: 6 }, { messageId: 7 }, { messageId: 8 }, { messageId: 4 }];
    expect(findMessageIndex({ messageId: 4 }, messages, false)).toBe(3);
    expect(findMessageIndex({ messageId: 7 }, messages)).toBe(1);
  });

  it('createChannelTitle concise', () => {
    const channel = {
      members: [
        { nickname: '12345' },
        { nickname: '23456' },
        { nickname: '56789' },
        { nickname: '10123' },
        { nickname: '11234' }
      ]
    };
    expect(createChannelTitle(channel)).toMatchSnapshot();
  });

  it('createChannelTitle full', () => {
    const channel = {
      members: [{ nickname: '12345' }, { nickname: '23456' }, { nickname: '56789' }]
    };
    expect(createChannelTitle(channel)).toMatchSnapshot();
  });

  it('toast', () => {
    toast('hello');
    expect(Toast.show.mock.calls.length).toBe(1);
  });
});
