
const Action = {
	Type: {
		CHANNEL_ADD: 'channel-add',
		CHANNEL_UPDATE: 'channel-update',
		CHANNEL_REMOVE: 'channel-remove',
		CHANNEL_MOVE: 'channel-move',
		CHANNEL_CLEAR: 'channel-clear'
	}
};
Action.addChannels = channels => {
	return {
		type: Action.Type.CHANNEL_ADD,
		payload: {
			channels
		}
	};
};
Action.updateChannels = channels => {
	return {
		type: Action.Type.CHANNEL_UPDATE,
		payload: {
			channels
		}
	};
}
Action.removeChannels = channels => {
	return {
		type: Action.Type.CHANNEL_REMOVE,
		payload: {
			channels
		}
	};
};
Action.moveChannels = channels => {
	return {
		type: Action.Type.CHANNEL_MOVE,
		payload: {
			channels
		}
	}
};
Action.clearChannels = () => {
	return {
		type: Action.Type.CHANNEL_CLEAR
	}
};

export default Action;