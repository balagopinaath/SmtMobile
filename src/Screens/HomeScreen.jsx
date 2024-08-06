import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image, useColorScheme, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/AntDesign';
import { customColors, typography } from '../Config/helper';
import { API } from '../Config/Endpoint';
import AttendanceInfo from './attendance/AttendanceInfo';

const HomeScreen = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('')
    const scheme = useColorScheme();
    const colors = customColors[scheme === 'dark' ? 'dark' : 'light'];

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
        <View style={styles(colors).container}>
            <StatusBar backgroundColor={colors.primary} />

            <View style={styles(colors).headerContainer}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Icon name="menuunfold" color={colors.white} size={23} />
                </TouchableOpacity>
                <Text style={styles(colors).headerText} maxFontSizeMultiplier={1.2}>Welcome, {name}!</Text>
                <TouchableOpacity>
                    <Icon name="bells" color={colors.white} size={23} />
                </TouchableOpacity>
            </View>

            <ScrollView>
                <AttendanceInfo />

                <View style={styles(colors).buttonContainer}>
                    <TouchableOpacity style={styles(colors).button} onPress={() => navigation.navigate('Customers')}>
                        <Image
                            style={styles(colors).tinyLogo}
                            source={require('../../assets/images/retailer.png')}
                        />
                        <Text style={styles(colors).buttonText} maxFontSizeMultiplier={1.2}>Retailers</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles(colors).button} onPress={() => navigation.navigate('RetailerVisit')}>
                        <Image
                            style={styles(colors).tinyLogo}
                            source={require('../../assets/images/entry.png')}
                        />
                        <Text style={styles(colors).buttonText} maxFontSizeMultiplier={1.2}>Visit Log</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles(colors).button} onPress={() => navigation.navigate('Orders')}>
                        <Image
                            style={styles(colors).tinyLogo}
                            source={require('../../assets/images/sale.png')}
                        />
                        <Text style={styles(colors).buttonText} maxFontSizeMultiplier={1.2}>Sale Order</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles(colors).button} onPress={() => navigation.navigate('StockInfo')}>
                        <Image
                            style={styles(colors).tinyLogo}
                            source={require('../../assets/images/stock.png')}
                        />
                        <Text style={styles(colors).buttonText} maxFontSizeMultiplier={1.2}>Stock List</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles(colors).button} onPress={() => navigation.navigate('RetailerLog')}>
                        <Image
                            style={styles(colors).tinyLogo}
                            source={require('../../assets/images/visitLog.png')}
                        />
                        <Text style={styles(colors).buttonText} maxFontSizeMultiplier={1.2}>Visited List</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles(colors).button} onPress={() => navigation.navigate('OrderPreview')}>
                        <Image
                            style={styles(colors).tinyLogo}
                            source={require('../../assets/images/sale-report.png')}
                        />
                        <Text style={styles(colors).buttonText} maxFontSizeMultiplier={1.2}>Order List</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles(colors).button} onPress={() => navigation.navigate('AttendanceReport')}>
                        <Image
                            style={styles(colors).tinyLogo}
                            source={require('../../assets/images/attendance.png')}
                        />
                        <Text style={styles(colors).buttonText} maxFontSizeMultiplier={1.2}>Attendance List</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles(colors).button} onPress={() => navigation.navigate("RetailerMapView")}>
                        <Image
                            style={styles(colors).tinyLogo}
                            source={require('../../assets/images/pin.png')}
                        />
                        <Text style={styles(colors).buttonText} maxFontSizeMultiplier={1.2}>MapView</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles(colors).button} onPress={() => navigation.navigate("Delivery")}>
                        <Image
                            style={styles(colors).tinyLogo}
                            source={require('../../assets/images/pin.png')}
                        />
                        <Text style={styles(colors).buttonText} maxFontSizeMultiplier={1.2}>Delivery</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

        </View >
    )
}

export default HomeScreen

const styles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        // alignItems: 'center'
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: colors.primary,
    },
    headerText: {
        ...typography.h5(colors),
        color: colors.white,
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
        ...typography.body1(colors),
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: 10,
    },
    tinyLogo: {
        width: 45,
        height: 45,
    }
});