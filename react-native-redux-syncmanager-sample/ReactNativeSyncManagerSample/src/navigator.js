
const _stack = [];

export const navigator = {
  push: channelUrl => {
    if(_stack.indexOf(channelUrl) < 0) {
      _stack.push(channelUrl);
      return true;
    }
    return false;
  },
  pop: () => {
    if(_stack.length > 0) {
      _stack.pop();
    }
  },
  top: () => {
    return _stack.length > 0 ? _stack[_stack.length - 1] : null;
  }
};