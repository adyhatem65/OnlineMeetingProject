import React, {useState, useEffect} from 'react';

import messaging from '@react-native-firebase/messaging';

import {useNavigation} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

import HomeStack from '../navigators/HomeStack';
import SplashStack from '../navigators/SplashStack';
import SettingStack from '../navigators/SettingStack';

const Stack = createStackNavigator();

const ContainerStack = ({navigation}) => {
  // const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('SplashStack');

  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    // messaging().onNotificationOpenedApp(remoteMessage => {
    //   console.log(
    //     'Notification caused app to open from background state:',
    //     remoteMessage.notification,
    //   );
    //   navigation.navigate(remoteMessage.data.type);
    // });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          alert(
            'Notification caused app to open from quit state && navigating to settings screen',
          );
          setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
        setLoading(false);
      });
  }, []);

  if (loading) {
    return null;
  }

  return (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{
        animationEnabled: true,
        gestureEnabled: true,
        ...TransitionPresets.SlideFromRightIOS,
      }}
      initialRouteName={initialRoute}>
      <Stack.Screen name="SplashStack" component={SplashStack} />
      <Stack.Screen name="HomeStack" component={HomeStack} />
      <Stack.Screen name="SettingStack" component={SettingStack} />
    </Stack.Navigator>
  );
};

export default ContainerStack;
