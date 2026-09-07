import {
  getMessaging,
  getToken,
  registerDeviceForRemoteMessages,
} from '@react-native-firebase/messaging';
import { tokenStorage } from '@state/storage';
import { PermissionsAndroid } from 'react-native';
import { appAxios } from './apiInterceptors';
import notifee from '@notifee/react-native';
import { Colors } from '@utils/Constants';

export const requestNotifications = () => {
  const status = PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );
  console.log('notification status', status);
  return status;
};

export const saveFcmToken = async () => {
  try {
    const messagingInstance = getMessaging();
    await registerDeviceForRemoteMessages(messagingInstance);
    const fcmToken = await getToken(messagingInstance);
    const response = await appAxios.post('/save-token', {
      fcmToken,
    });
    console.log('fcmToken response', response);
    tokenStorage.set('fcmToken', fcmToken);
  } catch (error) {
    console.log('fcm token error: ', error);
    throw error;
  }
};

export const createChannel = async () => {
  try {
    await notifee.requestPermission();
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default channel',
    });
    return channelId;
  } catch (error) {
    console.log('error while creating channel', error);
  }
};

export const displayNotification = async (remoteMessage: any) => {
  console.log('remoteMsg', remoteMessage);
  try {
    const channelId = await createChannel();

    await notifee.displayNotification({
      title: remoteMessage?.notification?.title,
      body: remoteMessage?.notification?.body,
      android: {
        channelId,
        pressAction: {
          id: 'default',
        },

        color: Colors.primary,
      },
    });
  } catch (error) {}
};
