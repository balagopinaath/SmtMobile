import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Endpoint from '../Config/Endpoint';
import { useNavigation } from '@react-navigation/native'

const HomeScreen = () => {
    const navigation = useNavigation();

    const logout = async () => {
        try {
            const session = JSON.parse(await AsyncStorage.getItem('loginResponse'));
            const userId = await AsyncStorage.getItem('UserId');
            const token = await AsyncStorage.getItem('userToken');
            console.log(`User= ${userId}, Token= ${token}, Session= ${{ ...session }}`);

            if (!userId || !session || !token) {
                console.log(`User= ${userId}, Token= ${token}, Session= ${session}`);
                console.error('Missing required data for logout');
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
                    // setLogin(false);
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
            <Text>Home</Text>
            <TouchableOpacity onPressOut={logout}>
                <Text>Logout</Text>
            </TouchableOpacity>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});