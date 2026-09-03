import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { FC, useEffect } from 'react';
import { screenHeight } from '@utils/Scaling';
import { Colors } from '@utils/Constants';
import { useMapStore } from '@state/mapStore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFValue } from 'react-native-responsive-fontsize';
import { handleFitToPath } from '@components/map/mapUtils';
import MapViewComponent from './MapViewComponent';

interface Props {
  deliveryLocation: number;
  pickupLocation: number;
  deliveryPersonLocation: number;
  hasAccepted: boolean;
  hasPickedUp: boolean;
}

const LiveMap: FC<Props> = ({
  deliveryLocation,
  deliveryPersonLocation,
  pickupLocation,
  hasAccepted,
  hasPickedUp,
}) => {
  const { mapRef, setMapRef } = useMapStore();

  useEffect(() => {
    if (mapRef) {
      handleFitToPath(
        mapRef,
        deliveryLocation,
        pickupLocation,
        deliveryPersonLocation,
        hasPickedUp,
        hasAccepted,
      );
    }
  }, [
    mapRef,
    deliveryPersonLocation,
    hasAccepted,
    hasPickedUp,
    deliveryLocation,
  ]);

  return (
    <View style={styles.container}>
      <MapViewComponent
        mapRef={mapRef}
        setMapRef={setMapRef}
        hasAccepted={hasAccepted}
        hasPickedUp={hasPickedUp}
        deliveryLocation={deliveryLocation}
        pickupLocation={pickupLocation}
        deliveryPersonLocation={deliveryPersonLocation}
      />
      <TouchableOpacity
        style={styles.fitButton}
        onPress={() => {
          handleFitToPath(
            mapRef,
            deliveryLocation,
            pickupLocation,
            deliveryPersonLocation,
            hasPickedUp,
            hasAccepted,
          );
        }}
      >
        <Icon name="target" size={RFValue(14)} color={Colors.text} />
      </TouchableOpacity>
    </View>
  );
};

export default LiveMap;

const styles = StyleSheet.create({
  container: {
    height: screenHeight * 0.35,
    width: '100%',
    borderRadius: 15,
    backgroundColor: '#FFF',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
  },
  fitButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    padding: 5,
    backgroundColor: '#fff',
    borderWidth: 0.8,
    borderColor: Colors.border,
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowColor: 'black',
    elevation: 5,
    borderRadius: 35,
  },
});
