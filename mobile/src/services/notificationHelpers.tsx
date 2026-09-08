import {
  AuthorizationStatus,
  getMessaging,
} from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';
import {
  requestNotifications,
  RESULTS,
  PermissionStatus,
  checkNotifications,
} from 'react-native-permissions';
import { saveFcmToken } from './notification.services';
import notifee, {
  AndroidImportance,
  EventType,
  Notification,
} from '@notifee/react-native';
import { navigate } from '@utils/NavigationUtils';

export const isIos = () => Platform.OS === 'ios';
export const isAndroid = () => Platform.OS === 'android';
export const getPlatFormVersion = () => Number(Platform.Version);

export const channelId = 'orderStatus';
export const channelName = 'Order Status';

export const showForeGroundNotification = (message: any) => {
  if (!message || !message?.notification) return;

  const { title, body } = message.notification;
  const { type } = message?.data;

  const obj: Notification = {
    title,
    body,
    android: {
      channelId,
      importance: AndroidImportance.HIGH,
      pressAction: {
        id: 'default',
      },
    },
  };
  if (type) {
    obj.data = { type };
  }

  notifee.displayNotification(obj);
};

export const checkNotificationPermissionStatus = async (): Promise<boolean> => {
  //   return new Promise(async (resolve, reject) => {
  //     await getMessaging()
  //       .hasPermission()
  //       .then(enabled => {
  //         const granted =
  //           enabled === AuthorizationStatus.AUTHORIZED ||
  //           enabled === AuthorizationStatus.PROVISIONAL;
  //         return resolve(granted);
  //       })
  //       .catch(error => reject(error));
  //   });

  const { status } = await checkNotifications();
  return status === RESULTS.GRANTED || status === RESULTS.LIMITED;
};

export const requestNotificationPermissions = (
  onGranted?: () => void,
  onBlocked?: () => void,
) => {
  requestNotifications(['alert', 'badge', 'sound']).then(({ status }) => {
    if (status === RESULTS.GRANTED) {
      onGranted && onGranted();
    } else {
      onBlocked && onBlocked();
    }
  });
};

export const setNotificationHandler = async () => {
  const granted = await checkNotificationPermissionStatus();
  if (!granted) return;
  //for ios
  await getMessaging().registerDeviceForRemoteMessages();

  const token = await getMessaging().getToken();

  await saveFcmToken(token as string);

  const unsubscribeTokenRefresh = getMessaging().onTokenRefresh(async token => {
    console.log('Saving new fcm token');
    await saveFcmToken(token);
  });

  //create channel for android
  notifee.isChannelCreated(channelId).then(isCreated => {
    if (!isCreated) {
      notifee.createChannel({
        id: channelId,
        name: channelName,
        sound: 'default',
      });
    }
  });

  //Handle Local notification click on foreground state

  const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
    switch (type) {
      case EventType.DISMISSED:
        Alert.alert('user dismissed notification', detail?.notification?.title);
        break;
      case EventType.PRESS:
        const { type } = (detail?.notification?.data ?? {}) as {
          type?: string;
        };
        switch (type) {
          case 'orderStatus':
            navigate('LiveTracking');
            break;

          default:
            break;
        }
      default:
        break;
    }
  });

  //foreground state message handler
  const unsubscribeMessage = getMessaging().onMessage(remoteMessage => {
    console.log('A new FCM message arrived in foreground!', remoteMessage);
    showForeGroundNotification(remoteMessage);
  });

  //Handle the click of notification in case of app background
  // background state notification message handler
  const unsubscribeNotificationOpened = getMessaging().onNotificationOpenedApp(
    remoteMessage => {
      if (remoteMessage?.data) {
        const type = remoteMessage?.data?.type;
        switch (type) {
          case 'orderStatus':
            navigate('LiveTracking');
            break;
          default:
            break;
        }
      }
    },
  );
  return () => {
    unsubscribeTokenRefresh();
    unsubscribeMessage();
    unsubscribeNotificationOpened();
    unsubscribeNotifee();
  };
};
