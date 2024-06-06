import { View, Text, StyleSheet, StatusBar, useColorScheme } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { customColors, typography } from '../Config/helper';

const StartScreen = () => {
    const navigation = useNavigation();
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const scheme = useColorScheme();
    const colors = customColors[scheme === 'dark' ? 'dark' : 'light'];

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
            setLoading(false);
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
        <View style={styles(colors).container}>
            <StatusBar backgroundColor={colors.primary} />
            <Text style={styles(colors).logo} maxFontSizeMultiplier={1.2}>Pukal Virpanai</Text>
        </View>
    );
};

export default StartScreen;

const styles = (colors) => StyleSheet.create({
    container: {
        backgroundColor: colors.background === "#000000" ? colors.black : colors.white,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        ...typography.h1(colors),
        color: colors.primary,
    }
});
