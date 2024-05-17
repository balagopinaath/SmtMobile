import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { customColors, customFonts } from '../Config/helper';
import { API } from '../Config/Endpoint';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AttendanceReport = () => {
    const navigation = useNavigation();
    const [attendanceData, setAttendanceData] = useState(null)

    const [show, setShow] = useState(false);
    const [selectedFromDate, setSelectedFromDate] = useState(new Date());
    const [selectedToDate, setSelectedToDate] = useState(new Date());
    const [isSelectingFromDate, setIsSelectingFromDate] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const userId = await AsyncStorage.getItem('UserId');
                fetchAttendance(selectedFromDate.toISOString(), selectedToDate.toISOString(), userId);
            } catch (err) {
                console.log(err);
            }
        })();
    }, [selectedFromDate, selectedToDate])

    const selectDateFn = (event, selectedDate) => {
        setShow(Platform.OS === 'ios');
        if (selectedDate) {
            if (isSelectingFromDate) {
                setSelectedFromDate(selectedDate);
                if (selectedDate > selectedToDate) {
                    setSelectedToDate(selectedDate);
                }
            } else {
                setSelectedToDate(selectedDate);
                if (selectedDate < selectedFromDate) {
                    setSelectedFromDate(selectedDate);
                }
            }
        }
    };

    const showDatePicker = (isFrom) => {
        setShow(true);
        setIsSelectingFromDate(isFrom); // Set the flag to determine if selecting "From" or "To" date
    };

    const fetchAttendance = async (fromDay, toDay, id) => {
        try {
            const response = await fetch(`${API.attendanceHistory}From=${fromDay}&To=${toDay}&UserId=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            if (data.success === true) {
                setAttendanceData(data.data);
            } else {
                console.log("Failed to fetch logs:", data.message);
            }
        } catch (error) {
            console.log("Error fetching logs:", error);
        }
    }

    return (
        <View style={styles.container}>

            <View style={styles.datePickerContainer}>
                <View style={styles.datePickerWrapper}>
                    <Text style={styles.dateTitle}>From</Text>
                    <TouchableOpacity style={styles.datePicker} onPress={() => showDatePicker(true)}>
                        <TextInput
                            style={styles.textInput}
                            value={selectedFromDate.toDateString()} // Display selected 'fromDate'
                            editable={false}
                        />
                        <Icon name="calendar" color={customColors.accent} size={20} />
                    </TouchableOpacity>
                </View>

                <View style={styles.datePickerWrapper}>
                    <Text style={styles.dateTitle}>To</Text>
                    <TouchableOpacity style={styles.datePicker} onPress={() => showDatePicker(false)}>
                        <TextInput
                            style={styles.textInput}
                            value={selectedToDate.toDateString()} // Display selected 'toDate'
                            editable={false}
                        />
                        <Icon name="calendar" color={customColors.accent} size={20} />
                    </TouchableOpacity>
                </View>

                {show && (
                    <DateTimePicker
                        value={isSelectingFromDate ? selectedFromDate : selectedToDate} // Use 'selectedFromDate' or 'selectedToDate' based on selection
                        onChange={selectDateFn}
                        mode="date"
                        timeZoneOffsetInMinutes={0}
                        style={{ flex: 1 }}
                        testID="dateTimePicker"
                    />
                )}
            </View>

            <ScrollView style={styles.cardContainer}>
                {attendanceData && attendanceData.map((log, index) => (
                    <View key={index} style={styles.card}>
                        <View style={styles.textContainer}>
                            <View style={styles.rowContainer}>
                                <Text style={styles.label}>Attendance:</Text>
                                <Text style={styles.cardTitle}>{index + 1}</Text>
                            </View>

                            <View style={styles.rowContainer}>
                                <Text style={styles.label}>Start KM:</Text>
                                <Text style={styles.cardTitle}>{log.Start_KM}</Text>
                            </View>
                            <View style={styles.rowContainer}>
                                <Text style={styles.label}>Date:</Text>
                                <Text style={styles.cardTitle}>{new Date(log.Start_Date).toISOString().substring(0, 10)}</Text>
                            </View>
                            <View style={styles.rowContainer}>
                                <Text style={styles.label}>Start Time:</Text>
                                <Text style={styles.cardTitle}>{new Date(log.Start_Date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</Text>
                            </View>

                            <View style={styles.rowContainer}>
                                <Text style={styles.label}>End Time:</Text>
                                {log.End_Date ?
                                    <Text style={styles.cardTitle}>
                                        {new Date(log.End_Date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </Text> :
                                    <Text style={styles.cardTitle}>Not Set</Text>
                                }
                            </View>

                            <View style={styles.rowContainer}>
                                <Text style={styles.label}>End KM:</Text>
                                {log.End_KM ?
                                    <Text style={styles.cardTitle}>{log.End_KM}</Text> :
                                    <Text style={styles.cardTitle}>Not Set</Text>
                                }

                            </View>

                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    )
}

export default AttendanceReport

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
        fontSize: 14,
        color: customColors.white,
        marginLeft: 15,
    },
    datePickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
    },
    dateTitle: {
        fontFamily: customFonts.plusJakartaSansRegular,
        color: customColors.text,
        fontSize: 14,
        marginBottom: 5,
    },
    datePickerWrapper: {
        flex: 1,
        marginRight: 10,
        marginVertical: 15,
    },
    datePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: customColors.accent,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    textInput: {
        flex: 1,
        color: customColors.text,
        fontSize: 13.5,
        fontFamily: customFonts.plusJakartaSansRegular,
    },
    cardContainer: {
        flex: 1,
        padding: 15,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    card: {
        flexDirection: 'row',
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: '#f5f5f5',
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    textContainer: {
        flex: 1,
    },
    label: {
        fontWeight: 'bold',
        marginRight: 5,
    },
    imageContainer: {
        width: 100,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
        marginTop: 10,
    },
})