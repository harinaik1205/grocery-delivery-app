import CustomText from '@components/ui/CustomText';
import { useNavigationState } from '@react-navigation/native';
import { useAuthStore } from '@state/authStore';
import { hocStyles } from '@styles/GlobalStyles';
import { Colors, Fonts } from '@utils/Constants';
import { navigate } from '@utils/NavigationUtils';
import { FC, useEffect } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SOCKET_URL } from '../../services/config';
import { getOrderById } from '../../services/orderServices';
import { io } from 'socket.io-client';
const withLiveStatus = <P extends object>(
  WrapperComponent: React.ComponentType,
): FC<P> => {
  const WithLiveStatusComponent: FC<P> = props => {
    const { currentOrder, setCurrentOrder } = useAuthStore();
    const routeName = useNavigationState(
      state => state.routes[state.index]?.name,
    );

    console.log('curOrder', currentOrder);

    const fetchOrderDetails = async () => {
      const data = await getOrderById(currentOrder?._id);
      setCurrentOrder(data);
    };

    useEffect(() => {
      if (currentOrder) {
        const socketInstance = io(SOCKET_URL, {
          transports: ['websocket'],
          withCredentials: true,
        });
        socketInstance.emit('joinRoom', currentOrder?._id);
        socketInstance.on('liveTrackingUpdates', updatedOrder => {
          fetchOrderDetails();
          console.log('RECEIVING LIVE UPDATES');
        });
        socketInstance.on('orderConfirmed', confirmOrder => {
          fetchOrderDetails();
          console.log('ORDER CONFIRMATION LIVE UPDATES');
        });

        return () => {
          socketInstance.disconnect();
        };
      }
    }, [currentOrder]);

    return (
      <View style={styles.container}>
        <WrapperComponent {...props} />
        {currentOrder && routeName === 'ProductDashboard' && (
          <View
            style={[
              hocStyles.cartContainer,
              {
                flexDirection: 'row',
                alignItems: 'center',
              },
            ]}
          >
            <View style={styles.flexRow}>
              <View style={styles.img}>
                <Image
                  source={require('@assets/icons/bucket.png')}
                  style={{ width: 20, height: 20 }}
                />
              </View>

              <View style={{ width: '68%' }}>
                <CustomText variant="h7" fontFamily={Fonts.SemiBold}>
                  Order is {currentOrder?.order?.status || currentOrder?.status}
                </CustomText>
                {currentOrder && (
                  <CustomText variant="h9" fontFamily={Fonts.Medium}>
                    {currentOrder?.order &&
                      currentOrder?.order?.items![0]?.item?.name +
                        (currentOrder?.order?.items?.length - 1 > 0
                          ? ` and ${
                              currentOrder?.order?.items?.length - 1
                            }+ items`
                          : '')}

                    {currentOrder?.items![0]?.item?.name +
                      (currentOrder?.items?.length - 1 > 0
                        ? ` and ${currentOrder?.items?.length - 1}+ items`
                        : '')}
                  </CustomText>
                )}
              </View>
            </View>

            <TouchableOpacity
              style={styles.btn}
              onPress={() => navigate('LiveTracking')}
            >
              <CustomText
                fontFamily={Fonts.Medium}
                variant="h8"
                style={{
                  color: Colors.secondary,
                }}
              >
                View
              </CustomText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return WithLiveStatusComponent;
};

export default withLiveStatus;

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
