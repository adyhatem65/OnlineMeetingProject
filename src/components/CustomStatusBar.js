import React from 'react';
import {View, Text, StatusBar} from 'react-native';

import {useTheme} from '../contexts/ThemeProvider';

const CustomStatusBar = () => {
  const {theme} = useTheme();
  const themeMode = theme.themeMode;
  const background = theme.background;

  const barStyle = themeMode === 'default' ? 'dark-content' : 'light-content';

  return <StatusBar backgroundColor={background} barStyle={barStyle} />;
};

export default CustomStatusBar;
