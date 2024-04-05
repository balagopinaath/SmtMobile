import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import CustomIcon from '../Components/CustomIcon'
import Fonts from '../Config/Fonts'
import Colors from '../Config/Colors'

const LoginScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.login}>Login</Text>
            {/* <CustomIcon name="user" size={30} color="green" /> */}
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    login: {
        fontFamily: Fonts.plusJakartaSansRegular,
        fontSize: 32,
        color: Colors.secondary
    }
});