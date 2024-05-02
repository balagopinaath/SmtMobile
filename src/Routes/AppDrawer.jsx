import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AddCustomer from '../Screens/AddCustomer';

const Drawer = createDrawerNavigator();


const AppDrawer = () => {
    return (
        <Drawer.Navigator>
            <Drawer.Screen name="AddCustomer" component={AddCustomer} />
        </Drawer.Navigator>
    )
}

export default AppDrawer

