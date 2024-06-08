import { Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native'
import React, { useState, useEffect } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { customColors, typography } from '../../Config/helper';
import { API } from '../../Config/Endpoint';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Accordion from '../../Components/Accordion';

const AttendanceReport = () => {
    const scheme = useColorScheme();
    const colors = customColors[scheme === 'dark' ? 'dark' : 'light'];
    const [attendanceData, setAttendanceData] = useState(null)

    const [show, setShow] = useState(false);
    const [selectedFromDate, setSelectedFromDate] = useState(new Date());
    const [selectedToDate, setSelectedToDate] = useState(new Date());
    const [isSelectingFromDate, setIsSelectingFromDate] = useState(true);
    const [isImageModalVisible, setImageModalVisible] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);

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

    const renderHeader = (item, index) => (
        <View style={styles(colors).header}>
            <Text maxFontSizeMultiplier={1.2} style={styles(colors).headerText}>Attendance {index + 1}</Text>
        </View>
    )

    const handleImagePress = (imageUrl) => {
        setCurrentImage(imageUrl);
        setImageModalVisible(true);
    };

    const renderContent = (item) => {
        const startKM = item.Start_KM;
        const endKM = item.End_KM;
        const kmDifference = endKM ? endKM - startKM : "Not Set";

        return (
            <View style={styles(colors).contentContainer}>
                <View style={styles(colors).contentDetails}>
                    <Text style={styles(colors).contentText}>Date: {new Date(item.Start_Date).toISOString().substring(0, 10)}</Text>
                    <Text style={styles(colors).contentText}>Start Time: {new Date(item.Start_Date).toLocaleTimeString()}</Text>
                    <Text style={styles(colors).contentText}>End Time: {item.End_Date ? new Date(item.End_Date).toLocaleTimeString() : 'Not Set'}</Text>
                    <Text style={styles(colors).contentText}>Start KM: {startKM}</Text>
                    <Text style={styles(colors).contentText}>End KM: {endKM || 'Not Set'}</Text>
                    <Text style={styles(colors).contentText}>KM Difference: {kmDifference}</Text>
                </View>
                {item.startKmImageUrl && (
                    <TouchableOpacity
                        onPress={() => handleImagePress(item.startKmImageUrl)}
                        activeOpacity={0.9} // Set higher opacity to test if visibility changes on press
                        style={{ width: 100, height: 200 }} // Ensure that TouchableOpacity has explicit dimensions
                    >
                        <Image
                            source={{ uri: item.startKmImageUrl }}
                            style={styles(colors).image} // Ensure the image fills the TouchableOpacity
                            resizeMode="contain" // Optional: Adjust based on your design needs
                        />
                    </TouchableOpacity>
                )}
            </View>
        )
    }

    return (
        <View style={styles(colors).container}>

            <View style={styles(colors).datePickerContainer}>
                <View style={styles(colors).datePickerWrapper}>
                    <Text style={styles(colors).dateTitle}>From</Text>
                    <TouchableOpacity activeOpacity={0.7} style={styles(colors).datePicker} onPress={() => showDatePicker(true)}>
                        <TextInput
                            maxFontSizeMultiplier={1.2}
                            style={styles(colors).textInput}
                            value={selectedFromDate ? new Intl.DateTimeFormat('en-GB').format(selectedFromDate) : ''}
                            editable={false}
                            placeholder='Select Date'
                        />
                        <Icon name="calendar" color={colors.accent} size={20} />
                    </TouchableOpacity>
                </View>

                <View style={styles(colors).datePickerWrapper}>
                    <Text style={styles(colors).dateTitle}>To</Text>
                    <TouchableOpacity activeOpacity={0.7} style={styles(colors).datePicker} onPress={() => showDatePicker(false)}>
                        <TextInput
                            maxFontSizeMultiplier={1.2}
                            style={styles(colors).textInput}
                            value={selectedToDate ? new Intl.DateTimeFormat('en-GB').format(selectedToDate) : ''}
                            editable={false}
                        />
                        <Icon name="calendar" color={colors.accent} size={20} />
                    </TouchableOpacity>
                </View>

                {show && (
                    <DateTimePicker
                        value={isSelectingFromDate ? selectedFromDate : selectedToDate}
                        onChange={selectDateFn}
                        mode="date"
                        display="default"
                        timeZoneOffsetInMinutes={0}
                        style={{ width: '100%' }}
                        testID="dateTimePicker"
                    />
                )}
            </View>

            <ScrollView style={styles(colors).cardContainer}>
                {attendanceData && (
                    <Accordion
                        data={attendanceData}
                        renderHeader={renderHeader}
                        renderContent={renderContent}
                    />
                )}

            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isImageModalVisible}
                onRequestClose={() => setImageModalVisible(false)}
            >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
                    <TouchableOpacity onPress={() => setImageModalVisible(false)} style={{ position: 'absolute', top: 40, right: 20 }}>
                        <Icon name="close" size={30} color="#fff" />
                    </TouchableOpacity>
                    <Image
                        source={{ uri: currentImage }}
                        style={{ width: '90%', height: '80%', resizeMode: 'contain' }}
                    />
                </View>
            </Modal>


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
        minWidth: 100, // Minimum width
        maxWidth: 250,
    },
    datePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.accent,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.primary,
    },
    headerText: {
        ...typography.h6(colors),
        fontWeight: '500',
    },
    textInput: {
        flex: 1,
        color: colors.text,
        ...typography.body1(colors),
    },
    cardContainer: {
        padding: 15,
    },
    contentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    contentDetails: {
        width: '50%',
        padding: 10,
    },
    image: {
        width: '100%',
        height: "100%",
        resizeMode: 'contain',
    },
    contentText: {
        ...typography.body1(colors),
        fontWeight: '600',
        marginBottom: 5,
    },
})