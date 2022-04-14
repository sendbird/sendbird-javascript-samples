export const profileReducer = (state, action) => {
  switch (action.type) {
    case 'edit-nickname': {
      const { content } = action.payload || {};
      return { ...state, nickname: content };
    }
    case 'start-update': {
      return { ...state, updating: true, error: '' };
    }
    case 'end-update': {
      return { ...state, updating: false };
    }
    case 'error': {
      const { error } = action.payload || {};
      return { ...state, error };
    }
  }
  return { ...state };
};
