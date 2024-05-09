import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/AntDesign';
import Colors from '../Config/Colors';
import Fonts from '../Config/Fonts';

const HomeScreen = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('')

    useEffect(() => {
        (async () => {
            try {
                const userName = await AsyncStorage.getItem('Name');
                setName(userName)
            } catch (err) {
                console.log(err);
            }
        })();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Colors.primary} />
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Icon name="menuunfold" color={Colors.white} size={20} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Welcome, {name}!</Text>
            </View>

            <View style={styles.ContainerAction}>

            </View>

        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: Colors.primary,
    },
    headerText: {
        textAlign: 'center',
        fontFamily: Fonts.plusJakartaSansBold,
        fontSize: 18,
        color: Colors.white,
        marginLeft: 15,
    },
    ContainerAction: {
        flexDirection: 'row',
        marginHorizontal: 25,
        marginVertical: 25,
        justifyContent: 'space-between'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    actionButton: {
        width: '40%',
        flexDirection: 'row',
        backgroundColor: Colors.accent,
        borderRadius: 10,
        padding: 15,
        marginBottom: 25,
    },
    actionButtonText: {
        fontFamily: Fonts.plusJakartaSansMedium,
        fontSize: 16,
        color: Colors.white,
        marginLeft: 10,
    },
});