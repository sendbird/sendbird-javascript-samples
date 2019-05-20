import Action from "../action/main";
import {
	findChannelIndex,
	getChannelIndex
} from "../utils";

const _initialState = {
	channels: []
};

export const reducer = (state = _initialState, action) => {
	const newState = { ...state };
	switch(action.type) {
		case Action.Type.CHANNEL_ADD: {
			newState.channels = [ ...newState.channels ];
			for(let i = 0; i < action.payload.channels.length; i++) {
				const channel = action.payload.channels[i];
				const index = findChannelIndex(channel, newState.channels);
				if(index >= 0) {
					newState.channels.splice(index, 0, channel);
				}
			}
			break;
		}
		case Action.Type.CHANNEL_UPDATE: {
			newState.channels = [ ...newState.channels ];
			for(let i = 0; i < action.payload.channels.length; i++) {
				const channel = action.payload.channels[i];
				const index = getChannelIndex(channel, newState.channels);
				if(index >= 0) {
					newState.channels[index] = channel;
				}
			}
			break;
		}
		case Action.Type.CHANNEL_REMOVE: {
			newState.channels = [ ...newState.channels ];
			for(let i = 0; i < action.payload.channels.length; i++) {
				const channel = action.payload.channels[i];
				const index = getChannelIndex(channel, newState.channels);
				if(index >= 0) {
					newState.channels.splice(index, 1);
				}
			}
			break;
		}
		case Action.Type.CHANNEL_MOVE: {
			newState.channels = [ ...newState.channels ];
			for(let i = 0; i < action.payload.channels.length; i++) {
				const channel = action.payload.channels[i];
				const from = getChannelIndex(channel, newState.channels);
				if(from >= 0) {
					newState.channels.splice(from, 1);
				}
				const to = findChannelIndex(channel, newState.channels);
				newState.channels.splice(to, 0, channel);
			}
			break;
		}
		case Action.Type.CHANNEL_CLEAR: {
			newState.channels = [];
			break;
		}
	}
	return newState;
};