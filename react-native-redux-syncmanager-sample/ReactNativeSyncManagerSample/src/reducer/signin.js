
import Action from "../action/signin";

const _initialState = {
	authenticating: false,
	user: null,
	err: null,
	typedUserId: '',
	typedNickname: ''
};

export const reducer = (state = _initialState, action) => {
	const newState = { ...state };
	switch(action.type) {
		case Action.Type.AUTHENTICATE: {
			newState.authenticating = true;
			break;
		}
		case Action.Type.SIGNIN_SUCCESS: {
			newState.authenticating = false;
			newState.user = action.payload.user;
			newState.err = null;
			break;
		}
		case Action.Type.SIGNIN_FAILED: {
			newState.authenticating = false;
			newState.user = null;
			newState.err = action.payload.err;
			break;
		}
	}
	return newState;
};