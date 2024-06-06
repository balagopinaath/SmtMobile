import { Image, StyleSheet, Text, ToastAndroid, TouchableOpacity, View, useColorScheme } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/AntDesign'; // Ensure you have linked this library
import AsyncStorage from '@react-native-async-storage/async-storage';
import { customColors, typography } from '../Config/helper';
import { CommonActions, StackActions } from '@react-navigation/native';

const DrawerScreen = ({ navigation }) => {
    const [name, setName] = useState('')
    const [userTypeId, setUserTypeId] = useState('')
    const scheme = useColorScheme();
    const colors = customColors[scheme === 'dark' ? 'dark' : 'light'];

    useEffect(() => {
        (async () => {
            try {
                const userName = await AsyncStorage.getItem('Name');
                const userTypeId = await AsyncStorage.getItem('userTypeId');
                setName(userName)
                setUserTypeId(userTypeId)
            } catch (err) {
                console.log(err);
            }
        })();
    }, []);

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('Autheticate_Id');
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('UserId');
            await AsyncStorage.removeItem('userName');
            await AsyncStorage.removeItem('Name');
            await AsyncStorage.removeItem('UserType');
            await AsyncStorage.removeItem('branchId');
            await AsyncStorage.removeItem('branchName');
            await AsyncStorage.removeItem('userTypeId');
            ToastAndroid.show('Log out Successfully', ToastAndroid.LONG);

            navigation.dispatch(CommonActions.reset({
                index: 0,
                routes: [{ name: 'LoginScreen' }],
            }));
            navigation.closeDrawer();
        } catch (e) {
            console.error('Error clearing AsyncStorage:', e);
        }
    };

    return (
        <View style={styles(colors).drawerContainer}>

            <TouchableOpacity
                style={styles(colors).drawerItem}
                onPress={() => navigation.navigate('ProfileScreen')}
            >
                <Icon name="user" size={20} color={colors.background === "#000000" ? colors.white : colors.black} />
                <Text style={styles(colors).drawerText}>My Account</Text>
            </TouchableOpacity>

            <View>
                <TouchableOpacity
                    style={styles(colors).drawerItem}
                    onPress={() => navigation.navigate('Customers')}
                >
                    <Icon name="team" size={20} color={colors.background === "#000000" ? colors.white : colors.black} />
                    <Text style={styles(colors).drawerText}>Retailers List</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles(colors).drawerItem}
                    onPress={() => navigation.navigate('AttendanceReport')}
                >
                    <Icon name="filetext1" size={20} color={colors.background === "#000000" ? colors.white : colors.black} />
                    <Text style={styles(colors).drawerText}>Attendance Report</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles(colors).drawerItem}
                    onPress={() => navigation.navigate('RetailerLog')}
                >
                    <Icon name="filetext1" size={20} color={colors.background === "#000000" ? colors.white : colors.black} />
                    <Text style={styles(colors).drawerText}>Visited Report</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={[styles(colors).drawerItem, { borderTopWidth: 1 }]}
                onPress={logout}
            >
                <Icon name="logout" size={20} color="red" />
                <Text style={[styles(colors).drawerText, { color: 'red' }]}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

export default DrawerScreen;

const styles = (colors) => StyleSheet.create({
    drawerContainer: {
        flex: 1,
        padding: 20,
        marginTop: 125,
    },
    profileImgContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    profileImg: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    profileName: {
        ...typography.h5(colors),
        textAlign: 'center',
        fontWeight: '700',
    },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 0.75,
        borderColor: colors.secondary,
    },
    drawerText: {
        ...typography.h6(colors),
        marginLeft: 15,
    },
});
