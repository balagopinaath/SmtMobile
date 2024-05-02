import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/AntDesign';
import Colors from '../Config/Colors';
import Fonts from '../Config/Fonts';

const HomeScreen = () => {
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

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('UserId');
            await AsyncStorage.removeItem('userName');
            await AsyncStorage.removeItem('Name');
            await AsyncStorage.removeItem('UserType');
            await AsyncStorage.removeItem('branchId');
            await AsyncStorage.removeItem('branchName');
            await AsyncStorage.removeItem('userType');
            await AsyncStorage.removeItem('userTypeId');
            navigation.replace("LoginScreen");
        } catch (e) {
            console.error('Error clearing AsyncStorage:', e);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Colors.primary} />
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Welcome, {name}!</Text>
                <TouchableOpacity onPress={logout}>
                    <Icon name="logout" color={Colors.white} size={20} />
                </TouchableOpacity>
            </View>

            <View style={styles.ContainerAction}>

                {userType === 'SALES PERSON' && <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Today Attendance</Text>
                        <TouchableOpacity onPress={() => { navigation.push('Attendance') }} style={[styles.endDayButton, { opacity: startDate === false ? 0.5 : 1 }]}
                            disabled={startDate === false}>
                            <Text style={styles.endDayButtonText}>Start Day</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <View style={styles.cardContent}>
                        <View style={styles.cardItem}>
                            <View style={styles.itemIcon}>
                                <Icon name="clockcircleo" color={Colors.black} size={20} />
                                <Text style={styles.text}>Date</Text>
                            </View>
                            <Text style={styles.text}>-: -: -</Text>
                        </View>

                        <View style={styles.cardItem}>
                            <View style={styles.itemIcon}>
                                <Icon name="right" color={Colors.black} size={20} />
                                <Text style={styles.text}>Time In</Text>
                            </View>
                            <Text style={styles.text}>-: -: -</Text>
                        </View>

                        <View style={styles.cardItem}>
                            <View style={styles.itemIcon}>
                                <Icon name="clockcircleo" color={Colors.black} size={20} />
                                <Text style={styles.text}>Day End</Text>
                            </View>
                            <Text style={styles.text}>-: -: -</Text>
                        </View>

                        <View style={styles.cardItem}>
                            <View style={styles.itemIcon}>
                                <Icon name="left" color={Colors.black} size={20} />
                                <Text style={styles.text}>Time Out</Text>
                            </View>
                            <Text style={styles.text}>-: -: -</Text>
                        </View>
                    </View>

                    <TouchableOpacity onPress={() => { navigation.push('EndDay') }} style={styles.endDayButton}>
                        <Text style={styles.endDayButtonText}>End Day</Text>
                    </TouchableOpacity>
                </View>}


                <View style={styles.row}>
                    <TouchableOpacity style={styles.actionButton} onPress={() => { navigation.push('Customers') }}>
                        <Icon name="exclamationcircleo" color={Colors.white} size={25} />
                        <Text style={styles.actionButtonText}>Retailers</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton} onPress={() => { navigation.push('AddCustomer') }}>
                        <Icon name="plus" color={Colors.white} size={25} />
                        <Text style={styles.actionButtonText}>Add</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.row}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Icon name="edit" color={Colors.white} size={23} />
                        <Text style={styles.actionButtonText}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <Icon name="shoppingcart" color={Colors.white} size={25} />
                        <Text style={styles.actionButtonText}>Sales</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.row}>
                    <TouchableOpacity style={styles.actionButton} onPress={() => { navigation.push('Attendance') }} >
                        <Icon name="enviromento" color={Colors.white} size={25} />
                        <Text style={styles.actionButtonText}>Register</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <Icon name="team" color={Colors.white} size={25} />
                        <Text style={styles.actionButtonText}>Delivery</Text>
                    </TouchableOpacity>
                </View>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: Colors.primary,
    },
    headerText: {
        fontFamily: Fonts.plusJakartaSansBold,
        fontSize: 18,
        color: Colors.white
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

    ContainerAction: {
        marginHorizontal: 25,
        marginVertical: 25
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
    floatingButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 30,
    },
    floatingButtonText: {
        fontFamily: Fonts.plusJakartaSansMedium,
        fontSize: 16,
        color: Colors.white,
        marginLeft: 13,
        marginTop: 5,
    }
});