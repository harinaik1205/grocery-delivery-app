import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from '@utils/Constants';
import { useAuthStore } from '@state/authStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeliveryHeader from './DeliveryHeader';
import TabBar from './TabBar';
import Geolocation from '@react-native-community/geolocation';
import { reverseGeocode } from '@services/mapServices';
import { fetchOrders } from '@services/orderServices';
import DeliveryOrderItem from './DeliveryOrderItem';
import { FlashList } from '@shopify/flash-list';
import CustomText from '@components/ui/CustomText';
import withLiveOrder from './withLiveOrder';

const DeliveryDashboard = () => {
  const { user, setUser } = useAuthStore();
  const [selectedTab, setSelectedTab] = useState<'available' | 'delivered'>(
    'available',
  );
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const updateUser = () => {
    Geolocation.requestAuthorization();
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        reverseGeocode(latitude, longitude, setUser);
      },
      err => console.log(err),
      {
        enableHighAccuracy: true,
        timeout: 1500,
      },
    );
  };

  useEffect(() => {
    updateUser();
  }, []);

  const fetchData = async () => {
    setData([]);
    setRefreshing(true);
    setLoading(true);
    try {
      console.log('=========');

      console.log('user', user);

      console.log('=========');
      const data = await fetchOrders(selectedTab, user?._id, user?.branch);
      setData(data);
    } catch (error: any) {
      Alert.alert('Error', error);
      console.log(error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedTab]);

  const renderOrderItem = ({ item, index }: any) => {
    return <DeliveryOrderItem item={item} index={index} />;
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <DeliveryHeader name={user?.name} email={user?.email} />
      </SafeAreaView>
      <View style={styles.subContainer}>
        <TabBar selectedTab={selectedTab} onTabChange={setSelectedTab} />

        <FlashList
          data={data}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
          }
          ListEmptyComponent={() => {
            if (loading) {
              return (
                <View style={styles.center}>
                  <ActivityIndicator size={'small'} color={Colors.secondary} />
                </View>
              );
            }
            return (
              <View style={styles.center}>
                <CustomText>No Orders found yet</CustomText>
              </View>
            );
          }}
          renderItem={renderOrderItem}
          keyExtractor={(item: any) => item?.orderId}
          contentContainerStyle={styles.flatlistContainer}
        />
      </View>
    </View>
  );
};

export default withLiveOrder(DeliveryDashboard);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  subContainer: {
    flex: 1,
    padding: 6,
    backgroundColor: Colors.backgroundSecondary,
  },
  flatlistContainer: {
    padding: 2,
  },
  center: {
    flex: 1,
    marginTop: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
