import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { use, useState } from 'react';
import { deliveryLogin } from '../../services/authServices';
import { resetAndNavigate } from '@utils/NavigationUtils';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import { screenHeight } from '@utils/Scaling';
import LottieView from 'lottie-react-native';
import CustomText from '@components/ui/CustomText';
import { Fonts } from '@utils/Constants';
import CustomInput from '@components/ui/CustomInput';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomButton from '@components/ui/CustomButton';
import { syncFcmToken } from '@services/notification.services';

const DeliveryLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await deliveryLogin(email, password);
      await syncFcmToken();
      resetAndNavigate('DeliveryDashboard');
    } catch (error: any) {
      Alert.alert('Login Failed', error?.message ?? error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomSafeAreaView>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={styles.container}>
          <View style={styles.lottieContainer}>
            <LottieView
              autoPlay
              loop
              style={styles.lottie}
              source={require('@assets/animations/delivery_man.json')}
              hardwareAccelerationAndroid
            />
          </View>

          <CustomText variant="h3" fontFamily={Fonts.Bold}>
            Delivery Partner Portal
          </CustomText>
          <CustomText variant="h6" style={styles.text} fontFamily={Fonts.Bold}>
            Faster than Flash⚡
          </CustomText>

          <CustomInput
            onChangeText={setEmail}
            value={email}
            left={
              <IonIcon
                name="mail"
                color={'#f8890e'}
                style={{ marginLeft: 10 }}
                size={RFValue(18)}
              />
            }
            placeholder="Email"
            inputMode="email"
            right={false}
          />
          <CustomInput
            onChangeText={setPassword}
            value={password}
            left={
              <IonIcon
                name="key-sharp"
                color={'#f8890e'}
                style={{ marginLeft: 10 }}
                size={RFValue(18)}
              />
            }
            placeholder="Password"
            secureTextEntry
            right={false}
          />

          <CustomButton
            disabled={email?.length === 0 || password?.length < 8}
            title="Login"
            onPress={handleLogin}
            loading={loading}
          />
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  );
};

export default DeliveryLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  lottie: {
    height: '100%',
    width: '100%',
  },
  lottieContainer: {
    height: screenHeight * 0.12,
    width: '100%',
  },
  text: {
    marginTop: 2,
    marginBottom: 25,
    opacity: 0.8,
  },
});
