import React from 'react';

import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

import SplashScreen from '../../screens/SplashScreen';

const Stack = createStackNavigator();

const SplashStack = ({navigation}) => {
  return (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{
        animationEnabled: true,
        gestureEnabled: true,
        ...TransitionPresets.SlideFromRightIOS,
      }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
    </Stack.Navigator>
  );
};

export default SplashStack;
