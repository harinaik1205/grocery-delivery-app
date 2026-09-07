import { tokenStorage } from '@state/storage';
import { appAxios } from './apiInterceptors';

export const saveFcmToken = async (token: string) => {
  try {
    await appAxios.post('/save-token', {
      fcmToken: token,
    });
    tokenStorage.set('fcmToken', token);
  } catch (error) {
    console.log('Error while saving fcm token', error);
  }
};
