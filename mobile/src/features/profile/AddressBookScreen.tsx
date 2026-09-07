import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import CustomHeader from '@components/ui/CustomHeader';
import { Colors, Fonts } from '@utils/Constants';
import CustomText from '@components/ui/CustomText';
import Icon from 'react-native-vector-icons/Feather';
import { navigate } from '@utils/NavigationUtils';

const AddressBookScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <CustomHeader title="Addresses" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollViewContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* add new address button */}
        <TouchableOpacity
          style={styles.addNewAddressBtn}
          onPress={() => navigate('SelectLocation')}
        >
          <View style={styles.flexRowGap}>
            <Icon name="plus" size={20} color={Colors.secondary} />
            <CustomText
              variant="h7"
              fontFamily={Fonts.Medium}
              style={{ color: Colors.secondary }}
            >
              Add New Address
            </CustomText>
          </View>
          <Icon name="chevron-right" size={20} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default AddressBookScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContainer: {
    padding: 10,
    // paddingTop: 10,
    paddingBottom: 100,
    backgroundColor: Colors.backgroundSecondary,
  },
  addNewAddressBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: Colors.border,
    backgroundColor: '#fff',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    shadowColor: Colors.border,
  },
  flexRowGap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});
