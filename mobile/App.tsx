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
import { useEffect } from 'react';

import {
  getMessaging,
  onMessage,
  onTokenRefresh,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';
import {
  displayNotification,
  requestNotifications,
  saveFcmToken,
} from '@services/notifications';
import { setNotificationHandler } from '@services/notificationHelpers';

setNotificationHandler();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    const messaging = getMessaging();

    //Register background hanlder
    setBackgroundMessageHandler(messaging, async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
      await displayNotification(remoteMessage);
    });
    const unsubscribe = onMessage(messaging, async remoteMessage => {
      await displayNotification(remoteMessage);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const messaging = getMessaging();
    let tokenRefreshUnsubscribe: any;

    const registerFcmDevice = async () => {
      await saveFcmToken();

      tokenRefreshUnsubscribe = onTokenRefresh(messaging, async () => {
        await saveFcmToken();
      });

      return tokenRefreshUnsubscribe;
    };

    registerFcmDevice();

    return () => {
      if (tokenRefreshUnsubscribe) {
        tokenRefreshUnsubscribe();
      }
    };
  }, []);

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

        <Navigation />
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

export default App;
