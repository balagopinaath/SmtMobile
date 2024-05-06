import React from 'react'
import { useWindowDimensions } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import DrawerScreen from './DrawerScreen';
import AppStack from './AppStack';


const AppDrawer = () => {
    const Drawer = createDrawerNavigator();
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;

    return (
        <Drawer.Navigator
            drawerContent={(props) => <DrawerScreen {...props} />}
            screenOptions={{
                drawerType: isLargeScreen ? 'permanent' : 'front',
                drawerStyle: {
                    backgroundColor: '#c6cbef',
                    width: "65%",
                },
                // overlayColor: 'transparent',
                headerShown: false,
            }}
        >
            <Drawer.Screen name="AppStack" component={AppStack} />
        </Drawer.Navigator>
    )
}

export default AppDrawer

