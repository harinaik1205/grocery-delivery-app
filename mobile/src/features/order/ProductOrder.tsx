import {
  Alert,
  Image,
  Platform,
  ScrollView,
  // Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { Colors, Fonts } from '@utils/Constants';
import CustomHeader from '@components/ui/CustomHeader';
import OrderList from './OrderList';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomText from '@components/ui/CustomText';
import { RFValue } from 'react-native-responsive-fontsize';
import { useCartStore } from '@state/cartStore';
import BillDetails from './BillDetails';
import { hocStyles } from '@styles/GlobalStyles';
import { useAuthStore } from '@state/authStore';
import ArrowButton from './ArrowButton';
import { createOrder } from '../../services/orderServices';
import { navigate } from '@utils/NavigationUtils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { downloadImage } from '@utils/utility';
import Share from 'react-native-share';

const ProductOrder = () => {
  const { getTotalPrice, cart, clearCart, getItemCount } = useCartStore();
  const { user, currentOrder, setCurrentOrder } = useAuthStore();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState<boolean>(false);

  const handlePlaceOrder = async () => {
    if (currentOrder !== null) {
      Alert.alert('Let your first order to be delivered');
      return;
    }

    setLoading(true);
    try {
      const formattedData = cart.map(item => ({
        id: item._id,
        item: item._id,
        count: item.count,
      }));

      if (formattedData.length === 0) {
        Alert.alert('Add any items to place order');
      }

      const data = await createOrder(formattedData, totalPrice);
      if (data !== null) {
        setCurrentOrder(data);
        clearCart();
        navigate('OrderSuccess', { ...data });
      } else {
        Alert.alert('Error while creating order');
      }
    } catch (error: any) {
      Alert.alert('Create Order Error', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = getTotalPrice();
  // const totalItems = getItemCount();

  const onShare = async () => {
    // Alert.alert('Share Cart', 'Do you want to share your cart with others?');

    try {
      const imageUrl = cart[0]?.item?.image;
      const { path, mime } = await downloadImage(imageUrl!, cart[0]?.item?._id);
      await Share.open({
        title: 'Cart',
        message: `Hi, check out my cart with ${cart.length} items and total price of ₹${totalPrice}. Please review and make the payment to place the order.\nhttps://grocery-delivery-app-deeplinking.vercel.app/share=cart/${cart[0]?.item?._id}\n`,
        url: Platform.OS === 'android' ? `file://${path}` : path,
        type: mime,
        subject: 'Cart',
      });
    } catch (error) {
      console.log('==============');
      console.log('==============');
      console.log('==============');
      console.log('Error while sharing', error);
      console.log('==============');
      console.log('==============');
      console.log('==============');
      Alert.alert('Error while sharing', JSON.stringify(error));
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* <CustomHeader title="Checkout" /> */}
      {/* header */}
      <View
        style={[
          styles.flexRowBetween,
          styles.headerContainer,
          { paddingTop: insets.top, borderRadius: 0 },
        ]}
      >
        <View style={styles.flexRow}>
          <View style={styles.iconContainer}>
            <Feather name="chevron-left" size={20} />
          </View>
          <CustomText variant="h6" fontFamily={Fonts.SemiBold}>
            Checkout
          </CustomText>
        </View>
        <View style={styles.flexRow}>
          <View style={styles.iconContainer}>
            <Feather name="search" size={20} />
          </View>
          <TouchableOpacity onPress={onShare} style={styles.iconContainer}>
            <Feather name="share" size={20} />
          </TouchableOpacity>
        </View>
      </View>
      {/* <Text>{JSON.stringify(cart[0].item?.image)}</Text> */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <OrderList />

        <View style={styles.flexRowBetween}>
          <View style={styles.flexRow}>
            <Image
              source={require('@assets/icons/coupon.png')}
              style={{ width: 25, height: 25 }}
            />
            <CustomText variant="h6" fontFamily={Fonts.SemiBold}>
              Use Coupons
            </CustomText>
          </View>
          <Icon name="chevron-right" size={RFValue(16)} color={Colors.text} />
        </View>

        <BillDetails totalPrice={totalPrice} />
        <View style={styles.flexRowBetween}>
          <View>
            <CustomText variant="h8" fontFamily={Fonts.SemiBold}>
              Cancellation Policy
            </CustomText>
            <CustomText
              style={styles.cancelText}
              variant="h9"
              fontFamily={Fonts.SemiBold}
            >
              Orders cannot be cancelled once packed for delivery, in case of
              unexpected delays, refund will be provided, if applicable
            </CustomText>
          </View>
        </View>
      </ScrollView>

      <View style={hocStyles.cartContainer}>
        <View style={styles.absoulteContainer}>
          <View style={styles.addressContainer}>
            <View style={styles.flexRow}>
              <Image
                source={require('@assets/icons/home.png')}
                style={{
                  width: 20,
                  height: 30,
                }}
              />
              <View style={{ width: '75%' }}>
                <CustomText variant="h8" fontFamily={Fonts.SemiBold}>
                  Delivering to Home
                </CustomText>
                <CustomText
                  variant="h9"
                  numberOfLines={2}
                  style={{ opacity: 0.6 }}
                >
                  {user?.address}
                </CustomText>
              </View>
            </View>
            <TouchableOpacity>
              <CustomText
                variant="h8"
                style={{
                  color: Colors.secondary,
                }}
                fontFamily={Fonts.SemiBold}
              >
                Change
              </CustomText>
            </TouchableOpacity>
          </View>

          <View style={styles.paymentGateway}>
            <View style={{ width: '30%' }}>
              <CustomText fonSize={RFValue(6)} fontFamily={Fonts.Regular}>
                💸 PAY USING
              </CustomText>
              <CustomText
                fontFamily={Fonts.Regular}
                variant="h9"
                style={{ marginTop: 2 }}
              >
                Cash on Delivery
              </CustomText>
            </View>

            <View style={{ width: '70%' }}>
              <ArrowButton
                loading={loading}
                price={totalPrice}
                title="place Order"
                onPress={handlePlaceOrder}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProductOrder;

const styles = StyleSheet.create({
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderColor: Colors.border,
    backgroundColor: '#fff',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    shadowColor: Colors.text,
    elevation: 2,
  },
  headerContainer: {
    padding: 10,
    backgroundColor: '#fff',
    shadowColor: Colors.text,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    elevation: 2,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    backgroundColor: Colors.backgroundSecondary,
    padding: 10,
    paddingBottom: 250,
  },
  flexRowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 15,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cancelText: {
    marginTop: 4,
    opacity: 0.6,
  },
  paymentGateway: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 14,
    paddingTop: 10,
  },
  addressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderBottomWidth: 0.7,
    borderColor: Colors.border,
  },
  absoulteContainer: {
    marginVertical: 15,
    marginBottom: Platform.OS === 'ios' ? 30 : 10,
  },
});
