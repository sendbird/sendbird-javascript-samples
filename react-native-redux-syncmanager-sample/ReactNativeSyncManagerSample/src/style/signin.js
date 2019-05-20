
import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
	container: {
    backgroundColor: '#fff', 
    flex: 1
  },
  logo: {
    marginTop: 35,
    marginBottom: 5,
    alignItems: 'center'
	},
	logoImage: {
		width: 150,
		height: 150
	},
  logoTitleText: {
    color: '#7d62d9', 
    fontSize: 30, 
    fontWeight: '600'
  },
  logoSubtitleText: {
    color: '#7d62d9', 
    fontSize: 13, 
    fontWeight: '500'
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    backgroundColor:'#fff',
    paddingHorizontal: 8,
    marginTop: 8,
    marginHorizontal: 20
  },
  input: {
    fontSize: 13,
    borderWidth: 0
  },
  buttonContainer: {
    marginTop: 20,
    marginHorizontal: 28
	},
	button: {
    height: 50,
    borderRadius: 6,
		backgroundColor: '#6e5baa'
	},
  errorText: {
    alignSelf: 'center', 
    fontSize: 14, 
    color: '#e03131',
    marginTop: 20
  }
});