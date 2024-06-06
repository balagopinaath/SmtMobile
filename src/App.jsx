import React from 'react'
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useColorScheme } from 'react-native';

import AppDrawer from './Routes/AppDrawer';
import { AuthProvider } from './Config/AuthContext';

let navigation;
export const navigationRef = React.createRef();

export const navigate = (name, params) => {
  navigationRef.current?.navigate(name, params);
};

export const setTopLevelNavigator = (navigatorRef) => {
  navigation = navigatorRef;
};

const App = () => {
  const scheme = useColorScheme();

  return (
    <AuthProvider>
      <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme} ref={navigationRef} onReady={() => setTopLevelNavigator(navigationRef)}>
        <AppDrawer />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App