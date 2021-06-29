
const Action = {
	Type: {
		MEMBER_INIT: 'member-init',
		MEMBER_UPDATE: 'member-update'
	}
};
Action.initMembers = members => {
	return {
		type: Action.Type.MEMBER_INIT,
		payload: {
			members
		}
	};
};
Action.updateMembers = members => {
	return {
		type: Action.Type.MEMBER_UPDATE,
		payload: {
			members
		}
	};
};

export default Action;