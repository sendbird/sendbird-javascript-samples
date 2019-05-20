
const Action = {
	Type: {
		MESSAGE_ADD: 'message-add',
		MESSAGE_UPDATE: 'message-update',
		MESSAGE_REMOVE: 'message-remove',
		MESSAGE_CLEAR: 'message-clear'
	}
};
Action.addMessages = messages => {
	return {
		type: Action.Type.MESSAGE_ADD,
		payload: {
			messages
		}
	};
};
Action.updateMessages = messages => {
	return {
		type: Action.Type.MESSAGE_UPDATE,
		payload: {
			messages
		}
	};
}
Action.removeMessages = messages => {
	return {
		type: Action.Type.MESSAGE_REMOVE,
		payload: {
			messages
		}
	};
};
Action.clearMessages = () => {
	return {
		type: Action.Type.MESSAGE_CLEAR
	}
};

export default Action;