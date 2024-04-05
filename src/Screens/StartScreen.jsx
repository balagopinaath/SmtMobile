import { View, Text, StyleSheet, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Colors from '../Config/Colors'

const StartScreen = () => {
    const navigation = useNavigation();
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            checkUserToken()
        }, 2000)
    }, []);

    useEffect(() => {
        if (loggedIn) {
            navigation.replace('HomeScreen');
        } else {
            navigation.replace('LoginScreen');
        }
    }, [loggedIn, navigation])

    const checkUserToken = async () => {
        const token = await AsyncStorage.getItem('userToken');
        console.log("launch token : ", token)

        try {
            if (token != null) {
                setLoggedIn(true);
            } else {
                setLoggedIn(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Colors.black} />
            <Text style={styles.logo}>SMT</Text>
        </View>
    )
}

export default StartScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        fontSize: 32,
        color: "green"
    }
})
