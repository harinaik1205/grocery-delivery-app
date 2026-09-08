import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
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
import {
  getPlaceDetails,
  getPlaces,
  reverseGeocode,
} from '@services/mapServices';

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
  const [showModal, setShowModal] = useState(false);

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

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
          // console.log('========');
          // console.log(address);
          setAddress(address);
          // console.log('========');
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

  useEffect(() => {
    if (!query || query.length <= 2) return;
    fetchPlaces(query);
  }, [query]);

  const fetchPlaces = async (inputText: string) => {
    try {
      const data = await getPlaces(inputText);
      // console.log('places', data);
      const results =
        data?.suggestions?.map((s: any) => {
          return {
            description: s.placePrediction.text.text,
            placeId: s.placePrediction.placeId,
            text: s.placePrediction?.structuredFormat?.mainText?.text,
          };
        }) || [];

      setSuggestions(results);
    } catch (error) {
      console.log('Error while fetching places', error);
      Alert.alert('rror while fetching places', JSON.stringify(error));
    }
  };

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

  const handlePress = async (item: {
    description: string;
    placeId: string;
    text: string;
  }) => {
    try {
      const geocoding = await getPlaceDetails(item?.placeId);
      setRegion({
        latitude: geocoding?.lat,
        longitude: geocoding?.lng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
      setQuery('');
      setSuggestions([]);
      setShowModal(false);
      mapRef.current?.animateToRegion(region, 200);
    } catch (error) {
      Alert.alert('Error while fetching place details', JSON.stringify(error));
      console.log('Error while fetching place details', error);
    }
  };

  // console.log('======');
  // console.log(region);
  // console.log('======');
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
        <Pressable style={styles.searchBar} onPress={() => setShowModal(true)}>
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
              flex: 1,
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

      <Modal visible={showModal} animationType="slide" style={styles.modal}>
        <Pressable style={styles.overlay} onPress={() => setShowModal(false)} />

        <View style={styles.modalContent}>
          <View style={styles.modalContentTopContainer}>
            <View style={[styles.flexRowBetween, { paddingBottom: 10 }]}>
              <CustomText variant="h6" fontFamily={Fonts.SemiBold}>
                Select Address
              </CustomText>
              <Pressable hitSlop={30} onPress={() => setShowModal(false)}>
                <IonIcon name="close-outline" size={20} />
              </Pressable>
            </View>

            <CustomInput
              left={<IonIcon name="search" size={20} />}
              placeholder={'Search for apartment, street name...'}
              query={query}
              setQuery={setQuery}
            />
          </View>
          <ScrollView
            style={styles.modalBottomContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              gap: 10,
            }}
          >
            {suggestions &&
              suggestions?.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handlePress(item)}
                  style={[styles.flexRowGap, styles.addressCard]}
                >
                  <View style={styles.addressCardIcon}>
                    <IonIcon name="location-outline" size={20} />
                  </View>
                  <View
                    style={{
                      width: '85%',
                    }}
                  >
                    <CustomText variant="h6" fontFamily={Fonts.SemiBold}>
                      {item?.text}
                    </CustomText>
                    <CustomText
                      numberOfLines={3}
                      variant="h8"
                      fontFamily={Fonts.Medium}
                    >
                      {item?.description}
                    </CustomText>
                  </View>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      </Modal>
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
    paddingBottom: 50,
  },
  confirmLocationBtn: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: Colors.secondary,
    marginTop: 20,
  },
  modal: {
    flex: 1,
    backgroundColor: '#00000000',
  },
  overlay: {
    height: '20%',
    backgroundColor: '#00000000',
  },
  modalContent: {
    height: '80%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalContentTopContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalBottomContainer: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
    padding: 10,
  },
  flexRowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexRowGap: {
    flexDirection: 'row',
    // alignItems: 'center',
    gap: 10,
  },
  addressCard: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors.border,
    backgroundColor: '#FFF',
  },
  addressCardIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors.border,
    backgroundColor: Colors.backgroundSecondary,
  },
});
