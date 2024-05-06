import { Image, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign'; // Ensure you have linked this library
import AsyncStorage from '@react-native-async-storage/async-storage';

const DrawerScreen = ({ navigation }) => {

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('UserId');
            await AsyncStorage.removeItem('userName');
            await AsyncStorage.removeItem('Name');
            await AsyncStorage.removeItem('UserType');
            await AsyncStorage.removeItem('branchId');
            await AsyncStorage.removeItem('branchName');
            await AsyncStorage.removeItem('userType');
            await AsyncStorage.removeItem('userTypeId');
            ToastAndroid.show('Log out Successfully', ToastAndroid.SHORT);
            navigation.navigate("LoginScreen");
        } catch (e) {
            console.error('Error clearing AsyncStorage:', e);
        }
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            {/* User profile image (optional) */}
            <View style={{ alignItems: 'center', marginVertical: 10 }}>
                <Image
                    source={{ uri: 'https://img.freepik.com/free-psd/3d-rendering-avatar_23-2150833562.jpg?t=st=1714973719~exp=1714977319~hmac=b38dd421ab9645d53faf8619446c5aba90e335bde5eb4c1605a725e7bc8753f6&w=740' }} // Replace with image source
                    style={{ width: 80, height: 80, borderRadius: 40 }}
                />
                <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
                    SalesApp
                </Text>
            </View>
            <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>Sales Person 1</Text>

            {/* Navigation drawer items */}
            <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => navigation.navigate('HomeScreen')}
            >
                <Icon name="home" size={20} color="#000" />
                <Text style={styles.drawerText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => navigation.navigate('Customers')} // Assuming "Customers" is correct screen name
            >
                <Icon name="team" size={20} color="#000" />
                <Text style={styles.drawerText}>Retailers</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => navigation.navigate('AddCustomer')}
            >
                <Icon name="adduser" size={20} color="#000" />
                <Text style={styles.drawerText}>Add Retailers</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => navigation.navigate('AttendanceInfo')}
            >
                <Icon name="calendar" size={20} color="#000" />
                <Text style={styles.drawerText}>Attendance</Text>
            </TouchableOpacity>

            {/* Logout button */}
            <TouchableOpacity
                style={[styles.drawerItem, { borderTopWidth: 1 }]}
                onPress={logout} // Make sure there's a Logout screen or handle this appropriately
            >
                <Icon name="logout" size={20} color="red" />
                <Text style={[styles.drawerText, { color: 'red' }]}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

export default DrawerScreen;

const styles = StyleSheet.create({
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    drawerText: {
        fontSize: 16,
        marginLeft: 15, // Space between icon and text
    },
});
