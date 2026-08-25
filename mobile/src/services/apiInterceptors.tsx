import axios from 'axios';
import { BASE_URL } from './config';
import { refreshToken } from './authServices';
import { Alert } from 'react-native';
import { tokenStorage } from '@state/storage';

export const appAxios = axios.create({
  baseURL: BASE_URL,
});

appAxios.interceptors.request.use(async config => {
  const accessToken = tokenStorage.getString('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

appAxios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response && error.response.status === 401) {
      try {
        const newAccessToken = await refreshToken();
        if (newAccessToken) {
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(error.config);
        }
      } catch (error) {
        console.log('Error refreshing token', error);
      }
    }

    if (error.response && error.response.status != 401) {
      const errorMsg = error.response.data.message || 'Somwthing went wrong';
      Alert.alert(errorMsg);
      console.log(errorMsg);
    }

    return Promise.resolve(error);
  },
);
