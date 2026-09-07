import {
  AuthorizationStatus,
  getMessaging,
} from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import {
  requestNotifications,
  RESULTS,
  PermissionStatus,
  checkNotifications,
} from 'react-native-permissions';
import { saveFcmToken } from './notification.services';

export const isIos = () => Platform.OS === 'ios';
export const isAndroid = () => Platform.OS === 'android';
export const getPlatFormVersion = () => Number(Platform.Version);

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
  let token;
  if (isIos()) {
    token = await getMessaging().getAPNSToken();
  } else {
    token = await getMessaging().getToken();
  }
  await saveFcmToken(token as string);

  getMessaging().onTokenRefresh(async token => {
    await saveFcmToken(token);
  });
};
