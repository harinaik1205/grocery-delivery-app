import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Colors, Fonts } from '@utils/Constants';
import RollingBar from 'react-native-rolling-bar';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomText from '@components/ui/CustomText';

const SearchBar = () => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8}>
      <IonIcon name="search" color={Colors.text} size={RFValue(20)} />
      <RollingBar
        interval={3000}
        defaultStyle={false}
        customStyle={styles.textContainer}
      >
        <CustomText variant="h6" fontFamily={Fonts.Medium}>
          Search "Sweets"
        </CustomText>
        <CustomText variant="h6" fontFamily={Fonts.Medium}>
          Search "Milk"
        </CustomText>
        <CustomText variant="h6" fontFamily={Fonts.Medium}>
          Search for ata, dal, coke
        </CustomText>
        <CustomText variant="h6" fontFamily={Fonts.Medium}>
          Search "chips"
        </CustomText>
        <CustomText variant="h6" fontFamily={Fonts.Medium}>
          Search "store"
        </CustomText>
      </RollingBar>
      <View style={styles.divider} />
      <IonIcon name="mic" color={Colors.text} size={RFValue(20)} />
    </TouchableOpacity>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F4F7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    borderWidth: 0.6,
    borderColor: Colors.border,
    marginTop: 15,
    overflow: 'hidden',
    marginHorizontal: 10,
    paddingHorizontal: 10,
  },
  textContainer: {
    width: '90%',
    paddingLeft: 10,
    height: 50,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#ddd',
    marginHorizontal: 10,
  },
});
