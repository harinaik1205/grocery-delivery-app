import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@state/authStore';
import { useCartStore } from '@state/cartStore';
import { fetchCustomerOrders } from '@services/orderServices';
import ProfileOrderItem from './ProfileOrderItem';
import CustomHeader from '@components/ui/CustomHeader';
import { FlashList } from '@shopify/flash-list';
import CustomText from '@components/ui/CustomText';
import { Fonts } from '@utils/Constants';
import WalletSection from './WalletSection';
import ActionButton from './ActionButton';
import { storage, tokenStorage } from '@state/storage';
import { navigate, resetAndNavigate } from '@utils/NavigationUtils';
import { getMessaging } from '@react-native-firebase/messaging';

const Profile = () => {
  const [orders, setOrders] = useState([]);
  const { user, logout } = useAuthStore();
  const { clearCart } = useCartStore();

  const fetchOrders = async () => {
    const data = await fetchCustomerOrders(user?._id);
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const renderOrders = ({ item, index }: any) => {
    return <ProfileOrderItem item={item} index={index} />;
  };

  const renderHeader = () => {
    return (
      <View>
        <CustomText variant="h3" fontFamily={Fonts.SemiBold}>
          Your account
        </CustomText>
        <CustomText variant="h7" fontFamily={Fonts.Medium}>
          {user?.phone}
        </CustomText>

        <WalletSection />

        <CustomText variant="h8" style={styles.informativeText}>
          YOUR INFORMATION
        </CustomText>

        <ActionButton
          icon="book-outline"
          label="Address book"
          onPress={() => navigate('AddressBook')}
        />
        <ActionButton icon="information-circle-outline" label="About us" />
        <ActionButton
          icon="log-out-outline"
          label="Logout"
          onPress={() => {
            clearCart();
            logout();
            tokenStorage.clearAll();
            storage.clearAll();
            getMessaging().deleteToken();
            resetAndNavigate('CustomerLogin');
          }}
        />

        <CustomText variant="h8" style={styles.pastText}>
          PAST ORDERS
        </CustomText>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Profile" />
      <FlashList
        data={orders}
        ListHeaderComponent={renderHeader}
        renderItem={renderOrders}
        keyExtractor={(item: any) => item?.orderId}
        contentContainerStyle={{
          paddingHorizontal: 10,
        }}
      />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContainer: {
    padding: 10,
    paddingTop: 10,
    paddingBottom: 100,
  },
  informativeText: {
    opacity: 0.7,
    marginBottom: 20,
  },
  pastText: {
    marginVertical: 20,
    opacity: 0.7,
  },
});
