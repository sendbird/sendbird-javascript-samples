
import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		borderBottomColor: '#eee'
	},
	titleContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginLeft: 10
  },
  memberCount: {
    backgroundColor: '#e3e3e3',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 6,
    paddingRight: 6,
    marginLeft: 6,
    borderRadius: 4,
    textAlign:'center'
	},
	title: {
		fontWeight: '500',
		fontSize: 16
	},
  titleText: {
    fontSize: 10, 
    color: '#878D99'
	},
	subtitle: {
		fontWeight: '300',
		fontSize: 11
	},
  unreadCount: {
    width: 18,
    height: 18,
    padding: 3,
    backgroundColor: '#e03131',
    borderRadius: 9,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  unreadCountText: {
    fontSize: 8,
    fontWeight: '500',
    color: '#fff'
  },
  lastMessage: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginLeft: 10
  },
  lastMessageText: {
    fontSize: 12,
    color: '#878D99',
    marginTop: 3,
  }
});