// imports
import React from 'react';
import {AppState} from 'react-native';

// Notifee
import notifee, {
  AndroidCategory,
  AndroidImportance,
  AndroidStyle,
  EventType,
} from '@notifee/react-native';

import NotificationSounds from 'react-native-notification-sounds';
import messaging from '@react-native-firebase/messaging';

// Send notifications to single device
const sendSingleDeviceNotification = data => {
  var axios = require('axios');
  var data = JSON.stringify({
    priority: 'HIGH',
    data: {
      type: 'SettingStack',
    },
    notification: {
      body: data.body,
      title: data.title,
      icon: 'ic_stat_name',
      color: data.theme.primary,
      // sound: 'droplets',
      // default_sound: true,
      // default_vibrate_timings: true,
      notification_priority:
        messaging.NotificationAndroidPriority.PRIORITY_HIGH,
      visibility: messaging.NotificationAndroidVisibility.VISIBILITY_PUBLIC,
    },
    to: data.token,
  });

  var config = {
    method: 'post',
    url: 'https://fcm.googleapis.com/fcm/send',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        'key=AAAAAAsOhJg:APA91bHq_i3CKgjbSiSdlPlYqPZTSMbPkVnNkrkp6fgcKq160lixDrKzIiy_3VmR5ifm1n7CmV-VwcOyKB5CDTDy897k5EjwiocuJPSykr-KNDeGea4RTwLI1P1yHkqBZzCSqRDhg8QD',
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};

// ==========================================================================

// Send notifications to multi devices
const sendMultiDeviceNotification = data => {
  var axios = require('axios');
  var data = JSON.stringify({
    priority: 'HIGH',
    data: {
      type: 'SettingStack',
    },
    notification: {
      body: data.body,
      title: data.title,
      icon: 'ic_stat_name',
      color: data.theme.primary,
      // sound: 'droplets',
      // default_sound: true,
      // default_vibrate_timings: true,
      notification_priority:
        messaging.NotificationAndroidPriority.PRIORITY_HIGH,
      visibility: messaging.NotificationAndroidVisibility.VISIBILITY_PUBLIC,
    },
    registration_ids: data.tokens,
  });

  var config = {
    method: 'post',
    url: 'https://fcm.googleapis.com/fcm/send',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        'key=AAAAAAsOhJg:APA91bHq_i3CKgjbSiSdlPlYqPZTSMbPkVnNkrkp6fgcKq160lixDrKzIiy_3VmR5ifm1n7CmV-VwcOyKB5CDTDy897k5EjwiocuJPSykr-KNDeGea4RTwLI1P1yHkqBZzCSqRDhg8QD',
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};

// ==========================================================================

// Display remote notification
async function displayRemoteNotification(title, body, theme) {
  const soundsList = await NotificationSounds.getNotifications('notification');
  // Create a channel
  const channelId = await notifee.createChannel({
    id: 'sound',
    name: 'Default Channel',
    sound: 'droplets',
    // sound: soundsList[0].url,
    vibration: true,
    // vibrationPattern: [300, 500],
    importance: AndroidImportance.HIGH,
  });

  await notifee.requestPermission();

  // Display a notification
  await notifee.displayNotification({
    id: '123',
    title: title,
    body: body,
    android: {
      channelId,
      smallIcon: 'ic_stat_name', // optional, defaults to 'ic_launcher'.
      color: theme.primary,
      pressAction: {
        id: 'open-app',
        launchActivity: 'default',
      },
      // sound: 'droplets',
      // category: AndroidCategory.EVENT,
      // importance: AndroidImportance.HIGH,
    },
  });

  // if the app in "active" mode (app is opened) we will not showing the notifications( cencel all notifications)
  setTimeout(() => {
    if (AppState.currentState == 'active') {
      notifee.cancelAllNotifications();
    }
  }, 1000);
}

// ==========================================================================

// Display local notification
async function displayLocalNotification(theme) {
  const soundsList = await NotificationSounds.getNotifications('notification');
  // Create a channel
  const channelId = await notifee.createChannel({
    id: 'sound',
    name: 'Default Channel',
    sound: 'droplets',
    // sound: soundsList[0].url,
    vibration: true,
    // vibrationPattern: [300, 500],
    importance: AndroidImportance.HIGH,
  });

  await notifee.requestPermission();

  // Display a notification
  await notifee.displayNotification({
    id: '567',
    title: 'Notification Title',
    body: 'Main body content of the notification',
    android: {
      channelId,
      smallIcon: 'ic_stat_name', // optional, defaults to 'ic_launcher'.
      color: theme.primary,
      pressAction: {
        id: 'open-app',
        launchActivity: 'default',
      },
      // sound: 'droplets',
      // category: AndroidCategory.EVENT,
      // importance: AndroidImportance.HIGH,
    },
  });

  // if the app in "active" mode (app is opened) we will not showing the notifications( cencel all notifications)
  // setTimeout(() => {
  //   if (AppState.currentState == 'active') {
  //     notifee.cancelAllNotifications();
  //   }
  // }, 1000);

  // Display styled notification (change appearnce)
  // notifee.displayNotification({
  //   title:
  //     '<p style="color: #4caf50;"><b>Styled HTMLTitle</span></p></b></p> &#128576;',
  //   subtitle: '&#129395;',
  //   body: 'The body can <p style="color: #ffffff; background-color: #9c27b0"><i>styled too</i></p> &#127881;!',
  //   android: {
  //     channelId,
  //     color: '#4caf50',
  //     actions: [
  //       {
  //         title: '<b>Dance</b> &#128111;',
  //         pressAction: {id: 'dance'},
  //       },
  //       {
  //         title: '<p style="color: #f44336;"><b>Cry</b> &#128557;</p>',
  //         pressAction: {id: 'cry'},
  //       },
  //     ],
  //     style: {
  //       type: AndroidStyle.BIGTEXT, //
  //       text: 'My name is ady hatem othman my name is ady hatem othman my name is ady hatem othman', // if we type this line we ignore the body from the top
  //     },
  //   },
  // });
}

export default {
  sendSingleDeviceNotification,
  sendMultiDeviceNotification,
  displayRemoteNotification,
  displayLocalNotification,
};
