import { View, Text, StyleSheet, ToastAndroid, Alert, TextInput, TouchableOpacity, StatusBar, useColorScheme } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'react-native-crypto-js';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API } from '../Config/Endpoint';
import { storeInfo } from '../Config/AuthContext';
import { customColors, typography } from '../Config/helper';

const LoginScreen = () => {
    const { setAuthInfo } = storeInfo();
    const navigation = useNavigation();
    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [userId, setUserId] = useState("");
    const scheme = useColorScheme();
    const colors = customColors[scheme === 'dark' ? 'dark' : 'light'];

    const loginFunction = async () => {
        if (loginId && password) {
            try {
                const passHash = CryptoJS.AES.encrypt(password, 'ly4@&gr$vnh905RyB>?%#@-(KSMT').toString();

                const response = await fetch(API.login, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: loginId,
                        password: password
                    })
                });

                const data = await response.json();
                console.log('data', data)

                if (data.success) {
                    await AsyncStorage.setItem('userToken', data.user.Autheticate_Id);
                    await setData(data.user);
                    setAuthInfo(data.user);
                    if (Number(data.user.UserTypeId) === Number(6)) {
                        checkAttendanceHistory(data.user.UserId);
                    } else {
                        navigation.replace("HomeScreen");
                    }
                } else {
                    Alert.alert(data.message);
                }
            } catch (error) {
                console.error('Error during login:', error);
                Alert.alert(data.message);
            }
        } else {
            if (!loginId) {
                ToastAndroid.show('Enter valid user id', ToastAndroid.LONG)
            }
            else if (!password) {
                ToastAndroid.show('Enter Password', ToastAndroid.LONG)
            }
        }
    }

    const checkAttendanceHistory = async (userId) => {
        console.log(`${API.MyLastAttendance}${userId}`)
        try {
            const response = await fetch(`${API.MyLastAttendance}${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const attendanceHistory = await response.json();
            console.log('att data', attendanceHistory.message)

            if (attendanceHistory.data.length === 0) {
                navigation.replace("Attendance");
            } else {
                const activeStatus = attendanceHistory.data[0]?.Active_Status;
                if (activeStatus && Number(activeStatus) === 0) {
                    navigation.replace("Attendance");
                } else {
                    navigation.replace("HomeScreen");
                }
            }
        } catch (error) {
            console.log("Error fetching attendance data:", error);
        }
    };

    const setData = async (data) => {
        try {
            await AsyncStorage.setItem('userToken', data.Autheticate_Id);
            await AsyncStorage.setItem('UserId', data.UserId);
            await AsyncStorage.setItem('Company_Id', String(data.Company_id));
            await AsyncStorage.setItem('userName', data.UserName);
            await AsyncStorage.setItem('Name', data.Name);
            await AsyncStorage.setItem('UserType', data.UserType);
            await AsyncStorage.setItem('branchId', String(data.BranchId));
            await AsyncStorage.setItem('branchName', data.BranchName);
            await AsyncStorage.setItem('userType', data.UserType);
            await AsyncStorage.setItem('userTypeId', data.UserTypeId);
            setUserId(data.UserId)
        } catch (e) {
            console.error('Error storing data:', e);
        }
    };

    return (
        <View style={styles(colors).container}>
            <StatusBar backgroundColor={colors.primary} />
            <Text style={styles(colors).title} maxFontSizeMultiplier={1.2}>Welcome to Sales App</Text>

            <Text style={styles(colors).subtitle} maxFontSizeMultiplier={1.2}>Let's start to manage your attendance more effectively with us!</Text>

            <View style={styles(colors).inputContainer}>
                <Icon name="mobile-phone" size={25} style={styles(colors).inputIcon} color={colors.accent} ></Icon>
                <TextInput
                    maxFontSizeMultiplier={1.2}
                    style={styles(colors).textInput}
                    textAlign='left'
                    placeholder='Enter your Mobile Number'
                    value={loginId}
                    onChangeText={(val) => setLoginId(val)}
                    autoCapitalize="none"
                />
            </View>

            <View style={styles(colors).inputContainer}>
                <Icon name="lock" size={25} style={styles(colors).inputIcon} color={colors.accent} ></Icon>
                <TextInput
                    maxFontSizeMultiplier={1.2}
                    style={styles(colors).textInput}
                    placeholder='Enter your Password'
                    value={password}
                    onChangeText={(val) => setPassword(val)}
                    inlineImageLeft='user_icon'
                    secureTextEntry={true}
                    autoCapitalize="none"
                />
            </View>

            <TouchableOpacity style={styles(colors).loginButton} onPressOut={loginFunction} >
                <Text style={styles(colors).loginButtonText} maxFontSizeMultiplier={1.2}>Login</Text>
            </TouchableOpacity>
        </View>
    )
}

export default LoginScreen

const styles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: colors.background,
        padding: 20
    },
    title: {
        ...typography.h2(colors),
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        ...typography.h6(colors),
        color: '#777',
        marginBottom: 40,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.secondary,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    inputIcon: {
        marginRight: 12.5,
    },
    textInput: {
        flex: 1,
        ...typography.h6(colors),
        fontSize: 16,
        marginLeft: 2.5
    },
    loginButton: {
        backgroundColor: colors.accent,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        borderRadius: 10
    },
    loginButtonText: {
        ...typography.h5(colors),
        color: colors.white,
    }
});