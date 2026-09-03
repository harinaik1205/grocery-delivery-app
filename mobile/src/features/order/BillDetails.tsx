import { StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import { Colors, Fonts } from '@utils/Constants';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomText from '@components/ui/CustomText';

interface Props {
  totalPrice: number;
}

const BillDetails: FC<Props> = ({ totalPrice }) => {
  return (
    <View style={styles.container}>
      <CustomText style={styles.text} fontFamily={Fonts.SemiBold}>
        Bill Details
      </CustomText>

      <View style={styles.billContainer}>
        <ReportItem iconName="article" title="Items total" price={totalPrice} />
        <ReportItem iconName="pedal-bike" title="Delivery charges" price={29} />
        <ReportItem
          iconName="shopping-bag"
          title="Handling charges"
          price={2}
        />
        <ReportItem iconName="cloudy-snowing" title="Surge charges" price={3} />
      </View>

      <View style={[styles.flexRowBetween, { marginBottom: 15 }]}>
        <CustomText
          variant="h7"
          style={styles.text}
          fontFamily={Fonts.SemiBold}
        >
          Grand Total
        </CustomText>
        <CustomText style={styles.text} fontFamily={Fonts.SemiBold}>
          ₹{totalPrice + 34}
        </CustomText>
      </View>
    </View>
  );
};

const ReportItem: FC<{
  iconName: string;
  underline?: boolean;
  title: string;
  price: number;
}> = ({ iconName, underline, title, price }) => {
  return (
    <View style={[styles.flexRowBetween, { marginBottom: 10 }]}>
      <View style={styles.flexRow}>
        <Icon
          name={iconName}
          style={{ opacity: 0.7 }}
          size={RFValue(12)}
          color={Colors.text}
        />
        <CustomText
          style={{
            textDecorationLine: underline ? 'underline' : 'none',
            textDecorationStyle: 'dashed',
          }}
          variant="h6"
        >
          {title}
        </CustomText>
      </View>
      <CustomText variant="h8">₹{price}</CustomText>
    </View>
  );
};

export default BillDetails;

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    marginVertical: 15,
    backgroundColor: '#fff',
  },
  text: {
    marginHorizontal: 10,
    marginTop: 15,
  },
  billContainer: {
    padding: 10,
    paddingBottom: 10,
    borderBottomColor: Colors.border,
    borderBottomWidth: 0.7,
  },
  flexRowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});
