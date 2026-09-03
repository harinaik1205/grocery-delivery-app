import { Image, StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import { Colors, Fonts } from '@utils/Constants';
import CustomText from '@components/ui/CustomText';
import UniversalAdd from '@components/ui/UniversalAdd';

interface Props {
  item: any;
}

const OrderItem: FC<Props> = ({ item }) => {
  return (
    <View style={styles.flexRow}>
      <View style={styles.imgContainer}>
        <Image
          source={{
            uri: item?.item?.image,
          }}
          style={styles.img}
        />
      </View>

      <View style={{ width: '55%' }}>
        <CustomText numberOfLines={2} variant="h8" fontFamily={Fonts.SemiBold}>
          {item?.item?.name}
        </CustomText>
        <CustomText variant="h9">{item?.item?.quantity}</CustomText>
      </View>

      <View style={{ width: '20%', alignItems: 'flex-end' }}>
        <UniversalAdd item={item?.item} />
        <CustomText>₹{item?.count * item?.item?.price}</CustomText>
      </View>
    </View>
  );
};

export default OrderItem;

const styles = StyleSheet.create({
  img: {
    width: 40,
    height: 40,
  },
  imgContainer: {
    backgroundColor: Colors.backgroundSecondary,
    padding: 10,
    borderRadius: 15,
    width: '17%',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderTopWidth: 0.6,
    borderTopColor: Colors.border,
  },
});
