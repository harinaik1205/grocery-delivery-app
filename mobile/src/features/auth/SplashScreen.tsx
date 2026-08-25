import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import Logo from '../../assets/images/logo.jpeg';
import { Colors } from '@utils/Constants';
import { screenHeight, screenWidth } from '@utils/Scaling';
import { navigate, resetAndNavigate } from '@utils/NavigationUtils';

import GeoLocation from '@react-native-community/geolocation';
import { useAuthStore } from '@state/authStore';
import { tokenStorage } from '@state/storage';
import { jwtDecode } from 'jwt-decode';
import { refetchUser, refreshToken } from '../../services/authServices';

GeoLocation.setRNConfiguration({
  skipPermissionRequests: false,
  authorizationLevel: 'always',
  enableBackgroundLocationUpdates: true,
  locationProvider: 'auto',
});

interface DecodedToken {
  exp: number;
}

const SplashScreen = () => {
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    const initialStartup = () => {
      try {
        GeoLocation.requestAuthorization();
        tokenCheck();
      } catch (error) {
        Alert.alert(
          'Sorry we need location service to give you better shopping experience',
        );
        console.log(error);
      }
    };

    const timeoutId = setTimeout(initialStartup, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  const tokenCheck = async () => {
    const accessToken = tokenStorage.getString('accessToken');
    const refresh_token = tokenStorage.getString('refreshToken') as string;

    if (accessToken) {
      const decodedAccessToken = jwtDecode<DecodedToken>(accessToken);
      const decodedRefreshToken = jwtDecode<DecodedToken>(refresh_token);

      const currentTime = Date.now() / 1000;
      if (decodedRefreshToken.exp < currentTime) {
        resetAndNavigate('CustomerLogin');
        Alert.alert('Session expired', 'Please login again');
        return false;
      }

      if (decodedAccessToken.exp < currentTime) {
        try {
          refreshToken();
          await refetchUser(setUser);
        } catch (error) {
          console.log(error);
          Alert.alert('There is an error refreshing token');
          return false;
        }
      }
      if (user?.role === 'Customer') {
        resetAndNavigate('ProductDashboard');
      } else {
        resetAndNavigate('DeliveryDashboard');
      }
    }

    resetAndNavigate('CustomerLogin');
    return false;
  };
  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logo} />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  logo: {
    width: screenWidth * 0.7,
    height: screenHeight * 0.7,
    resizeMode: 'contain',
  },
});
