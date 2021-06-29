
const Action = {
	Type: {
		USER_FETCH: 'user-fetch'
	}
};
Action.fetchUsers = users => {
	return {
		type: Action.Type.USER_FETCH,
		payload: { users }
	};
};

export default Action;