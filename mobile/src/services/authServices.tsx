import axios from 'axios';
import { BASE_URL } from './config';
import { tokenStorage } from '@state/storage';
import { useAuthStore } from '@state/authStore';
import { resetAndNavigate } from '@utils/NavigationUtils';
import { appAxios } from './apiInterceptors';

export const customerLogin = async (phone: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/customer/login`, {
      phone,
    });
    console.log('customer login response: ', response);
    const { accessToken, refreshToken, customer } = response.data;
    tokenStorage.set('accessToken', accessToken);
    tokenStorage.set('refreshToken', refreshToken);
    const { setUser } = useAuthStore.getState();
    setUser(customer);
  } catch (error) {
    console.log('customer login error: ', error);
    throw error;
  }
};

export const deliveryLogin = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/delivery/login`, {
      email,
      password,
    });
    console.log('delivery partner login response: ', response);
    const { accessToken, refreshToken, deliveryPartner } = response.data;
    tokenStorage.set('accessToken', accessToken);
    tokenStorage.set('refreshToken', refreshToken);
    const { setUser } = useAuthStore.getState();
    setUser(deliveryPartner);
  } catch (error) {
    console.log('delivery partner login error: ', error);
  }
};

export const refreshToken = async () => {
  try {
    const refreshToken = tokenStorage.getString('refreshToken');
    const response = await axios.post(`${BASE_URL}/refresh-token`, {
      refreshToken,
    });

    const newAccessToken = response.data.accessToken;
    const newRefreshToken = response.data.refreshToken;

    tokenStorage.set('accessToken', newAccessToken);
    tokenStorage.set('refreshToken', newRefreshToken);
    return newAccessToken;
  } catch (error) {
    console.log('Refresh token error: ', error);
    tokenStorage.clearAll();
    resetAndNavigate('CustomerLogin');
  }
};

export const refetchUser = async (setuser: any) => {
  try {
    const response = await appAxios.get('/user');
    setuser(response.data.user);
  } catch (error) {
    console.log('refetchUser error', error);
  }
};

export const updateUserLocation = async (data: any, setuser: any) => {
  try {
    const response = await appAxios.patch('/user', data);
    refetchUser(setuser);
  } catch (error) {
    console.log('update user location error', error);
  }
};
