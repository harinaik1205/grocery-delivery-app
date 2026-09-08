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

export const getPlaces = async (query: string) => {
  try {
    const response = await fetch(
      'https://places.googleapis.com/v1/places:autocomplete',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
        },
        body: JSON.stringify({
          input: query,
          locationRestriction: {
            rectangle: {
              low: {
                latitude: 8.4, // Southern tip of India
                longitude: 68.7, // Western border
              },
              high: {
                latitude: 37.6, // Northern border
                longitude: 97.25, // Eastern border
              },
            },
          },
        }),
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error while fetching places', error);
    throw error;
  }
};

export const getPlaceDetails = async (
  placeId: string,
): Promise<{ lat: number; lng: number }> => {
  const url = `https://places.googleapis.com/v1/places/${placeId}?fields=location`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key':
          GOOGLE_MAPS_API_KEY! || 'AIzaSyBhJSavFevtZhpOJVr-wVYa6K4rYzBRUJg',
      },
    });

    const data = await response.json();
    console.log('=========');
    console.log('=========');

    console.log('place details', data);

    console.log('=========');
    console.log('=========');

    // Extract lat/lng
    const lat = data.location?.latitude;
    const lng = data.location?.longitude;

    return { lat, lng };
  } catch (error) {
    console.error('Error fetching place details:', error);
    throw error;
  }
};
