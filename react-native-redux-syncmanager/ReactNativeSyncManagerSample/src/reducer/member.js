
import Action from "../action/member";

const _initialState = {
	members: []
};

export const reducer = (state = _initialState, action) => {
	const newState = { ...state };
	switch(action.type) {
		case Action.Type.MEMBER_INIT: {
			newState.members = action.payload.members;
			break;
		}
		case Action.Type.MEMBER_UPDATE: {
			newState.members = [ ...action.payload.members ];
			break;
		}
	}
	return newState;
};