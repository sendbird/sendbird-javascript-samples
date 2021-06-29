
import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f3f3f3'
	},
	actionButtonShadow: {
		shadowColor: "#333",
		shadowOpacity: 0.6,
		shadowOffset: {
			height: 1,
			width: 1
		}
	},
	actionButtonIcon: {
		fontSize: 20,
    height: 22,
    color: 'white'
	},
	signoutButtonContainer: {
		marginLeft: 0,
		marginRight: 10
	},
	signoutButton: {
		backgroundColor: 'transparent',
		paddingHorizontal: 10
	}
});