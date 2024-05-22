import { Button, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconFont from 'react-native-vector-icons/Fontisto';
import { API } from '../../Config/Endpoint';
import { customColors, typography } from '../../Config/helper';
import CustomButton from '../../Components/CustomButton';

const AttendanceInfo = () => {
    const navigation = useNavigation();
    const scheme = useColorScheme();
    const colors = customColors[scheme === 'dark' ? 'dark' : 'light'];
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
    }, [activeStatus]);

    useEffect(() => {
        if (userId) {
            // getAttendanceInfo(userId);
            getAttendanceHistory(userId);
        }
    }, [userId]);

    // const getAttendanceInfo = async (userId) => {
    //     try {
    //         const url = `${API.myTodayAttendance}${userId}`;
    //         const response = await fetch(url, {
    //             method: 'GET',
    //             headers: { 'Content-Type': 'application/json' },
    //         });
    //         const attendanceStatus = await response.json();
    //         if (attendanceStatus.data.length > 0) {
    //             const lastAttendance = attendanceStatus.data[attendanceStatus.data.length - 1];
    //             const lastStartDate = lastAttendance.Start_Date;
    //             const [datePart, timePart] = lastStartDate.split('T');
    //             setActiveStatus(attendanceStatus.data[0].Active_Status)
    //             setDate(datePart);
    //             setTime(timePart.substring(0, 8));
    //         }
    //     } catch (error) {
    //         console.log("Error fetching attendance data:", error);
    //     }
    // };

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
                const lastAttendance = attendanceHistory.data[attendanceHistory.data.length - 1];
                const lastStartDate = lastAttendance.Start_Date;
                const [datePart, timePart] = lastStartDate.split('T');
                setActiveStatus(attendanceHistory.data[0].Active_Status)
                setDate(datePart);
                setTime(timePart.substring(0, 8));
            }
        } catch (error) {
            console.log("Error fetching attendance data:", error);
        }
    }

    return (
        <View style={styles(colors).card}>
            <View style={styles(colors).cardHeader}>
                <Text style={styles(colors).cardTitle}>Today Attendance</Text>

                {!activeStatus && (
                    <TouchableOpacity style={styles(colors).startButton} onPress={() => { navigation.navigate('Attendance') }} >
                        <Text style={styles(colors).buttonText}>Start Day</Text>
                    </TouchableOpacity>
                )}
            </View>

            {activeStatus !== 0 && (
                <View style={styles(colors).cardContent}>
                    <View style={styles(colors).cardItem}>
                        <View style={styles(colors).itemIcon}>
                            <IconFont name="date" color={colors.black} size={20} />
                            <Text style={styles(colors).text}>Date</Text>
                        </View>
                        <Text style={styles(colors).text}>{date}</Text>
                    </View>

                    <View style={styles(colors).cardItem}>
                        <View style={styles(colors).itemIcon}>
                            <Icon name="time-outline" color={colors.black} size={20} />
                            <Text style={styles(colors).text}>Time In</Text>
                        </View>
                        <Text style={styles(colors).text}>{time}</Text>
                    </View>

                    <TouchableOpacity
                        style={styles(colors).endButton}
                        onPress={() => {
                            navigation.navigate('EndDay');
                            setActiveStatus(0);
                        }}>
                        <Text style={styles(colors).buttonText}>End Day</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}

export default AttendanceInfo

const styles = (colors) => StyleSheet.create({
    card: {
        backgroundColor: colors.background === "#000000" ? colors.black : colors.white,
        borderRadius: 10,
        padding: 20,
        margin: 20,
        elevation: 14,
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        marginBottom: 20,
    },
    cardTitle: {
        ...typography.h5(colors),
    },
    startButton: {
        backgroundColor: colors.primary,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 5,
    },
    endButton: {
        backgroundColor: colors.primary,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 5,
        alignSelf: 'flex-end',
    },
    buttonText: {
        ...typography.button(colors),
    },
    cardContent: {},
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
        ...typography.body1(colors),
        // color: colors.textPrimary,
        marginLeft: 10,
        marginBottom: 5,
    },
})