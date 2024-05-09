import { Image, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/AntDesign'; // Ensure you have linked this library
import AsyncStorage from '@react-native-async-storage/async-storage';

const DrawerScreen = ({ navigation }) => {
    const [name, setName] = useState('')
    const [uType, setUType] = useState('')

    useEffect(() => {
        (async () => {
            try {
                const userName = await AsyncStorage.getItem('Name');
                const UserType = await AsyncStorage.getItem('UserType');
                setName(userName)
                setUType(UserType)
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
            ToastAndroid.show('Log out Successfully', ToastAndroid.SHORT);
            navigation.navigate("LoginScreen");
        } catch (e) {
            console.error('Error clearing AsyncStorage:', e);
        }
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <View style={{ alignItems: 'center', marginVertical: 10 }}>
                <Image
                    source={{ uri: 'https://img.freepik.com/free-psd/3d-rendering-avatar_23-2150833562.jpg?t=st=1714973719~exp=1714977319~hmac=b38dd421ab9645d53faf8619446c5aba90e335bde5eb4c1605a725e7bc8753f6&w=740' }} // Replace with image source
                    style={{ width: 80, height: 80, borderRadius: 40 }}
                />
            </View>
            <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>{name}</Text>

            <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => navigation.navigate('HomeScreen')}
            >
                <Icon name="home" size={20} color="#000" />
                <Text style={styles.drawerText}>Home</Text>
            </TouchableOpacity>


            {uType === 'SALES PERSON' &&
                <View>
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
                </View>
            }

            <TouchableOpacity
                style={[styles.drawerItem, { borderTopWidth: 1 }]}
                onPress={logout}
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
        marginLeft: 15,
    },
});
