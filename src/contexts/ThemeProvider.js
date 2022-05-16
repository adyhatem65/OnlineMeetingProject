import React, {createContext, useContext, useEffect, useState} from 'react';
// import {useColorScheme, Appearance} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {defaultTheme, darkTheme} from '../constants/Theme';

import {useDarkMode} from 'react-native-dark-mode';

export const ThemeContext = createContext();

const ThemeProvider = ({children}) => {
  const [theme, setTheme] = useState(defaultTheme);
  const [isLoadingTheme, setIsLoadingTheme] = useState(true);

  // const colorScheme = useColorScheme();

  const isDarkMode = useDarkMode();

  const getTheme = async () => {
    let theme = await AsyncStorage.getItem('theme');

    if (theme == null) {
      theme = defaultTheme;
    } else {
      theme = JSON.parse(theme);
    }

    setTheme(theme);
    setIsLoadingTheme(false);
  };

  const storeTheme = async theme => {
    await AsyncStorage.setItem('theme', JSON.stringify(theme));
  };

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
    getTheme();
    getSystemTheme();
  }, []);

  const toggleTheme = async currentThemeMode => {
    const newTheme = currentThemeMode === 'default' ? darkTheme : defaultTheme;
    setTheme(newTheme);
    storeTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{theme, isLoadingTheme, toggleTheme}}>
      {isLoadingTheme ? null : children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeProvider;
