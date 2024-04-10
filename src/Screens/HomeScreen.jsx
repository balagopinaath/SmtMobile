import { View, Text, StyleSheet, TouchableOpacity, Button, StatusBar } from 'react-native'
import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Endpoint from '../Config/Endpoint';
import { useNavigation } from '@react-navigation/native'
import CustomIcon from '../Components/CustomIcon';
import Colors from '../Config/Colors';
import Fonts from '../Config/Fonts';

const HomeScreen = () => {
    const navigation = useNavigation();

    useEffect(() => { }, [])

    const logout = async () => {
        try {
            const session = JSON.parse(await AsyncStorage.getItem('loginResponse'));
            const userId = await AsyncStorage.getItem('UserId');
            const token = await AsyncStorage.getItem('userToken');
            console.log(`User= ${userId}, Token= ${token}, Session= ${{ ...session }}`);

            if (!userId || !session || !token) {
                console.warn('Missing required data for logout. User may already be logged out.');
                return;
            }

            const response = await fetch(`${Endpoint}/api/logout?userid=${userId}&sessionId=${session.SessionId}`, {
                method: 'PUT',
                headers: { 'Authorization': token }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.status === 'Success') {
                    AsyncStorage.clear();
                    navigation.replace("StartScreen")
                } else {
                    console.error('Logout failed:', data.message);
                }
            } else {
                console.error('Failed to logout:', response.statusText);
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Colors.primary} />
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Welcome, admin!</Text>
                <TouchableOpacity onPress={logout}>
                    <CustomIcon styles={styles.logoutButton} name="logout" color={Colors.white} size={20} />
                </TouchableOpacity>
            </View>


            <View style={styles.TopContainer}>
                <View>
                    <Text style={styles.ContainerHeading}>Forum's</Text>
                </View>
                <View style={styles.ContainerAction}>
                    <TouchableOpacity style={styles.actionButton} onPress={() => { navigation.push('Customers') }}>
                        <CustomIcon name="library" color={Colors.white} size={25} />
                        <Text style={styles.actionButtonText}>Get</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton} onPress={() => { navigation.push('AddCustomer') }}>
                        <CustomIcon name="plus" color={Colors.white} size={25} />
                        <Text style={styles.actionButtonText}>Add</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <CustomIcon name="backspace-outline" color={Colors.white} size={23} />
                        <Text style={styles.actionButtonText}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <CustomIcon name="account-check-outline" color={Colors.white} size={25} />
                        <Text style={styles.actionButtonText}>Order</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <CustomIcon name="map-marker" color={Colors.white} size={25} />
                        <Text style={styles.actionButtonText}>Routes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <CustomIcon name="account-check-outline" color={Colors.white} size={25} />
                        <Text style={styles.actionButtonText}>Order</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: Colors.primary,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.white
    },
    logoutButton: {
        backgroundColor: 'transparent', // Remove default button background
        padding: 0, // Remove default button padding
    },

    TopContainer: {
        borderColor: Colors.black,
        borderRadius: 30,
        borderWidth: 1,
        height: "50%",
        padding: 15,
        margin: 15,
    },

    ContainerHeading: {
        fontFamily: Fonts.plusJakartaSansMedium,
        fontSize: 20,
    },
    ContainerAction: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },

    actionButton: {
        width: "25%",
        height: "20%",
        backgroundColor: Colors.primary,
        padding: 10,
        marginVertical: 10,
        marginHorizontal: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    actionButtonText: {
        color: Colors.white,
        marginTop: 5,
    },

});