import Action from "../action/chat";
import {
	findMessageIndex,
	getMessageIndex
} from "../utils";

const _initialState = {
	channel: null,
	messages: [],
	inputMode: 'chat'
};

export const reducer = (state = _initialState, action) => {
	const newState = { ...state };
	switch(action.type) {
		case Action.Type.MESSAGE_SELECT: {
			newState.messages = [ ...newState.messages ];
			for(let i = 0; i < newState.messages.length; i++) {
				newState.messages[i]._selected = newState.messages[i].messageId === action.payload.message.messageId;
			}
			break;
		}
		case Action.Type.MESSAGE_DESELECT_ALL: {
			newState.messages = [ ...newState.messages ];
			for(let i = 0; i < newState.messages.length; i++) {
				newState.messages[i]._selected = false;
			}
			break;
		}
		case Action.Type.MESSAGE_ADD: {
			newState.messages = [ ...newState.messages ];
			for(let i = 0; i < action.payload.messages.length; i++) {
				const message = action.payload.messages[i];
				const index = findMessageIndex(message, newState.messages);
				if(index >= 0) {
					newState.messages.splice(index, 0, message);
					if(index > 0) {
						newState.messages[index - 1]._isPreviousMessageSentBySameUser
							= (newState.messages[index - 1].sender
								&& newState.messages[index].sender
								&& newState.messages[index - 1].sender.userId === newState.messages[index].sender.userId);
					}
					if(index < newState.messages.length - 1) {
						newState.messages[index]._isPreviousMessageSentBySameUser
							= (newState.messages[index].sender
								&& newState.messages[index + 1].sender
								&& newState.messages[index].sender.userId === newState.messages[index + 1].sender.userId);
					}
				}
			}
			break;
		}
		case Action.Type.MESSAGE_UPDATE: {
			newState.messages = [ ...newState.messages ];
			for(let i = 0; i < action.payload.messages.length; i++) {
				const message = action.payload.messages[i];
				const index = getMessageIndex(message, newState.messages);
				if(index >= 0) {
					message._isPreviousMessageSentBySameUser = newState.messages[index]._isPreviousMessageSentBySameUser;
					newState.messages[index] = message;
				}
			}
			break;
		}
		case Action.Type.MESSAGE_REMOVE: {
			newState.messages = [ ...newState.messages ];
			for(let i = 0; i < action.payload.messages.length; i++) {
				const message = action.payload.messages[i];
				const index = getMessageIndex(message, newState.messages);
				if(index >= 0) {
					newState.messages.splice(index, 1);
					if(index < newState.messages.length - 1) {
						newState.messages[index]._isPreviousMessageSentBySameUser
							= (newState.messages[index + 1].sender
								&& newState.messages[index].sender
								&& newState.messages[index + 1].sender.userId === newState.messages[index].sender.userId);
					}
				}
			}
			break;
		}
		case Action.Type.MESSAGE_CLEAR: {
			newState.messages = [];
			break;
		}
	}
	return newState;
};