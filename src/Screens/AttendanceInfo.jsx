import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../Config/Colors';
import Fonts from '../Config/Fonts';
import { API } from '../Config/Endpoint';

const AttendanceInfo = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('')
    const [userId, setUserId] = useState('')
    const [userType, setUserType] = useState('')
    const [activeStatus, setActiveStatus] = useState(0)
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    useEffect(() => {
        const loadUserDetails = async () => {
            try {
                const userName = await AsyncStorage.getItem('Name');
                const UserId = await AsyncStorage.getItem('UserId');
                const UserType = await AsyncStorage.getItem('UserType');
                setName(userName || '');
                setUserId(UserId || '');
                setUserType(UserType || '');
            } catch (err) {
                console.log(err);
            }
        };

        loadUserDetails();
    }, []);

    useEffect(() => {
        if (userId) {
            getAttendanceInfo(userId);
            getAttendanceHistory(userId);
        }
    }, [userId]);

    const getAttendanceInfo = async (userId) => {
        try {
            const url = `${API.myTodayAttendance}${userId}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const attendanceStatus = await response.json();
            if (attendanceStatus.data.length > 0) {
                const lastAttendance = attendanceStatus.data[attendanceStatus.data.length - 1];
                const lastStartDate = lastAttendance.Start_Date;
                const [datePart, timePart] = lastStartDate.split('T');
                setActiveStatus(attendanceStatus.data[0].Active_Status)
                setDate(datePart);
                setTime(timePart.substring(0, 8));
            }
        } catch (error) {
            console.log("Error fetching attendance data:", error);
        }
    };

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
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="angle-left" color={Colors.white} size={20} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Attendance</Text>
            </View>

            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Today Attendance</Text>
                    <Button
                        disabled={Number(activeStatus) === Number(1)}
                        color={Colors.primary}
                        onPress={() => { navigation.navigate('Attendance') }}
                        title='Start Day'
                    />
                </View>

                {/* Content */}
                <View style={styles.cardContent}>
                    <View style={styles.cardItem}>
                        <View style={styles.itemIcon}>
                            <Icon name="clock-o" color={Colors.black} size={20} />
                            <Text style={styles.text}>Date</Text>
                        </View>
                        <Text style={styles.text}>{date}</Text>
                    </View>

                    <View style={styles.cardItem}>
                        <View style={styles.itemIcon}>
                            <Icon name="calendar-o" color={Colors.black} size={20} />
                            <Text style={styles.text}>Time In</Text>
                        </View>
                        <Text style={styles.text}>{time}</Text>
                    </View>

                    <View style={styles.cardItem}>
                        <View style={styles.itemIcon}>
                            <Icon name="clock-o" color={Colors.black} size={20} />
                            <Text style={styles.text}>Day End</Text>
                        </View>
                        <Text style={styles.text}>-: -: -</Text>
                    </View>

                    <View style={styles.cardItem}>
                        <View style={styles.itemIcon}>
                            <Icon name="calendar-o" color={Colors.black} size={20} />
                            <Text style={styles.text}>Time Out</Text>
                        </View>
                        <Text style={styles.text}>-: -: -</Text>
                    </View>
                </View>


                <Button
                    disabled={Number(activeStatus) === Number(0)}
                    color={Colors.primary}
                    onPress={() => { navigation.navigate('EndDay') }}
                    title='End Day'
                />


            </View>
        </View>
    )
}

export default AttendanceInfo

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
    card: {
        width: 350,
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 16,
        elevation: 14,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        marginBottom: 25,
        marginHorizontal: 25,
        marginVertical: 25,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        borderBottomColor: 'black',
        borderBottomWidth: StyleSheet.hairlineWidth,
        paddingBottom: 10,
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    cardSubTitle: {
        fontSize: 16,
        marginLeft: 5,
    },
    cardContent: {
        marginBottom: 10,
    },
    cardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    itemIcon: {
        flexDirection: 'row',
        marginRight: 10,
    },
    text: {
        fontSize: 16,
        marginLeft: 5,
    },
    endDayButton: {
        alignSelf: 'flex-end',
        borderWidth: 1,
        padding: 5,
        borderColor: '#808080',
        borderRadius: 5,
    },
    endDayButtonText: {
        fontSize: 16,
        color: 'blue',
        padding: 50
    },
})