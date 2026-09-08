import { tokenStorage } from '@state/storage';
import { appAxios } from './apiInterceptors';
import { getMessaging } from '@react-native-firebase/messaging';

export const syncFcmToken = async () => {
  try {
    const token = await getMessaging().getToken();

    console.log('FCM Token:', token);

    await saveFcmToken(token);

    return token;
  } catch (error) {
    console.log('Error syncing FCM token:', error);
  }
};

export const saveFcmToken = async (token: string) => {
  try {
    await appAxios.post('/save-token', {
      fcmToken: token,
    });
    console.log('fcm token saved');
    tokenStorage.set('fcmToken', token);
  } catch (error) {
    console.log('Error while saving fcm token', error);
  }
};
