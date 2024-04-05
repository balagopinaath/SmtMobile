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

            <ScrollView>
                <View style={{ alignItems: "center" }}>
                    <Text style={styles.welcome}>Welcome to <Text style={styles.logo}>SMT</Text></Text>

                    <Text style={styles.subtitle}>To get started, log in to your account!</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <CustomIcon name="user" size={30} color="green" />
                    <TextInput
                        textAlign='left'
                        placeholder='Enter your UserId'
                        value={loginId}
                        onChangeText={(val) => setLoginId(val)}
                    />
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <CustomIcon name="lock" size={30} color="green" />
                    <TextInput
                        inputMode='text'
                        textAlign='center'
                        placeholder='Enter your Password'
                        value={password}
                        onChangeText={(val) => setPassword(val)}
                        inlineImageLeft='user_icon'
                    />
                </View>

                <TouchableOpacity activeOpacity={0.9} onPressOut={loginFunction} style={styles.loginButton}>
                    <Text>Login</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background
    },
    welcome: {
        fontFamily: Fonts.plusJakartaSansSemiBold,
        fontSize: 32,
        color: Colors.text
    },
    logo: {
        fontFamily: Fonts.plusJakartaSansSemiBold,
        fontSize: 32,
        color: Colors.primary
    },
    subtitle: {
        fontFamily: Fonts.plusJakartaSansMedium,
        fontSize: 18,
        color: Colors.text
    },
    loginButton: {}
});