import CustomText from '@components/ui/CustomText';
import Geolocation from '@react-native-community/geolocation';
import { sendLiveOrderUpdates } from '@services/orderServices';
import { useAuthStore } from '@state/authStore';
import { hocStyles } from '@styles/GlobalStyles';
import { Colors, Fonts } from '@utils/Constants';
import { navigate } from '@utils/NavigationUtils';
import { FC, useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

const withLiveOrder = <P extends Object>(
  WrapperComponent: React.ComponentType,
): FC<P> => {
  const WithLiveOrder: FC<P> = props => {
    const { currentOrder } = useAuthStore();
    const user = useAuthStore(state => state.user);
    const [myLocation, setMyLocation] = useState<any>(null);

    useEffect(() => {
      const watchId = Geolocation.watchPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setMyLocation({ latitude, longitude });
        },
        error => console.log(error),
        {
          enableHighAccuracy: true,
          distanceFilter: 10,
        },
      );

      return () => Geolocation.clearWatch(watchId);
    }, []);

    useEffect(() => {
      async function sendLiveUpdates() {
        if (
          currentOrder?.deliveryPartner?._id === user?._id &&
          currentOrder?.status != 'delivered' &&
          currentOrder?.status != 'cancelled'
        ) {
          sendLiveOrderUpdates(
            currentOrder?._id,
            myLocation,
            currentOrder?.status,
          );
        }
      }
      sendLiveUpdates();
    }, [myLocation]);
    return (
      <View style={styles.container}>
        <WrapperComponent {...props} />

        {currentOrder && (
          <View
            style={[
              hocStyles.cartContainer,
              {
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 20,
              },
            ]}
          >
            <View style={styles.flexRow}>
              <View style={styles.img}>
                <Image
                  source={require('@assets/icons/bucket.png')}
                  style={{
                    width: 20,
                    height: 20,
                  }}
                />
              </View>

              <View style={{ width: '65%' }}>
                <CustomText variant="h6" fontFamily={Fonts.SemiBold}>
                  #{currentOrder?.orderId}
                </CustomText>
                <CustomText variant="h9" fontFamily={Fonts.Medium}>
                  {currentOrder?.deliveryLocation?.address}
                </CustomText>
              </View>

              <TouchableOpacity
                onPress={() => {
                  navigate('DeliveryMap', {
                    ...currentOrder,
                  });
                }}
              >
                <CustomText
                  variant="h8"
                  style={{ color: Colors.secondary }}
                  fontFamily={Fonts.Medium}
                >
                  Continue
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return WithLiveOrder;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 15,
    marginBottom: 15,
    paddingVertical: 10,
    padding: 10,
  },
  img: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 100,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderWidth: 0.7,
    borderColor: Colors.secondary,
    borderRadius: 5,
  },
});

export default withLiveOrder;
