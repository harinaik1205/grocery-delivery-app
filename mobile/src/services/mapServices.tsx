import axios from 'axios';
import { GOOGLE_MAPS_API_KEY } from './config';
import { updateUserLocation } from './authServices';

export const reverseGeocode = async (
  latitude: number,
  longitude: number,
  setUser: any,
) => {
  try {
    let address;
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude}, ${longitude}&key=${GOOGLE_MAPS_API_KEY}`,
    );

    // console.log('reverse geocode response', response);

    if (response.data.status === 'OK') {
      address = response.data.results[0].formatted_address;
      updateUserLocation(
        {
          liveLocation: { latitude, longitude },
          address,
        },
        setUser,
      );

      return address;
    } else {
      console.error('Geo code Failed', response.data);
      return null;
    }
  } catch (error) {
    console.error('Geo code failed', error);
    return null;
  }
};
