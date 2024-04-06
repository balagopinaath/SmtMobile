import { View, Text, StyleSheet, ToastAndroid, StatusBar, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomIcon from '../Components/CustomIcon'
import Fonts from '../Config/Fonts'
import Colors from '../Config/Colors'
import Endpoint from '../Config/Endpoint'

const LoginScreen = () => {
    const navigation = useNavigation();
    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [visible, setVisible] = useState(false);

    const loginFunction = async () => {
        if (loginId && password) {
            try {
                const response = await fetch(`${Endpoint}api/login?user=${loginId}&pass=${password}`, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch');
                }

                const data = await response.json();

                if (data.status === 'Success') {
                    console.log('data', data);
                    await setData(data);
                    navigation.replace("HomeScreen");
                } else {
                    alert(data);
                }
            } catch (error) {
                console.error('Error during login:', error);
                alert('Failed to log in. Please try again.');
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
            await AsyncStorage.setItem('userToken', data.user.Autheticate_Id);
            await AsyncStorage.setItem('Name', data.user.Name);
            await AsyncStorage.setItem('UserType', data.user.UserType);
            await AsyncStorage.setItem('UserId', data.user.UserId);
            await AsyncStorage.setItem('branchId', String(data.user.BranchId));
            await AsyncStorage.setItem('loginResponse', JSON.stringify(data.sessionInfo));
            await AsyncStorage.setItem('uType', data.user.UserTypeId);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Colors.black} />
            <Text style={styles.title}>Welcome to SMT</Text>

            <Text style={styles.subtitle}>Let's start to manage your attendance more effectively with us!</Text>

            <View style={styles.inputContainer}>
                <CustomIcon name="logout" size={25} style={styles.inputIcon} color={Colors.accent} />
                <TextInput
                    style={styles.textInput}
                    textAlign='left'
                    placeholder='Enter your UserId'
                    value={loginId}
                    onChangeText={(val) => setLoginId(val)}
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.inputContainer}>
                <CustomIcon name="lock" size={25} style={styles.inputIcon} color={Colors.accent} />
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
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff', // White input fields
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    inputIcon: {
        marginRight: 10,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
    },
    loginButton: {
        backgroundColor: Colors.accent,
        padding: 15,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        borderRadius: 30
    },
    loginButtonText: {
        color: Colors.secondary,
        fontSize: 18
    }
});