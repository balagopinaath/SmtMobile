import React from 'react'
import { NavigationContainer } from '@react-navigation/native';

import AppDrawer from './Routes/AppDrawer';
import AppStack from './Routes/AppStack';

const App = () => {
  return (
    <NavigationContainer>
      {/* <AppStack /> */}
      <AppDrawer />
    </NavigationContainer>
  );
};

export default App