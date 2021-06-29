
import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
	headerLeftContainer: {
		flexDirection: "row",
		paddingLeft: 10
	},
	headerLeftItemContainer: {
		marginLeft: 0,
		marginRight: 0
	},
	headerLeftItem: {
		backgroundColor: 'transparent',
		paddingHorizontal: 10
	},
	headerRightContainer: {
		flexDirection: "row",
		paddingRight: 10
	},
	headerRightItemContainer: {
		marginLeft: 0,
		marginRight: 0
	},
	headerRightItem: {
		backgroundColor: 'transparent',
		paddingHorizontal: 10
	},
	container: {
		flex: 1,
		backgroundColor: '#f3f3f3'
	},
	messageListViewContainer: {
		flex: 24,
		padding: 0,
		margin: 0,
    transform: [{ scaleY: -1 }]
  },
  messageInputContainer: {		
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
		backgroundColor:'#fff',
		paddingHorizontal: 6
	},
	formContainer: {
		flex: 1
	},
  formInputContainer: {
		borderBottomColor: 'transparent'
	},
	formInput: {
		color: '#212529',
		maxHeight: 84
	},
	uploadContainer: {
		flexGrow: 0,
		flexShrink: 0,
		flexBasis: 44
	},
	upload: {
		borderRadius: 6,
		backgroundColor: 'transparent'
	},
	sendContainer: {
		flexGrow: 0,
		flexShrink: 0,
		flexBasis: 44
	},
	send: {
		borderRadius: 6,
		backgroundColor: 'transparent'
	}
});