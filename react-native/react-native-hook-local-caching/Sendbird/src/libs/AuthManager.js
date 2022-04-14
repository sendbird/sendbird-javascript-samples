import AsyncStorage from '@react-native-async-storage/async-storage';

export default class AuthManager {
  static SAVED_USER = 'SAVED_USER';

  static async getUserForAutoSignIn() {
    const user = await AsyncStorage.getItem(AuthManager.SAVED_USER);
    if (user) return JSON.parse(user);
    else return null;
  }

  static signIn(user) {
    return AsyncStorage.setItem(AuthManager.SAVED_USER, JSON.stringify(user));
  }

  static signOut() {
    return AsyncStorage.removeItem(AuthManager.SAVED_USER);
  }
}
