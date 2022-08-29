/**
 * @format
 */

import 'react-native-gesture-handler';
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// To handle background notifications
import notifee, {EventType} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

notifee.onBackgroundEvent(async ({type, detail}) => {
  const {notification, pressAction} = detail;

  // Check if the user pressed the "Mark as read" action
  if (type === EventType.ACTION_PRESS && pressAction.id === 'mark-as-read') {
    // Remove the notification
    await notifee.cancelNotification(notification.id);
  }
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  // here we can erform network requests, update local storage etc...
});

AppRegistry.registerComponent(appName, () => App);
