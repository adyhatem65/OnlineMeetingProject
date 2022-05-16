import React from 'react';

import Container from './src/navigations/containers/Container';
import ContainerStack from './src/navigations/containers/ContainerStack';

import HmsProvider from './src/contexts/HmsProvider';
import ThemeProvider from './src/contexts/ThemeProvider';

// Custom StatusBar
import CustomStatusBar from './src/components/CustomStatusBar';

// Test new branch
const App = () => {
  return (
    <ThemeProvider>
      <HmsProvider>
        <Container>
          <CustomStatusBar />
          <ContainerStack />
        </Container>
      </HmsProvider>
    </ThemeProvider>
  );
};

export default App;
