
const Action = {
	Type: {
		MESSAGE_SELECT: 'message-select',
		MESSAGE_DESELECT_ALL: 'message-deselect-all',
		MESSAGE_ADD: 'message-add',
		MESSAGE_UPDATE: 'message-update',
		MESSAGE_REMOVE: 'message-remove',
		MESSAGE_CLEAR: 'message-clear'
	}
};
Action.selectMessage = message => {
	return {
		type: Action.Type.MESSAGE_SELECT,
		payload: {
			message
		}
	};
};
Action.deselectAllMessages = () => {
	return {
		type: Action.Type.MESSAGE_DESELECT_ALL
	};
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