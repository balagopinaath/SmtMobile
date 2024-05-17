import React from 'react'
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';

import AppDrawer from './Routes/AppDrawer';
import AppStack from './Routes/AppStack';

let navigation;
export const navigationRef = React.createRef();

export const navigate = (name, params) => {
  navigationRef.current?.navigate(name, params);
};

export const setTopLevelNavigator = (navigatorRef) => {
  navigation = navigatorRef;
};

const App = () => {
  return (
    <NavigationContainer ref={navigationRef} onReady={() => setTopLevelNavigator(navigationRef)}>
      {/* <AppStack /> */}
      <AppDrawer />
    </NavigationContainer>
  );
};

export default App