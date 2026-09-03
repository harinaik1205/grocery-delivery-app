import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Colors } from '@utils/Constants';
import { useAuthStore } from '@state/authStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeliveryHeader from './DeliveryHeader';

const DeliveryDashboard = () => {
  const { user } = useAuthStore();
  const [selectedTab, setSelectedTab] = useState<'available' | 'delivered'>(
    'available',
  );
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <DeliveryHeader name={user?.name} email={user?.email} />
      </SafeAreaView>
    </View>
  );
};

export default DeliveryDashboard;

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
