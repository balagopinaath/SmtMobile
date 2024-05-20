import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Button, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/AntDesign';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import { customColors, customFonts } from '../Config/helper';
import { API } from '../Config/Endpoint';
import AttendanceInfo from './attendance/AttendanceInfo';
import { Dropdown } from 'react-native-element-dropdown';

const HomeScreen = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('')

    useEffect(() => {
        (async () => {
            try {
                const userName = await AsyncStorage.getItem('Name');
                const UserId = await AsyncStorage.getItem('UserId');
                setName(userName)
                getAttendanceHistory(UserId)
            } catch (err) {
                console.log(err);
            }
        })();
    }, []);

    const getAttendanceHistory = async (userId) => {
        try {
            const url = `${API.MyLastAttendance}${userId}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const attendanceHistory = await response.json();

            if (attendanceHistory.data.length > 0) {
                // console.log('attendanceHistory', attendanceHistory)
            }
        } catch (error) {
            console.log("Error fetching attendance data:", error);
        }
    }


    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={customColors.primary} />

            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Icon name="menuunfold" color={customColors.white} size={23} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Welcome, {name}!</Text>
            </View>

            <AttendanceInfo />

            <View style={styles.functionalities}>
                <TouchableOpacity style={styles.functionality} onPress={() => navigation.navigate('Customers')}>
                    <Icon name="team" size={35} color={customColors.accent} />
                    <Text style={styles.functionalityText}>Retailers</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.functionality} onPress={() => navigation.navigate('RetailerVisit')}>
                    <IconMaterial name="call-made" size={35} color={customColors.accent} />
                    <Text style={styles.functionalityText}>Visit Entry</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.functionality} onPress={() => navigation.navigate('AttendanceReport')}>
                    <Icon name="filetext1" size={35} color={customColors.accent} />
                    <Text style={styles.functionalityText}>Attendance Report</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.functionality} onPress={() => navigation.navigate('StockInfo')}>
                    <Icon name="checksquareo" size={35} color={customColors.accent} />
                    <Text style={styles.functionalityText}>Stock Report</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.functionality} onPress={() => navigation.navigate('RetailerLog')}>
                    <Icon name="filetext1" size={35} color={customColors.accent} />
                    <Text style={styles.functionalityText}>Visited Report</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.functionality} onPress={() => navigation.navigate('Orders')}>
                    <IconMaterial name="sale" size={35} color={customColors.accent} />
                    <Text style={styles.functionalityText}>Sale Order</Text>
                </TouchableOpacity>
            </View>

        </View >
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
        // justifyContent: 'space-around',
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
    functionalities: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 20,
        borderWidth: 2.5,
        borderColor: customColors.secondary,
        borderRadius: 15,
        margin: 15,
    },
    functionality: {
        width: '30%',
        aspectRatio: 1,
        alignItems: 'center',
        paddingVertical: 25,
        marginBottom: 20,
    },
    functionalityText: {
        color: customColors.text,
        fontFamily: customFonts.plusJakartaSansSemiBold,
        fontSize: 14.5,
        fontWeight: '700',
        textAlign: 'center',
        marginTop: 10,
    },


});