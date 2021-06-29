export const loginReducer = (state, action) => {
  switch (action.type) {
    case 'edit-userId': {
      const { content } = action.payload || {};
      return { ...state, userId: content };
    }
    case 'edit-nickname': {
      const { content } = action.payload || {};
      return { ...state, nickname: content };
    }
    case 'start-connection': {
      return { ...state, connecting: true, error: '' };
    }
    case 'end-connection': {
      return { ...state, connecting: false };
    }
    case 'error': {
      const { error } = action.payload || {};
      return { ...state, error };
    }
  }
  return state;
};
