import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import StartScreen from '../Screens/StartScreen';
import LoginScreen from '../Screens/LoginScreen';
import HomeScreen from '../Screens/HomeScreen';
import Customers from '../Screens/retailers/Customers';
import CustomersDetails from '../Screens/retailers/CustomersDetails';
import AddCustomer from '../Screens/retailers/AddCustomer';
import EditCustomer from '../Screens/retailers/EditCustomer';
import Attendance from '../Screens/attendance/Attendance';
import OpenCamera from '../Components/OpenCamera';
import EndDay from '../Screens/attendance/EndDay';
import StockClosing from '../Screens/StockClosing';
import AttendanceInfo from '../Screens/attendance/AttendanceInfo';
import RetailerVisit from '../Screens/retailers/RetailerVisit';
import RetailerVisitLog from '../Screens/reports/RetailerVisitLog';
import AttendanceReport from '../Screens/reports/AttendanceReport';
import { customColors, typography } from '../Config/helper';
import StockInfo from '../Screens/reports/StockInfo';
import SaleOrder from '../Screens/sales/SaleOrder';
import OrderPreview from '../Screens/reports/OrderPreview';
import { useColorScheme } from 'react-native';
import ProfileScreen from '../Screens/ProfileScreen';
import RetailerMapView from '../Screens/RetailerMapView';
import SaleReturn from '../Screens/sales/SaleReturn';
import Delivery from '../Screens/delivery/Delivery';

const Stack = createStackNavigator();

const AppStack = () => {
    const scheme = useColorScheme();
    const colors = customColors[scheme === 'dark' ? 'dark' : 'light'];

    return (
        <Stack.Navigator
            initialRouteName="StartScreen"
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: colors.primary,
                },
                headerTintColor: colors.white,
                headerTitleStyle: {
                    ...typography.h5(colors),
                    fontWeight: '600',
                    color: colors.white,
                },
            }}>
            <Stack.Screen name="StartScreen" component={StartScreen} options={{ headerShown: false }} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ title: 'Profile Details', }} />

            <Stack.Screen name="Customers" component={Customers} options={{ title: 'Retailers', }} />
            <Stack.Screen name="CustomersDetails" component={CustomersDetails} options={{ title: 'Retailer Details' }} />
            <Stack.Screen name="AddCustomer" component={AddCustomer} />
            <Stack.Screen name="EditCustomer" component={EditCustomer} />
            <Stack.Screen name="RetailerVisit" component={RetailerVisit} options={{ title: 'Retailer Visit' }} />

            <Stack.Screen name="RetailerLog" component={RetailerVisitLog} options={{ title: 'Retailer Visit Log' }} />
            <Stack.Screen name="StockInfo" component={StockInfo} options={{ title: 'Stock List' }} />
            <Stack.Screen name="AttendanceReport" component={AttendanceReport} options={{ title: 'Attendance Report' }} />

            <Stack.Screen name="AttendanceInfo" component={AttendanceInfo} />
            <Stack.Screen name="Attendance" component={Attendance} />
            <Stack.Screen name="EndDay" component={EndDay} options={{ title: 'Close Attendance' }} />

            <Stack.Screen name="OpenCamera" component={OpenCamera} />
            <Stack.Screen name="StockClosing" component={StockClosing} options={{ headerShown: false }} />

            <Stack.Screen name="Orders" component={SaleOrder} options={{ headerShown: false }} />
            <Stack.Screen name="OrderPreview" component={OrderPreview} options={{ title: "My Sales" }} />

            <Stack.Screen name="RetailerMapView" component={RetailerMapView} options={{ title: "Retailers" }} />
            <Stack.Screen name="SaleReturn" component={SaleReturn} options={{ title: "Sales Return" }} />

            <Stack.Screen name="Delivery" component={Delivery} options={{ title: "Delivery" }} />

        </Stack.Navigator>
    );
}

export default AppStack;
