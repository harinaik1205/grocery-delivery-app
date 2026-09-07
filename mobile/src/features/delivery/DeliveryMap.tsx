import {
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors, Fonts } from '@utils/Constants';

import { useAuthStore } from '@state/authStore';
import {
  confirmOrder,
  getOrderById,
  sendLiveOrderUpdates,
} from '@services/orderServices';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomText from '@components/ui/CustomText';
import LiveHeader from '@features/map/LiveHeader';
import LiveMap from '@features/map/LiveMap';
import DeliveryDetails from '@features/map/DeliveryDetails';
import OrderSummary from '@features/map/OrderSummary';
import { useRoute } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import CustomButton from '@components/ui/CustomButton';
import { hocStyles } from '@styles/GlobalStyles';

const DeliveryMap = () => {
  const route = useRoute();
  const user = useAuthStore(state => state.user);
  const [orderData, setOrderData] = useState<any>(null);
  const [myLocation, setMyLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const orderDetails = route?.params;

  //   console.log('----------');
  //   console.log(orderData);
  //   console.log('----------');

  const { currentOrder, setCurrentOrder } = useAuthStore();

  const fetchOrderDetails = async () => {
    const data = await getOrderById(route?.params?._id);
    setCurrentOrder(data);
    setOrderData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  useEffect(() => {
    async function sendLiveUpdates() {
      if (
        orderData?.deliveryPartner?._id === user?._id &&
        orderData?.status != 'delivered' &&
        orderData?.status != 'cancelled'
      ) {
        await sendLiveOrderUpdates(
          orderData?._id,
          myLocation,
          orderData?.status,
        );
        fetchOrderDetails();
      }
    }
    sendLiveUpdates();
  }, [myLocation]);

  useEffect(() => {
    console.log('location watch');

    // Geolocation.requestAuthorization();
    const watchId = Geolocation.watchPosition(
      async position => {
        const { latitude, longitude } = position.coords;
        console.log({ latitude, longitude });
        setMyLocation({ latitude, longitude });
      },
      err => console.log('Error Fetching GeoLocation', err),
      {
        enableHighAccuracy: true,
        distanceFilter: 10,
      },
    );

    return () => Geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'App needs access to your location',
            buttonPositive: 'OK',
          },
        );
        granted === PermissionsAndroid.RESULTS.GRANTED;

        if (!granted) {
          Alert.alert('Location permission is required.');
        }
      }
      return true; // iOS handled by requestAuthorization
    };
    requestLocationPermission();
  }, []);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setMyLocation({ latitude, longitude });
      },
      error => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 15000,
      },
    );
  }, []);

  console.log('mylo', myLocation);
  const acceptOrder = async () => {
    console.log('myLocation', myLocation);
    const data = await confirmOrder(orderData?._id, myLocation);
    if (data) {
      setCurrentOrder(data);
      setOrderData(data);

      Alert.alert('Order Accepted, Grab your package', data?.status);
    } else {
      Alert.alert('There was an error');
    }
    fetchOrderDetails();
  };

  const orderPickedUp = async () => {
    const data = await sendLiveOrderUpdates(
      orderData?._id,
      myLocation,
      'arriving',
    );
    if (data) {
      setCurrentOrder(data);
      setOrderData(data);
      Alert.alert("Let's deliver it as soon as possible");
    } else {
      Alert.alert('There was an error');
    }
    fetchOrderDetails();
  };

  const orderDelivered = async () => {
    const data = await sendLiveOrderUpdates(
      orderData?._id,
      myLocation,
      'delivered',
    );
    if (data) {
      setCurrentOrder(null);
      //   setOrderData(null)
      Alert.alert('Wohoo! You made it🥳');
    } else {
      Alert.alert('There was an error');
    }
    fetchOrderDetails();
  };

  let msg = 'Start this order';
  let time = 'Arriving in 10 minutes';

  if (
    orderData?.status === 'confirmed' ||
    orderData?.deliveryPartner?._id === user?._id
  ) {
    msg = 'Grab your order';
    time = 'Arriving in 8 minutes';
  } else if (
    orderData?.status === 'arriving' ||
    orderData?.deliveryPartner?._id === user?._id
  ) {
    msg = 'Complete your order';
    time = 'Arrving in 6 miutes';
  } else if (
    orderData?.status === 'delivered' ||
    orderData?.deliveryPartner?._id === user?._id
  ) {
    msg = 'Your milestone';
    time = 'Fastest Delivery';
  } else if (
    orderData?.status != 'available' ||
    orderData?.deliveryPartner?._id === user?._id
  ) {
    msg = 'You missed it';
  }

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator color={'#000'} size={'small'} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LiveHeader
        type="Customer"
        title={msg}
        secondTitle="Delivery in 10 mins"
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {orderData?.deliveryLocation && orderData?.pickupLocation && (
          <LiveMap
            deliveryPersonLocation={
              orderData?.deliveryPersonLocation || myLocation
            }
            deliveryLocation={orderData?.deliveryLocation || null}
            hasAccepted={
              orderData?.deliveryPartner?._id === user?._id &&
              orderData?.status === 'confirmed'
            }
            hasPickedUp={orderData?.status === 'arriving'}
            pickupLocation={orderData?.pickupLocation}
          />
        )}

        {/* <View style={styles.flexRow}>
          <View style={styles.iconContainer}>
            <Icon
              name={orderData?.deliveryPartner ? 'phone' : 'shopping'}
              color={Colors.disabled}
              size={RFValue(20)}
            />
          </View>

          <View style={{ width: '82%' }}>
            <CustomText
              numberOfLines={1}
              variant="h7"
              fontFamily={Fonts.SemiBold}
            >
              {currentOrder?.deliveryPartner?.name ||
                'We will soon assign delivery partner'}
            </CustomText>

            {currentOrder?.deliveryPartner && (
              <CustomText variant="h7" fontFamily={Fonts.Medium}>
                {currentOrder?.deliveryPartner?.phone}
              </CustomText>
            )}

            <CustomText variant="h9" fontFamily={Fonts.Medium}>
              {currentOrder?.deliveryPartner
                ? 'For Delivery instructions you can contact here'
                : msg}
            </CustomText>
          </View>
        </View> */}

        <DeliveryDetails details={orderData?.customer} />
        <OrderSummary order={orderData} />
        <CustomText
          fontFamily={Fonts.SemiBold}
          variant="h6"
          style={{ opacity: 0.6, marginTop: 20 }}
        >
          Hari Naik & LocalCart Grocery delivery app
        </CustomText>
      </ScrollView>

      {orderData?.status != 'delivered' && orderData?.status != 'cancelled' && (
        <View style={[hocStyles.cartContainer, { padding: 10 }]}>
          {orderData?.status === 'available' && (
            <CustomButton
              disabled={false}
              title="Accept Order"
              onPress={acceptOrder}
              loading={false}
            />
          )}
        </View>
      )}

      {orderData?.status === 'confirmed' &&
        orderData?.deliveryPartner?._id === user?._id && (
          <CustomButton
            disabled={false}
            title="Order Picked up"
            onPress={orderPickedUp}
            loading={false}
          />
        )}
      {orderData?.status === 'arriving' &&
        orderData?.deliveryPartner?._id === user?._id && (
          <CustomButton
            disabled={false}
            title="Delivered"
            onPress={orderDelivered}
            loading={false}
          />
        )}
    </View>
  );
};

export default DeliveryMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  scrollContent: {
    paddingBottom: 150,
    backgroundColor: Colors.backgroundSecondary,
    padding: 15,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    borderRadius: 15,
    marginTop: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderBottomWidth: 0.7,
    borderColor: Colors.border,
  },
  iconContainer: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 100,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
