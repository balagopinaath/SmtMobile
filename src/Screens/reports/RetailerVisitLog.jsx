import { Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native'
import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import { customColors, typography } from '../../Config/helper';
import { API } from '../../Config/Endpoint';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Accordion from '../../Components/Accordion';

const RetailerVisitLog = () => {
    const scheme = useColorScheme();
    const colors = customColors[scheme === 'dark' ? 'dark' : 'light'];
    const [logData, setLogData] = useState(null)
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isImageModalVisible, setImageModalVisible] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);

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

    const handleImagePress = (imageUrl) => {
        setCurrentImage(imageUrl);
        setImageModalVisible(true);
    };

    const renderHeader = (item) => {
        return (
            < View style={styles(colors).header} >
                <Text maxFontSizeMultiplier={1.2} style={styles(colors).headerText}>{item.Reatailer_Name}</Text>
            </View >
        )
    }

    const renderContent = (item) => {
        return (
            <View style={styles(colors).card}>
                <View style={styles(colors).textContainer}>
                    <Text style={styles(colors).boldText}> {item.IsExistingRetailer === 1 ? 'Existing Retailer' : 'New Retailer'}</Text>
                    <Text maxFontSizeMultiplier={1.2} style={styles(colors).cardText}>
                        Contact Person:
                        <Text style={styles(colors).boldText}> {item.Contact_Mobile}</Text>
                    </Text>
                    <Text maxFontSizeMultiplier={1.2} style={styles(colors).cardText}>
                        Address:
                        <Text style={styles(colors).boldText}> {item.Location_Address}</Text>
                    </Text>
                    <Text maxFontSizeMultiplier={1.2} style={styles(colors).cardText}>
                        Narration:
                        <Text style={styles(colors).boldText}> {item.Narration}</Text>
                    </Text>
                </View>
                {item.imageUrl && (
                    <TouchableOpacity
                        onPress={() => handleImagePress(item.imageUrl)}
                        activeOpacity={0.9} // Set higher opacity to test if visibility changes on press
                        style={{ width: 100, height: 200, }} // Ensure that TouchableOpacity has explicit dimensions
                    >
                        <Image
                            source={{ uri: item.imageUrl }}
                            style={styles(colors).cardImage}
                            resizeMode="contain"
                            onError={() => console.warn('Image failed to load:', item.imageUrl)}
                        />
                    </TouchableOpacity>
                )}
            </View>
        );
    }

    return (
        <View style={styles(colors).container}>
            <View style={styles(colors).datePickerContainer}>
                <View style={styles(colors).datePickerWrapper}>
                    <TouchableOpacity style={styles(colors).datePicker} onPress={showDatepicker}>
                        <TextInput
                            maxFontSizeMultiplier={1.2}
                            style={styles(colors).textInput}
                            value={selectedDate ? new Intl.DateTimeFormat('en-GB').format(selectedDate) : ''}
                            editable={false}
                        />
                        <Icon name="calendar" color={colors.accent} size={20} />
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
                {logData && (
                    <Accordion
                        data={logData}
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
    card: {
        flexDirection: 'row',
        borderRadius: 10,
        backgroundColor: colors.background === "#000000" ? colors.black : colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    textContainer: {
        width: '50%',
        width: '50%',
    },
    cardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain'
    },
    cardText: {
        ...typography.body1(colors),
        marginBottom: 10,
    },
    boldText: {
        ...typography.body1(colors),
        fontWeight: 'bold',
    },
})