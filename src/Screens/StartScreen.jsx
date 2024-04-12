import { View, Text, StyleSheet, StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../Config/Colors';
import Fonts from '../Config/Fonts';

const StartScreen = () => {
    const navigation = useNavigation();
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            checkUserToken();
        }, 2500)
    }, []);

    const checkUserToken = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');

            if (token !== null) {
                setLoggedIn(true);
            } else {
                setLoggedIn(false);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false); // Mark loading as complete after token retrieval
        }
    };

    useEffect(() => {
        if (!loading) {
            if (loggedIn) {
                navigation.replace('HomeScreen');
            } else {
                navigation.replace('LoginScreen');
            }
        }
    }, [loggedIn, loading, navigation]);

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Colors.primary} />
            <Text style={styles.logo}>SMT</Text>
        </View>
    );
};

export default StartScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        fontSize: 32,
        color: Colors.primary,
        fontFamily: Fonts.plusJakartaSansExtraBold
    }
});
