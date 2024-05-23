import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native'
import React, { useState, useEffect } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { customColors, customFonts, typography } from '../../Config/helper';
import { API } from '../../Config/Endpoint';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AttendanceReport = () => {
    const scheme = useColorScheme();
    const colors = customColors[scheme === 'dark' ? 'dark' : 'light'];
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
        setIsSelectingFromDate(isFrom);
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
        <View style={styles(colors).container}>

            <View style={styles(colors).datePickerContainer}>
                <View style={styles(colors).datePickerWrapper}>
                    <Text style={styles(colors).dateTitle}>From</Text>
                    <TouchableOpacity style={styles(colors).datePicker} onPress={() => showDatePicker(true)}>
                        <TextInput
                            maxFontSizeMultiplier={1.2}
                            style={styles(colors).textInput}
                            value={selectedFromDate.toDateString()} // Display selected 'fromDate'
                            editable={false}
                        />
                        <Icon name="calendar" color={colors.accent} size={20} />
                    </TouchableOpacity>
                </View>

                <View style={styles(colors).datePickerWrapper}>
                    <Text style={styles(colors).dateTitle}>To</Text>
                    <TouchableOpacity style={styles(colors).datePicker} onPress={() => showDatePicker(false)}>
                        <TextInput
                            maxFontSizeMultiplier={1.2}
                            style={styles(colors).textInput}
                            value={selectedToDate.toDateString()} // Display selected 'toDate'
                            editable={false}
                        />
                        <Icon name="calendar" color={colors.accent} size={20} />
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

            <ScrollView style={styles(colors).cardContainer}>
                {attendanceData && attendanceData.map((log, index) => (
                    <View key={index} style={styles(colors).card}>
                        <View style={styles(colors).textContainer}>
                            <View style={styles(colors).rowContainer}>
                                <Text maxFontSizeMultiplier={1.2} style={styles(colors).label}>Attendance:</Text>
                                <Text maxFontSizeMultiplier={1.2} style={styles(colors).cardTitle}>{index + 1}</Text>
                            </View>

                            <View style={styles(colors).rowContainer}>
                                <Text maxFontSizeMultiplier={1.2} style={styles(colors).label}>Start KM:</Text>
                                <Text maxFontSizeMultiplier={1.2} style={styles(colors).cardTitle}>{log.Start_KM}</Text>
                            </View>
                            <View style={styles(colors).rowContainer}>
                                <Text maxFontSizeMultiplier={1.2} style={styles(colors).label}>Date:</Text>
                                <Text maxFontSizeMultiplier={1.2} style={styles(colors).cardTitle}>{new Date(log.Start_Date).toISOString().substring(0, 10)}</Text>
                            </View>
                            <View style={styles(colors).rowContainer}>
                                <Text maxFontSizeMultiplier={1.2} style={styles(colors).label}>Start Time:</Text>
                                <Text maxFontSizeMultiplier={1.2} style={styles(colors).cardTitle}>{new Date(log.Start_Date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</Text>
                            </View>

                            <View style={styles(colors).rowContainer}>
                                <Text maxFontSizeMultiplier={1.2} style={styles(colors).label}>End Time:</Text>
                                {log.End_Date ?
                                    <Text maxFontSizeMultiplier={1.2} style={styles(colors).cardTitle}>
                                        {new Date(log.End_Date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </Text> :
                                    <Text maxFontSizeMultiplier={1.2} style={styles.cardTitle}>Not Set</Text>
                                }
                            </View>

                            <View style={styles(colors).rowContainer}>
                                <Text style={styles(colors).label}>End KM:</Text>
                                {log.End_KM ?
                                    <Text maxFontSizeMultiplier={1.2} style={styles(colors).cardTitle}>{log.End_KM}</Text> :
                                    <Text maxFontSizeMultiplier={1.2} style={styles(colors).cardTitle}>Not Set</Text>
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

const styles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    datePickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
    },
    dateTitle: {
        ...typography.body1(colors),
        color: colors.text,
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
        borderColor: colors.accent,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    textInput: {
        flex: 1,
        color: colors.text,
        ...typography.body1(colors),
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
        backgroundColor: colors.background === "#000000" ? colors.black : colors.white,
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
        ...typography.body1(colors),
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