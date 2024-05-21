import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/AntDesign';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import { customColors, typography } from '../Config/helper';
import { API } from '../Config/Endpoint';
import AttendanceInfo from './attendance/AttendanceInfo';

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
                <TouchableOpacity>
                    <Icon name="bells" color={customColors.white} size={23} />
                </TouchableOpacity>
            </View>

            <AttendanceInfo />

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Customers')}>
                    <Icon name="team" size={35} color={customColors.accent} />
                    <Text style={styles.buttonText}>Retailers</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RetailerVisit')}>
                    <IconMaterial name="call-made" size={35} color={customColors.accent} />
                    <Text style={styles.buttonText}>Visit Entry</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AttendanceReport')}>
                    <Icon name="filetext1" size={35} color={customColors.accent} />
                    <Text style={styles.buttonText}>Attendance Report</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('StockInfo')}>
                    <Icon name="checksquareo" size={35} color={customColors.accent} />
                    <Text style={styles.buttonText}>Stock Report</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RetailerLog')}>
                    <Icon name="filetext1" size={35} color={customColors.accent} />
                    <Text style={styles.buttonText}>Visited Report</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Orders')}>
                    <IconMaterial name="sale" size={35} color={customColors.accent} />
                    <Text style={styles.buttonText}>Sale Order</Text>
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
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: customColors.primary,
    },
    headerText: {
        ...typography.h5,
        color: customColors.white,
        flex: 1,
        marginHorizontal: 10,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 20,
        marginHorizontal: 15,
    },
    button: {
        width: '30%',
        alignItems: 'center',
        paddingVertical: 15,
        marginBottom: 20,
    },
    buttonText: {
        ...typography.body1,
        color: customColors.text,
        textAlign: 'center',
        fontWeight: '700',
        marginTop: 10,
    },
});