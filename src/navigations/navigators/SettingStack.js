import React from 'react';

import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

import Settings from '../../screens/settings/Settings';
import ChooseTheme from '../../screens/settings/ChooseTheme';

const Stack = createStackNavigator();

const SettingStack = ({navigation}) => {
  return (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{
        animationEnabled: true,
        gestureEnabled: true,
        ...TransitionPresets.SlideFromRightIOS,
      }}>
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="ChooseTheme" component={ChooseTheme} />
    </Stack.Navigator>
  );
};

export default SettingStack;
