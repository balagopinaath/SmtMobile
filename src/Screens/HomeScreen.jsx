import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/AntDesign';
import { customColors, customFonts } from '../Config/helper';

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
            <StatusBar backgroundColor={customColors.primary} />
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Icon name="menuunfold" color={customColors.white} size={20} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Welcome, {name}!</Text>
            </View>

            <View style={styles.ContainerAction}>

                <TouchableOpacity onPress={() => navigation.navigate('RetailerVisit')}>
                    <Text>Call log</Text>
                </TouchableOpacity>

            </View>

        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: customColors.background,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: customColors.primary,
    },
    headerText: {
        textAlign: 'center',
        fontFamily: customFonts.plusJakartaSansBold,
        fontSize: 18,
        color: customColors.white,
        marginLeft: 15,
    },
    ContainerAction: {
        marginHorizontal: 25,
        marginVertical: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },

});