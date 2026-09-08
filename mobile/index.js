/**
 * @format
 */

import { AppRegistry, Text, TextInput } from 'react-native';
import App from './App';
import App1 from './App1';
import { name as appName } from './app.json';

import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import {
  getMessaging,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';

const messaging = getMessaging();
// Register background handler
setBackgroundMessageHandler(messaging, async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

// Disable automatic font scaling globally for Text and TextInput components.
// This prevents text size from changing based on the device's system font-size settings.

if (Text.defaultProps) {
  Text.defaultProps.allowFontScaling = false;
} else {
  Text.defaultProps = {};
  Text.defaultProps.allowFontScaling = false;
}

if (TextInput.defaultProps) {
  TextInput.defaultProps.allowFontScaling = false;
} else {
  TextInput.defaultProps = {};
  TextInput.defaultProps.allowFontScaling = false;
}

AppRegistry.registerComponent(appName, () => App1);
