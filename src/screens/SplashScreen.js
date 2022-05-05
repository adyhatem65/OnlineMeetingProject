import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {useTheme} from '../contexts/ThemeProvider';

const SplashScreen = ({navigation}) => {
  const {theme} = useTheme();

  useEffect(() => {
    setTimeout(() => {
      navigation.replace('HomeStack');
    }, 2000);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.background,
      }}>
      <Text style={{fontSize: 20, fontStyle: 'italic', color: theme.text}}>
        Splash
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default SplashScreen;
