import { View, Text, StyleSheet, ToastAndroid, Alert, TextInput, TouchableOpacity, StatusBar } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'react-native-crypto-js';
import Icon from 'react-native-vector-icons/FontAwesome';
import Fonts from '../Config/Fonts'
import Colors from '../Config/Colors'

const LoginScreen = () => {
    const navigation = useNavigation();
    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");

    const loginFunction = async () => {
        if (loginId && password) {
            try {
                const passHash = CryptoJS.AES.encrypt(password, 'ly4@&gr$vnh905RyB>?%#@-(KSMT').toString();

                const response = await fetch(`http://192.168.1.10:9001/api/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        UserName: loginId,
                        Password: passHash
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch');
                }

                const data = await response.json();

                if (data.success) {
                    await AsyncStorage.setItem('userToken', data.data[0].Autheticate_Id);
                    await setData(data);
                    navigation.replace("HomeScreen");
                } else {
                    Alert.alert(data);
                }
            } catch (error) {
                console.error('Error during login:', error);
                Alert.alert('Failed to log in. Please try again.');
            }
        } else {
            if (!loginId || loginId === '') {
                ToastAndroid.show('Enter valid user id', ToastAndroid.LONG)
            }
            else if (!password || password === '') {
                ToastAndroid.show('Enter Password', ToastAndroid.LONG)
            }
        }
    }

    const setData = async (data) => {
        try {
            await AsyncStorage.setItem('userToken', data.data[0].Autheticate_Id);
            await AsyncStorage.setItem('UserId', data.data[0].UserId);
            await AsyncStorage.setItem('userName', data.data[0].UserName);
            await AsyncStorage.setItem('Name', data.data[0].Name);
            await AsyncStorage.setItem('UserType', data.data[0].UserType);
            await AsyncStorage.setItem('branchId', String(data.data[0].BranchId));
            await AsyncStorage.setItem('branchName', data.data[0].BranchName);
            await AsyncStorage.setItem('userType', data.data[0].UserType);
            await AsyncStorage.setItem('userTypeId', data.data[0].UserTypeId);
            // console.log('Data stored successfully.');
        } catch (e) {
            console.error('Error storing data:', e);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Colors.primary} />
            <Text style={styles.title}>Welcome to Shri Foods Sales App</Text>

            <Text style={styles.subtitle}>Let's start to manage your attendance more effectively with us!</Text>

            <View style={styles.inputContainer}>
                <Icon name="mobile-phone" size={25} style={styles.inputIcon} color={Colors.accent} ></Icon>
                <TextInput
                    style={styles.textInput}
                    textAlign='left'
                    placeholder='Enter your Mobile Number'
                    value={loginId}
                    onChangeText={(val) => setLoginId(val)}
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.inputContainer}>
                <Icon name="lock" size={25} style={styles.inputIcon} color={Colors.accent} ></Icon>
                <TextInput
                    style={styles.textInput}
                    placeholder='Enter your Password'
                    value={password}
                    onChangeText={(val) => setPassword(val)}
                    inlineImageLeft='user_icon'
                    secureTextEntry={true}
                    autoCapitalize="none"
                />
            </View>

            <TouchableOpacity style={styles.loginButton} onPressOut={loginFunction} >
                <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Colors.background,
        padding: 20
    },
    title: {
        fontFamily: Fonts.plusJakartaSansSemiBold,
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontFamily: Fonts.plusJakartaSansMedium,
        fontSize: 16,
        color: '#777',
        marginBottom: 40,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.secondary,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    inputIcon: {
        marginRight: 12.5,
    },
    textInput: {
        flex: 1,
        fontFamily: Fonts.plusJakartaSansMedium,
        fontSize: 16,
        marginLeft: 2.5
    },
    loginButton: {
        backgroundColor: Colors.accent,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        borderRadius: 10
    },
    loginButtonText: {
        color: Colors.white,
        fontSize: 18
    }
});