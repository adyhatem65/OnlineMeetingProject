import React from 'react';

import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

import HomeStack from '../navigators/HomeStack';
import SplashStack from '../navigators/SplashStack';
import SettingStack from '../navigators/SettingStack';

const Stack = createStackNavigator();

const ContainerStack = () => {
  return (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{
        animationEnabled: true,
        gestureEnabled: true,
        ...TransitionPresets.SlideFromRightIOS,
      }}>
      <Stack.Screen name="SplashStack" component={SplashStack} />
      <Stack.Screen name="HomeStack" component={HomeStack} />
      <Stack.Screen name="SettingStack" component={SettingStack} />
    </Stack.Navigator>
  );
};

export default ContainerStack;
