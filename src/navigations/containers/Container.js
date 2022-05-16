import React, {useEffect} from 'react';

import {NavigationContainer} from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {useTheme} from '../../contexts/ThemeProvider';

import {useDarkMode} from 'react-native-dark-mode';

const Container = ({children}) => {
  const {theme, toggleTheme} = useTheme();

  const isDarkMode = useDarkMode();

  const getSystemTheme = async () => {
    let index = await AsyncStorage.getItem('index');
    index = JSON.parse(index);
    if (index == 2) {
      if (isDarkMode) {
        toggleTheme('default');
        await AsyncStorage.setItem('index', JSON.stringify(2));
      } else {
        toggleTheme('dark');
        await AsyncStorage.setItem('index', JSON.stringify(2));
      }
    }
  };

  useEffect(() => {
    getSystemTheme();
  }, [isDarkMode]);

  return <NavigationContainer>{children}</NavigationContainer>;
};

export default Container;
