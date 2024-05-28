import React from 'react'
import { useColorScheme, useWindowDimensions } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import DrawerScreen from './DrawerScreen';
import AppStack from './AppStack';
import { customColors } from '../Config/helper';


const AppDrawer = () => {
    const Drawer = createDrawerNavigator();
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
    const scheme = useColorScheme();
    const colors = customColors[scheme === 'dark' ? 'dark' : 'light'];

    return (
        <Drawer.Navigator
            drawerContent={(props) => <DrawerScreen {...props} />}
            screenOptions={{
                drawerType: isLargeScreen ? 'permanent' : 'front',
                drawerStyle: {
                    backgroundColor: colors.background === "#000000" ? colors.black : '#c6cbef',
                    width: "70%",
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

