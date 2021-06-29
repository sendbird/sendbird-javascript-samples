import Action from "../action/invite";

const _initialState = {
	users: [],
	err: null
};

export const reducer = (state = _initialState, action) => {
	const newState = { ...state };
	switch(action.type) {
		case Action.Type.USER_FETCH: {
			newState.users = newState.users.concat(action.payload.users);
			break;
		}
	}
	return newState;
};