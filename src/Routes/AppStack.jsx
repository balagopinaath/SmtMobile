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
import RetailerVisitLog from '../Screens/RetailerVisitLog';
import AttendanceReport from '../Screens/AttendanceReport';
import { customColors, customFonts } from '../Config/helper';
import StockInfo from '../Screens/StockInfo';

const Stack = createStackNavigator();

const AppStack = () => {
    return (
        <Stack.Navigator initialRouteName="StartScreen" screenOptions={{
            headerShown: true,
            headerStyle: {
                backgroundColor: customColors.primary,
            },
            headerTintColor: customColors.white,
            headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 18,
                fontFamily: customFonts.plusJakartaSansBold
            },
        }}>
            <Stack.Screen name="StartScreen" component={StartScreen} options={{ headerShown: false }} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Customers" component={Customers} options={{ title: 'Retailers' }} />
            <Stack.Screen name="CustomersDetails" component={CustomersDetails} options={{ title: 'Retailer Details' }} />
            <Stack.Screen name="AddCustomer" component={AddCustomer} />
            <Stack.Screen name="EditCustomer" component={EditCustomer} />
            <Stack.Screen name="RetailerVisit" component={RetailerVisit} options={{ title: 'Retailer Visit' }} />
            <Stack.Screen name="RetailerLog" component={RetailerVisitLog} options={{ title: 'Retailer Visit Log' }} />

            <Stack.Screen name="Attendance" component={Attendance} />
            <Stack.Screen name="AttendanceInfo" component={AttendanceInfo} />
            <Stack.Screen name="AttendanceReport" component={AttendanceReport} options={{ title: 'Attendance Report' }} />

            <Stack.Screen name="OpenCamera" component={OpenCamera} />
            <Stack.Screen name="EndDay" component={EndDay} options={{ title: 'Close Attendance' }} />
            <Stack.Screen name="StockClosing" component={StockClosing} options={{ title: 'Closing Stock' }} />
            <Stack.Screen name="StockInfo" component={StockInfo} options={{ title: 'Closing Stock Report' }} />
        </Stack.Navigator>
    );
}

export default AppStack;
