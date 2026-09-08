/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-gesture-handler';
import { NewAppScreen } from '@react-native/new-app-screen';
import {
  Alert,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Navigation from '@navigation/Navigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import {
  getPlatFormVersion,
  isAndroid,
  isIos,
  requestNotificationPermissions,
  setNotificationHandler,
} from '@services/notificationHelpers';
import { openSettings } from 'react-native-permissions';
import SplashScreen from '@features/auth/SplashScreen';
import { getMessaging } from '@react-native-firebase/messaging';
import { tokenStorage } from '@state/storage';

function App1() {
  const isDarkMode = useColorScheme() === 'dark';

  //for ios
  const [isHeadLess, setIsHeadLess] = useState(() =>
    Platform.OS === 'ios' ? true : false,
  );

  useEffect(() => {
    getMessaging()
      .getIsHeadless()
      .then(isHeadLess => {
        setIsHeadLess(isHeadLess);
      });
  }, []);

  useEffect(() => {
    if (isIos() || (isAndroid() && getPlatFormVersion() >= 33)) {
      requestNotificationPermissions(
        () => {
          //notification granted tasks
          console.log('Notification Permission Granted.');
        },
        () => {
          //notification denied tasks
          Alert.alert(
            'Permissions Required',
            'Notification permission is required to receive updates regarding your order status.',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Ok',
                onPress: () => openSettings(),
              },
            ],
          );
        },
      );
    }
  }, []);

  useEffect(() => {
    const accessToken = tokenStorage.getString('accessToken');
    if (!accessToken) {
      console.log('Please Login');
      return;
    }
    let unsubscribe: any;

    const setNotifications = async () => {
      unsubscribe = await setNotificationHandler();
    };

    setNotifications();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

        {isHeadLess ? null : <Navigation />}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={safeAreaInsets}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App1;
