import messaging from '@react-native-firebase/messaging';
import AppHelper, { Global } from '@utils/appHelper';
import Firestore from './firestore';

class CCloudMessaging {
  private static _instance: CCloudMessaging;

  private constructor() {
    // ...
  }

  public static get Instance(): CCloudMessaging {
    if (!this._instance) {
      this._instance = new this();
    }
    return CCloudMessaging._instance;
  }

  requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED
      || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      const fcmToken = await messaging().getToken();
      console.log('fcmToken :>>', fcmToken);
      Global.fcmToken = fcmToken;

      Firestore.add('NotificationTokens', { id: Global.deviceInfo.uniqueId, fcmToken });
    }
  };

  messageListener = async () => {
    // Foreground
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      AppHelper.showNotificationMessage(remoteMessage);
    });
    // Background & Quit
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('remoteMessage :>> ', remoteMessage);
    });
    return unsubscribe;
  };
}

const CloudMessaging = CCloudMessaging.Instance;
export default CloudMessaging;
