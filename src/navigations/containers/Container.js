import React from 'react';

import {NavigationContainer} from '@react-navigation/native';

const Container = ({children}) => {
  return <NavigationContainer>{children}</NavigationContainer>;
};

export default Container;
