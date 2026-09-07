import {
  Alert,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import CustomHeader from '@components/ui/CustomHeader';
import CustomInput from '@components/ui/CustomInput';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { screenHeight, screenWidth } from '@utils/Scaling';
import { Colors, Fonts } from '@utils/Constants';
import CustomText from '@components/ui/CustomText';
import { useAuthStore } from '@state/authStore';
import { reverseGeocode } from '@services/mapServices';

interface InitialRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

const initialRegionData: InitialRegion = {
  latitude: 17.4451806,
  longitude: 78.38024250000001,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const SelectLocationScreen = () => {
  const [region, setRegion] = useState<InitialRegion>(initialRegionData);
  const [addressLocading, setAddressLoading] = useState<boolean>(false);
  const [address, setAddress] = useState<any>(null);
  const mapRef = useRef<MapView | null>(null);
  const { setUser } = useAuthStore();

  useEffect(() => {
    const fetchAddress = async () => {
      setAddressLoading(true);
      try {
        const address = await reverseGeocode(
          region?.latitude,
          region.longitude,
          setUser,
        );
        if (address) {
          console.log('========');
          console.log(address);
          setAddress(address);
          console.log('========');
        }
      } catch (error: any) {
        Alert.alert(error);
      } finally {
        setAddressLoading(false);
      }
    };
    fetchAddress();
  }, [region]);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;

        const region = {
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };

        setRegion(region);

        mapRef.current?.animateToRegion(region);
      },
      error => console.log('initial region error', error),
      {
        enableHighAccuracy: true,
        timeout: 15000,
      },
    );
  };

  console.log('======');
  console.log(region);
  console.log('======');
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <CustomHeader title="Select Your Location" />
      <View
        style={{
          flex: 1,
        }}
      >
        {/* search bar */}
        <Pressable style={styles.searchBar}>
          <CustomInput
            left={<IonIcon name="search" size={20} />}
            placeholder={'Search for apartment, street name...'}
          />
        </Pressable>

        {/* map view */}

        <View
          style={{
            flex: 1,
          }}
        >
          <MapView
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
            mapType="standard"
            initialRegion={region}
            onRegionChange={region => {
              setRegion(region);
            }}
          />
          <View style={styles.markerFixed}>
            <IonIcon name="location-sharp" size={40} color={Colors.primary} />
          </View>

          <TouchableOpacity
            style={styles.myLocationBtn}
            hitSlop={10}
            onPress={getCurrentLocation}
          >
            <MaterialIcon
              name="my-location"
              size={20}
              color={Colors.secondary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomContainer}>
          <View
            style={{
              flex: 0.5,
            }}
          >
            {addressLocading ? (
              <CustomText variant="h6">Fetching...</CustomText>
            ) : (
              <CustomText
                variant="h6"
                fontFamily={Fonts.Regular}
                numberOfLines={3}
              >
                {address}
              </CustomText>
            )}
          </View>

          <TouchableOpacity style={styles.confirmLocationBtn}>
            <CustomText
              variant="h6"
              fontFamily={Fonts.SemiBold}
              style={{
                color: '#fff',
              }}
            >
              Confirm Location
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SelectLocationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'fff',
  },
  searchBar: {
    paddingHorizontal: 10,
  },
  markerFixed: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20, // half of marker width
    marginTop: -20, // half of marker height
  },
  myLocationBtn: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#fff',
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: '#fff',
    padding: 10,
    height: '25%',
  },
  confirmLocationBtn: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: Colors.secondary,
    marginTop: 20,
  },
});
