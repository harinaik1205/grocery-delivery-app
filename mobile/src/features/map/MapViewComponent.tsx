import { CodegenTypes, StyleSheet, Text, View } from 'react-native';
import React from 'react';

import MapView, { Polyline } from 'react-native-maps';
import { customMapStyle } from '@utils/CustomMap';
import Markers from '@components/map/Markers';
import { getPoints } from '@utils/getPoints';
import { Colors } from '@utils/Constants';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_API_KEY } from '@services/config';

const MapViewComponent = ({
  mapRef,
  setMapRef,
  hasAccepted,
  hasPickedUp,
  deliveryLocation,
  pickupLocation,
  deliveryPersonLocation,
  camera,
}: any) => {
  return (
    <MapView
      ref={setMapRef}
      style={{ flex: 1 }}
      provider="google"
      camera={camera}
      customMapStyle={customMapStyle}
      showsUserLocation={true}
      userLocationCalloutEnabled={true}
      userLocationPriority="high"
      showsTraffic={false}
      pitchEnabled={false}
      followsUserLocation
      showsCompass={true}
      showsBuildings={false}
      showsIndoors={false}
      showsScale={false}
      showsIndoorLevelPicker={false}
    >
      {deliveryPersonLocation && (hasPickedUp || hasAccepted) && (
        <MapViewDirections
          origin={deliveryPersonLocation}
          destination={hasAccepted ? pickupLocation : deliveryLocation}
          precision="high"
          apikey={GOOGLE_MAPS_API_KEY}
          strokeColor="#2971F2"
          strokeWidth={5}
          onError={err => {
            console.log(err);
          }}
        />
      )}
      <Markers
        deliveryPersonLocation={deliveryPersonLocation}
        deliverLocation={deliveryLocation}
        pickupLocation={pickupLocation}
      />
      {!hasPickedUp && deliveryLocation && pickupLocation && (
        <Polyline
          coordinates={getPoints([pickupLocation, deliveryLocation])}
          strokeColor={Colors.primary}
          strokeWidth={2}
          geodesic
          lineDashPattern={[12, 10]}
        />
      )}
    </MapView>
  );
};

export default MapViewComponent;

const styles = StyleSheet.create({});
