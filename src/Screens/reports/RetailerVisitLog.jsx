import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import { customColors, customFonts } from '../../Config/helper';
import { API } from '../../Config/Endpoint';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RetailerVisitLog = () => {
    const navigation = useNavigation();
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
        <View style={styles.container}>

            <View style={styles.datePickerContainer}>
                <View style={styles.datePickerWrapper}>
                    <TouchableOpacity style={styles.datePicker} onPress={showDatepicker}>
                        <TextInput
                            style={styles.textInput}
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


            <ScrollView style={styles.cardContainer}>
                {logData && logData.map((log, index) => (
                    <View key={index} style={styles.card}>
                        <View style={styles.textContainer}>
                            <Text style={styles.cardTitle}>{log.IsExistingRetailer === 0 ? 'New Retailer' : 'Existing Retailer'}</Text>
                            <Text style={styles.cardTitle}>{log.Reatailer_Name}</Text>
                            <Text style={styles.cardSubtitle}>{log.Contact_Mobile}</Text>
                            <Text style={styles.cardText}>{log.Location_Address}</Text>
                            <Text style={styles.cardText}>{log.Narration}</Text>
                        </View>
                        {log.imageUrl && (
                            <View style={styles.imageContainer}>
                                <Image
                                    source={{ uri: log.imageUrl }}
                                    style={styles.cardImage}
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
    cardContainer: {
        flex: 1,
        padding: 15,
    },
    datePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: customColors.accent,
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
        fontFamily: customFonts.plusJakartaSansRegular,
        color: customColors.text,
        fontSize: 14,
        marginBottom: 5,
    },
    textInput: {
        flex: 1,
        color: customColors.text,
        fontSize: 13.5,
        fontFamily: customFonts.plusJakartaSansRegular,
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
    imageContainer: {
        width: 100,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardTitle: {
        fontFamily: customFonts.plusJakartaSansBold,
        fontSize: 16,
        marginBottom: 5,
    },
    cardSubtitle: {
        fontFamily: customFonts.plusJakartaSansRegular,
        fontSize: 14,
        color: customColors.gray,
        marginBottom: 5,
    },
    cardText: {
        fontFamily: customFonts.plusJakartaSansRegular,
        fontSize: 14,
        marginBottom: 10,
    },
    cardImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
        marginTop: 10,
    },
})