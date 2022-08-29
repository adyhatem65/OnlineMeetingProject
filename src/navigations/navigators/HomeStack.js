import React from 'react';

import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

import HomeScreen from '../../screens/home/HomeScreen';
import RoomScreen from '../../screens/home/RoomScreen';
import NotificationsScreen from '../../screens/home/NotificationsScreen';

const Stack = createStackNavigator();

const HomeStack = ({navigation}) => {
  return (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{
        animationEnabled: true,
        gestureEnabled: true,
        ...TransitionPresets.SlideFromRightIOS,
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="Room"
        component={RoomScreen}
        options={{
          animationEnabled: true,
          gestureEnabled: true,
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }}
      />
      <Stack.Screen
        name="NotificationsScreen"
        component={NotificationsScreen}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
