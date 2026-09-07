import { StatusBar, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import CustomHeader from '@components/ui/CustomHeader';

const AddAddressDetailsScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <CustomHeader title="Add Address Details" />
    </View>
  );
};

export default AddAddressDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
