import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { FC } from 'react';
import { Colors, Fonts } from '@utils/Constants';
import CustomText from '@components/ui/CustomText';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RFValue } from 'react-native-responsive-fontsize';

interface ArrowButtonProps {
  loading: boolean;
  price: number;
  title: string;
  onPress: () => void;
}

const ArrowButton: FC<ArrowButtonProps> = ({
  loading,
  onPress,
  price,
  title,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={loading}
      onPress={onPress}
      style={[
        styles.btn,
        { justifyContent: price !== 0 ? 'space-between' : 'center' },
      ]}
    >
      {price != 0 && price && (
        <View>
          <CustomText
            variant="h7"
            style={{ color: 'white' }}
            fontFamily={Fonts.Medium}
          >
            ₹{price + 34}.0
          </CustomText>

          <CustomText
            variant="h9"
            fontFamily={Fonts.Medium}
            style={{ color: 'white' }}
          >
            TOTAL
          </CustomText>
        </View>
      )}

      <View style={styles.flexRow}>
        <CustomText
          variant="h6"
          style={{ color: '#fff' }}
          fontFamily={Fonts.Medium}
        >
          {title}
        </CustomText>

        {loading ? (
          <ActivityIndicator
            color={'white'}
            style={{ marginHorizontal: 5 }}
            size={'small'}
          />
        ) : (
          <Icon name="arrow-right" color={'#FFF'} size={RFValue(25)} />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ArrowButton;

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Colors.secondary,
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 12,
    marginVertical: 10,
    marginHorizontal: 15,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
