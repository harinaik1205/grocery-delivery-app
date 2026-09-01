import {
  Alert,
  Animated,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from 'react-native-gesture-handler';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import ProductSlider from '@components/login/ProductSlider';
import { Colors, Fonts, lightColors } from '@utils/Constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomText from '@components/ui/CustomText';

import { RFValue } from 'react-native-responsive-fontsize';
import { resetAndNavigate } from '@utils/NavigationUtils';
import useKeyboardOffsetHeight from '@utils/useKeyboardOffsetHeight';
import LinearGradient from 'react-native-linear-gradient';
import CustomInput from '@components/ui/CustomInput';
import CustomButton from '@components/ui/CustomButton';
import { customerLogin } from '../../services/authServices';
const bottomColors = [...lightColors].reverse();
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
const CustomerLogin = () => {
  const [gestureSequence, setGestureSequence] = useState<string[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const keyboardOffsetHeight = useKeyboardOffsetHeight();

  useEffect(() => {
    if (keyboardOffsetHeight === 0) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      });
    } else {
      Animated.timing(animatedValue, {
        toValue: -keyboardOffsetHeight * 0.84,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [keyboardOffsetHeight]);

  const handleSendOtp = async () => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      await customerLogin(phoneNumber);
      resetAndNavigate('ProductDashboard');
    } catch (error: any) {
      Alert.alert('Login Failed', error?.message || error);
    } finally {
      setLoading(false);
    }
  };

  const handleGesture = ({ nativeEvent }: any) => {
    if (nativeEvent.state === State.END) {
      const { translationX, translationY } = nativeEvent;
      let direction;
      if (Math.abs(translationX) > Math.abs(translationY)) {
        direction = translationX > 0 ? 'right' : 'left';
      } else {
        direction = translationY > 0 ? 'down' : 'up';
      }

      const newSequence = [...gestureSequence, direction].slice(-5);
      setGestureSequence(newSequence);
      if (newSequence.join(' ') === 'up up down left right') {
        setGestureSequence([]);
        resetAndNavigate('DeliveryLogin');
      }
    }
  };
  return (
    // <GestureHandlerRootView style={styles.container}>
    <View style={styles.container}>
      <CustomSafeAreaView>
        <ProductSlider />
        <PanGestureHandler onHandlerStateChange={handleGesture}>
          <Animated.ScrollView
            style={{ transform: [{ translateY: animatedValue }] }}
            bounces={false}
            keyboardDismissMode={'on-drag'}
            keyboardShouldPersistTaps={'handled'}
            contentContainerStyle={styles.subContainer}
          >
            <LinearGradient colors={bottomColors} style={styles.gradient} />
            <View style={styles.content}>
              <Image
                source={require('@assets/images/logo.jpeg')}
                style={styles.logo}
              />
              <CustomText variant="h2" fontFamily="">
                Grocery Delivery App
              </CustomText>
              <CustomText variant="h5" fontFamily={''}>
                Log in or sing up
              </CustomText>
              <CustomInput
                onChangeText={text => setPhoneNumber(text.slice(0, 10))}
                onClear={() => setPhoneNumber('')}
                value={phoneNumber}
                placeholder="Enter phone number"
                inputMode="numeric"
                left={
                  <CustomText
                    style={styles.phoneText}
                    variant="h6"
                    fontFamily={Fonts.SemiBold}
                  >
                    +91
                  </CustomText>
                }
              />
              <CustomButton
                title="Continue"
                onPress={handleSendOtp}
                disabled={phoneNumber?.length != 10}
                loading={loading}
              />
            </View>
          </Animated.ScrollView>
        </PanGestureHandler>
      </CustomSafeAreaView>

      <View style={styles.footer}>
        {/* <SafeAreaView /> */}
        <CustomText fonSize={RFValue(6)}>
          By continuing, you agree to our Terms of service & Privacy
        </CustomText>
        {/* <SafeAreaView /> */}
      </View>

      <TouchableOpacity
        onPress={() => resetAndNavigate('DeliveryLogin')}
        style={styles.deliveryLoginBtn}
      >
        <MaterialCommunityIcon
          name="bike-fast"
          color={'#000'}
          size={RFValue(18)}
        />
      </TouchableOpacity>
    </View>
    // </GestureHandlerRootView>
  );
};

export default CustomerLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
  footer: {
    borderTopWidth: 0.8,
    borderColor: Colors.border,
    paddingBottom: 10,
    zIndex: 22,
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f9fc',
    width: '100%',
  },
  gradient: {
    width: '100%',
    paddingTop: 60,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 20,
    marginVertical: 10,
  },
  text: {
    marginTop: 2,
    marginBottom: 25,
    opacity: 0.8,
  },
  phoneText: {
    marginLeft: 10,
  },
  deliveryLoginBtn: {
    position: 'absolute',
    top: 40,
    right: 10,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    zIndex: 99,
    backgroundColor: '#fff',
  },
});
