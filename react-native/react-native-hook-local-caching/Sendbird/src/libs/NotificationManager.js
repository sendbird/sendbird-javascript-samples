import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

export default class NotificationManager {
  static async hasPermission() {
    const authorizationStatus = await messaging().hasPermission();
    return (
      authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  }
  static async requestPermission() {
    const authorizationStatus = await messaging().requestPermission();
    return (
      authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  }
  static async checkAndRequestPermission() {
    if (await NotificationManager.hasPermission()) return true;
    else return NotificationManager.requestPermission();
  }
  static getAPNSToken() {
    return messaging().getAPNSToken();
  }
  static getFCMToken() {
    return messaging().getToken();
  }

  static async setPushToken(sendbirdInstance) {
    try {
      const authorized = await NotificationManager.checkAndRequestPermission();
      if (authorized) {
        if (Platform.OS === 'ios') {
          const token = await NotificationManager.getAPNSToken();
          token && sendbirdInstance.registerAPNSPushTokenForCurrentUser(token);
        }

        if (Platform.OS === 'android') {
          const token = await NotificationManager.getFCMToken();
          token && sendbirdInstance.registerGCMPushTokenForCurrentUser(token);
        }
      }
    } catch (e) {
      console.warn('NotificationManager.setPushToken failure:', e.message);
    }
  }
  static async clearPushToken(sendbirdInstance) {
    try {
      const authorized = await NotificationManager.hasPermission();
      if (authorized) {
        if (Platform.OS === 'ios') {
          const token = await NotificationManager.getAPNSToken();
          token && sendbirdInstance.unregisterAPNSPushTokenForCurrentUser(token);
        }

        if (Platform.OS === 'android') {
          const token = await NotificationManager.getFCMToken();
          token && sendbirdInstance.unregisterGCMPushTokenForCurrentUser(token);
        }
      }
    } catch (e) {
      console.warn('NotificationManager.clearPushToken failure:', e.message);
    }
  }
}
