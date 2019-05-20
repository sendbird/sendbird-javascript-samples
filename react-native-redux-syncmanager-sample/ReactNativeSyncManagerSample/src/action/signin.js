
const Action = {
	Type: {
		AUTHENTICATE: 'authenticate',
		SIGNIN_SUCCESS: 'signin-success',
		SIGNIN_FAILED: 'signin-failed'
	}
};
Action.authenticate = () => {
	return {
		type: Action.Type.AUTHENTICATE
	};
};
Action.succeed = user => {
	return {
		type: Action.Type.SIGNIN_SUCCESS,
		payload: { user }
	};
};
Action.fail = err => {
	return {
		type: Action.Type.SIGNIN_FAILED,
		payload: { err }
	};
};

export default Action;