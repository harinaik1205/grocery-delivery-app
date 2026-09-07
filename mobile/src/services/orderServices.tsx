import { appAxios } from './apiInterceptors';
import { BASE_URL, BRANCH_ID } from './config';

export const createOrder = async (items: any, totalPrice: number) => {
  try {
    const response = await appAxios.post('/order', {
      items,
      branch: BRANCH_ID,
      totalPrice: totalPrice,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getOrderById = async (id: string) => {
  try {
    const response = await appAxios.get(`/order/${id}`);
    return response.data;
  } catch (error) {
    console.log('Fetch Order Error', error);
    return null;
  }
};

export const fetchCustomerOrders = async (userId: string) => {
  try {
    const response = await appAxios.get(`/order?customerId=${userId}`);
    return response.data;
  } catch (error) {
    console.log('Error while fetching order', error);
    return null;
  }
};

export const fetchOrders = async (
  status: string,
  userId: string,
  branchId: string,
) => {
  let uri =
    status === 'available'
      ? `/order?status=${status}&branchId=${branchId}`
      : `/order?branchId=${branchId}&deliveryPartnerId=${userId}&status=${status}`;

  try {
    const response = await appAxios.get(uri);
    return response.data;
  } catch (error) {
    console.log('Error while fetching orders', error);
    return null;
  }
};

export const sendLiveOrderUpdates = async (
  id: string,
  location: any,
  status: any,
) => {
  try {
    const response = await appAxios.patch(`/order/${id}/status`, {
      deliveryPersonLocation: location,
      status,
    });

    return response.data;
  } catch (error) {
    console.log('sendLiveOrderUpdates error', error);
    return null;
  }
};

export const confirmOrder = async (id: string, location: any) => {
  console.log('confimr order called', id, location);
  try {
    const response = await appAxios.post(`/order/${id}/confirm`, {
      deliveryPersonLocation: location,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log('confirmOrder error', error);
    return null;
  }
};
