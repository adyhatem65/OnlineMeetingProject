import React from 'react';

import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

import HomeScreen from '../../screens/home/HomeScreen';
import RoomScreen from '../../screens/home/RoomScreen';

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
      <Stack.Screen name="Room" component={RoomScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;
