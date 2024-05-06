import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../Config/Colors';
import Fonts from '../Config/Fonts';

const AttendanceInfo = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('')
    const [userId, setUserId] = useState('')
    const [userType, setUserType] = useState('')
    const [startDate, setStartDate] = useState(false)

    useEffect(() => {
        (async () => {
            try {
                const userName = await AsyncStorage.getItem('Name');
                const UserId = await AsyncStorage.getItem('UserId');
                const UserType = await AsyncStorage.getItem('UserType');
                setName(userName)
                setUserId(UserId)
                setUserType(UserType)
            } catch (err) {
                console.log(err);
            }
        })();
        getAttendanceInfo(userId)
    }, []);

    const getAttendanceInfo = async (userId) => {
        try {
            const url = `http://192.168.1.2:9001/api/myTodayAttendance?UserId=${userId}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const attendanceStatus = await response.json();

            if (attendanceStatus.data.length > 0) {
                const lastAttendance = attendanceStatus.data[attendanceStatus.data.length - 1];
                const lastStartDate = lastAttendance.Start_Date;
                setStartDate(lastStartDate)
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

            {userType === 'SALES PERSON' && <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Today Attendance</Text>
                    <TouchableOpacity onPress={() => { navigation.navigate('Attendance') }} style={[styles.endDayButton, { opacity: startDate === false ? 0.5 : 1 }]}
                        disabled={startDate === false}>
                        <Text style={styles.endDayButtonText}>Start Day</Text>
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <View style={styles.cardContent}>
                    <View style={styles.cardItem}>
                        <View style={styles.itemIcon}>
                            <Icon name="clock-o" color={Colors.black} size={20} />
                            <Text style={styles.text}>Date</Text>
                        </View>
                        <Text style={styles.text}>-: -: -</Text>
                    </View>

                    <View style={styles.cardItem}>
                        <View style={styles.itemIcon}>
                            <Icon name="calendar-o" color={Colors.black} size={20} />
                            <Text style={styles.text}>Time In</Text>
                        </View>
                        <Text style={styles.text}>-: -: -</Text>
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

                <TouchableOpacity onPress={() => { navigation.navigate('EndDay') }} style={styles.endDayButton}>
                    <Text style={styles.endDayButtonText}>End Day</Text>
                </TouchableOpacity>
            </View>}
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
    },
})