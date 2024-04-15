import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import StartScreen from './Screens/StartScreen';
import LoginScreen from './Screens/LoginScreen';
import HomeScreen from './Screens/HomeScreen';
import Customers from './Screens/Customers';
import CustomersDetails from './Screens/CustomersDetails';
import AddCustomer from './Screens/AddCustomer';
import OpenCamera from './Components/OpenCamera';
import EditCustomer from './Screens/EditCustomer';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="StartScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="StartScreen" component={StartScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />

        <Stack.Screen name="Customers" component={Customers} />
        <Stack.Screen name="CustomersDetails" component={CustomersDetails} />
        <Stack.Screen name="AddCustomer" component={AddCustomer} />
        <Stack.Screen name="EditCustomer" component={EditCustomer} />
        <Stack.Screen name="OpenCamera" component={OpenCamera} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App