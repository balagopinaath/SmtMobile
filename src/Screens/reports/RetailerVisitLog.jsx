import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native'
import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import { customColors, typography } from '../../Config/helper';
import { API } from '../../Config/Endpoint';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RetailerVisitLog = () => {
    const scheme = useColorScheme();
    const colors = customColors[scheme === 'dark' ? 'dark' : 'light'];
    const [logData, setLogData] = useState(null)
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const userId = await AsyncStorage.getItem('UserId');
                fetchVisitersLog(selectedDate.toISOString(), userId);
            } catch (err) {
                console.log(err);
            }
        })();
    }, [selectedDate])

    const fetchVisitersLog = async (fromDate, id) => {
        try {
            const response = await fetch(`${API.visitedLog}?reqDate=${fromDate}&UserId=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();

            if (data.success === true) {
                setLogData(data.data);
            } else {
                console.log("Failed to fetch logs:", data.message);
            }
        } catch (error) {
            console.log("Error fetching logs:", error);
        }
    }

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setSelectedDate(selectedDate);
        }
    };

    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    return (
        <View style={styles(colors).container}>

            <View style={styles(colors).datePickerContainer}>
                <View style={styles(colors).datePickerWrapper}>
                    <TouchableOpacity style={styles(colors).datePicker} onPress={showDatepicker}>
                        <TextInput
                            maxFontSizeMultiplier={1.2}
                            style={styles(colors).textInput}
                            value={selectedDate.toDateString()} // Display selected 'fromDate'
                            editable={false}
                        />
                        <Icon name="calendar" color={customColors.accent} size={20} />
                    </TouchableOpacity>
                </View>

                {showDatePicker && (
                    <DateTimePicker
                        value={selectedDate}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}
            </View>


            <ScrollView style={styles(colors).cardContainer}>
                {logData && logData.map((log, index) => (
                    <View key={index} style={styles(colors).card}>
                        <View style={styles(colors).textContainer}>
                            <Text maxFontSizeMultiplier={1.2} style={styles(colors).cardTitle}>{log.IsExistingRetailer === 0 ? 'New Retailer' : 'Existing Retailer'}</Text>
                            <Text maxFontSizeMultiplier={1.2} style={styles(colors).cardTitle}>{log.Reatailer_Name}</Text>
                            <Text maxFontSizeMultiplier={1.2} style={styles(colors).cardSubtitle}>{log.Contact_Mobile}</Text>
                            <Text maxFontSizeMultiplier={1.2} style={styles(colors).cardText}>{log.Location_Address}</Text>
                            <Text maxFontSizeMultiplier={1.2} style={styles(colors).cardText}>{log.Narration}</Text>
                        </View>
                        {log.imageUrl && (
                            <View style={styles(colors).imageContainer}>
                                <Image
                                    source={{ uri: log.imageUrl }}
                                    style={styles(colors).cardImage}
                                    resizeMode="contain"
                                    onError={() => console.warn('Image failed to load:', log.imageUrl)}
                                />
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>
        </View>
    )
}

export default RetailerVisitLog

const styles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    cardContainer: {
        flex: 1,
        padding: 15,
    },
    datePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.accent,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    datePickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
    },
    datePickerWrapper: {
        flex: 1,
        marginRight: 10,
        marginVertical: 15,
    },
    dateTitle: {
        ...typography.body2(colors),
        color: colors.text,
        marginBottom: 5,
    },
    textInput: {
        flex: 1,
        color: colors.text,
        ...typography.body1(colors),
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
    imageContainer: {
        width: 100,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardTitle: {
        ...typography.h5(colors),
        marginBottom: 5,
    },
    cardSubtitle: {
        ...typography.h6(colors),
        // color: colors.gray,
        marginBottom: 5,
    },
    cardText: {
        ...typography.body1(colors),
        marginBottom: 10,
    },
    cardImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
        marginTop: 10,
    },
})