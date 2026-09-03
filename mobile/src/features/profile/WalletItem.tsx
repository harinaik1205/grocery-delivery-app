import { StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors, Fonts } from '@utils/Constants';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomText from '@components/ui/CustomText';

interface Props {
  icon: string;
  label: string;
}
const WalletItem: FC<Props> = ({ icon, label }) => {
  return (
    <View style={styles.walletItemContianer}>
      <Icon name={icon} color={Colors.text} size={RFValue(20)} />
      <CustomText variant="h8" fontFamily={Fonts.Medium}>
        {label}
      </CustomText>
    </View>
  );
};

export default WalletItem;

const styles = StyleSheet.create({
  walletItemContianer: {
    alignItems: 'center',
  },
});
