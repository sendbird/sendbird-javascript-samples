
import { combineReducers } from 'redux';
import { reducer as main } from './main';
import { reducer as chat } from './chat';
import { reducer as invite } from './invite';
import { reducer as member } from './member';
import { reducer as signin } from './signin';

export default combineReducers({
	main,
	chat,
	invite,
	member,
	signin
});