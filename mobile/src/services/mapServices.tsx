import axios from 'axios';
import { GOOGLE_MAPS_API_KEY } from './config';
import { updateUserLocation } from './authServices';

export const reverseGeocode = async (
  latitude: number,
  longitude: number,
  setUser: any,
) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude}, ${longitude}&key=${GOOGLE_MAPS_API_KEY}`,
    );

    console.log('reverse geocode response', response);

    if (response.data.status === 'OK') {
      const address = response.data.results[0].formatted_address;
      updateUserLocation(
        {
          liveLocation: { latitude, longitude },
          address,
        },
        setUser,
      );
    } else {
      console.error('Geo code Failed', response.data);
    }
  } catch (error) {
    console.error('Geo code failed', error);
  }
};
