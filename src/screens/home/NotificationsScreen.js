import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';

import {ThemeContext, useTheme} from '../../contexts/ThemeProvider';

// import NotificationSounds from 'react-native-notification-sounds';

import NotificationService from '../../NotificationsServices/NotificationService';

const NotificationsScreen = ({route, navigation}) => {
  const {theme, toggleTheme} = useTheme();

  const {token} = route.params;

  const sendNotification = async () => {
    const notificationData = {
      title: 'test fcm notification',
      body: 'test fcm body wooooooooooooooooooooooooooooooooooow',
      token: token,
      // 'dHaBfbhKQR6hOaAX60w23A:APA91bF9AZLAV7y_sairsbVK6naqm9b7-vUpSyOdf5jVOsLK81IMp1y2IwDyKuZHILWdPB_H0bnIlPzGR36i4kTLYebD9cZdmrxD3cpUY7bhUORxfgoKVIKJhOQSq4AGXS1WGydV84TI', // put device token here (get it from database)
      theme: theme, // small icon color
    };
    await NotificationService.sendSingleDeviceNotification(notificationData);
  };

  const sendMultiNotification = async () => {
    const notificationData = {
      title: 'test multi device fcm notification',
      body: 'test multi device fcm body wooooooooooooooooooooooooooooooooooow',
      tokens: [
        token,
        // 'dHaBfbhKQR6hOaAX60w23A:APA91bF9AZLAV7y_sairsbVK6naqm9b7-vUpSyOdf5jVOsLK81IMp1y2IwDyKuZHILWdPB_H0bnIlPzGR36i4kTLYebD9cZdmrxD3cpUY7bhUORxfgoKVIKJhOQSq4AGXS1WGydV84TI', // put device token here (get it from database)
      ],
      theme: theme, // small icon color
    };
    await NotificationService.sendMultiDeviceNotification(notificationData);
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Button
        title="Send Remote Single Device Notification"
        onPress={() => sendNotification()}
      />
      <View style={{height: 50}} />
      <Button
        title="Send Remote Multi Device Notification"
        onPress={() => sendMultiNotification()}
      />
      <View style={{height: 50}} />
      <Button
        title="Send Local Notification"
        onPress={() => NotificationService.displayLocalNotification(theme)}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default NotificationsScreen;
