import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import StartScreen from '../Screens/StartScreen';
import LoginScreen from '../Screens/LoginScreen';
import HomeScreen from '../Screens/HomeScreen';
import Customers from '../Screens/Customers';
import CustomersDetails from '../Screens/CustomersDetails';
import AddCustomer from '../Screens/AddCustomer';
import EditCustomer from '../Screens/EditCustomer';
import Attendance from '../Screens/Attendance';
import OpenCamera from '../Components/OpenCamera';
import EndDay from '../Screens/EndDay';
import StockClosing from '../Screens/StockClosing';
import AttendanceInfo from '../Screens/AttendanceInfo';
import RetailerVisit from '../Screens/RetailerVisit';

const Stack = createStackNavigator();

const AppStack = () => {
    return (
        <Stack.Navigator initialRouteName="StartScreen" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="StartScreen" component={StartScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="Customers" component={Customers} />
            <Stack.Screen name="CustomersDetails" component={CustomersDetails} />
            <Stack.Screen name="AddCustomer" component={AddCustomer} />
            <Stack.Screen name="EditCustomer" component={EditCustomer} />
            <Stack.Screen name="RetailerVisit" component={RetailerVisit} />
            <Stack.Screen name="Attendance" component={Attendance} />
            <Stack.Screen name="AttendanceInfo" component={AttendanceInfo} />
            <Stack.Screen name="OpenCamera" component={OpenCamera} />
            <Stack.Screen name="EndDay" component={EndDay} />
            <Stack.Screen name="StockClosing" component={StockClosing} />
        </Stack.Navigator>
    );
}

export default AppStack;
