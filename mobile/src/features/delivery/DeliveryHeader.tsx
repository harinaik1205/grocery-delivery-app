import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { FC } from 'react';
import { Colors, Fonts } from '@utils/Constants';
import CustomText from '@components/ui/CustomText';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { resetAndNavigate } from '@utils/NavigationUtils';
import { useAuthStore } from '@state/authStore';
import { storage, tokenStorage } from '@state/storage';

interface Props {
  name: string;
  email: string;
}

const DeliveryHeader: FC<Props> = ({ name, email }) => {
  const { logout } = useAuthStore();

  return (
    <View style={styles.flexRow}>
      <View style={styles.imgContainer}>
        <Image
          source={require('@assets/images/delivery_boy.png')}
          style={styles.img}
        />
      </View>
      <View style={styles.infoContainer}>
        <CustomText variant="h4" fontFamily={Fonts.SemiBold}>
          Hello {name}
        </CustomText>
        <CustomText variant="h4" fontFamily={Fonts.Medium}>
          {email}
        </CustomText>
      </View>

      <TouchableOpacity
        onPress={() => {
          resetAndNavigate('CustomerLogin');
          logout();
          tokenStorage.clearAll();
          storage.clearAll();
        }}
      >
        <Icon name="logout" size={30} color={'black'} />
      </TouchableOpacity>
    </View>
  );
};

export default DeliveryHeader;

const styles = StyleSheet.create({
  flexRow: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
    gap: 10,
  },
  imgContainer: {
    padding: 4,
    borderRadius: 100,
    height: 60,
    width: 60,
    overflow: 'hidden',
    backgroundColor: Colors.backgroundSecondary,
  },
  img: {
    width: '100%',
    bottom: -8,
    height: '100%',
    resizeMode: 'contain',
  },
  infoContainer: {
    width: '70%',
  },
});
