import React from 'react'
import type { PropsWithChildren } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './Screens/Home';
import Login from './Screens/Login';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: 'Login to SMT' }}
        />

        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: 'SMT' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App