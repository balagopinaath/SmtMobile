import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Button, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/AntDesign';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import { customColors, customFonts } from '../Config/helper';
import { API } from '../Config/Endpoint';
import AttendanceInfo from './AttendanceInfo';
import { Dropdown } from 'react-native-element-dropdown';

const HomeScreen = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('')
    const [modalVisible, setModalVisible] = useState(false);
    const [dropdown1Value, setDropdown1Value] = useState(null);
    const [dropdown2Value, setDropdown2Value] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const userName = await AsyncStorage.getItem('Name');
                const UserId = await AsyncStorage.getItem('UserId');
                setName(userName)
                getAttendanceHistory(UserId)
            } catch (err) {
                console.log(err);
            }
        })();
    }, []);

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

    const data = [
        { label: 'Option 1', value: '1' },
        { label: 'Option 2', value: '2' },
        { label: 'Option 3', value: '3' },
    ];

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={customColors.primary} />

            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Icon name="menuunfold" color={customColors.white} size={23} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Welcome, {name}!</Text>
                <TouchableOpacity onPress={{}}>
                    <Icon name="setting" color={customColors.white} size={23} />
                </TouchableOpacity>
            </View>

            <AttendanceInfo />

            <View style={styles.functionalities}>
                <TouchableOpacity style={styles.functionality} onPress={() => navigation.navigate('Customers')}>
                    <Icon name="team" size={35} color={customColors.accent} />
                    <Text style={styles.functionalityText}>Retailers</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.functionality} onPress={() => navigation.navigate('RetailerVisit')}>
                    <IconMaterial name="add-location-alt" size={35} color={customColors.accent} />
                    <Text style={styles.functionalityText}>Visit Entry</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.functionality} onPress={() => navigation.navigate('AttendanceReport')}>
                    <Icon name="filetext1" size={35} color={customColors.accent} />
                    <Text style={styles.functionalityText}>Attendance Report</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.functionality} onPress={() => navigation.navigate('StockInfo')}>
                    <Icon name="checksquareo" size={35} color={customColors.accent} />
                    <Text style={styles.functionalityText}>Previous Stock Report</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.functionality} onPress={() => navigation.navigate('RetailerLog')}>
                    <Icon name="filetext1" size={35} color={customColors.accent} />
                    <Text style={styles.functionalityText}>Visited Report</Text>
                </TouchableOpacity>
            </View>

            <Modal animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <Text style={styles.modalTitle}>Select Options</Text>
                    <Dropdown
                        style={styles.dropdown}
                        data={data}
                        labelField="label"
                        valueField="value"
                        placeholder="Select option 1"
                        value={dropdown1Value}
                        onChange={item => {
                            setDropdown1Value(item.value);
                        }}
                    />
                    <Dropdown
                        style={styles.dropdown}
                        data={data}
                        labelField="label"
                        valueField="value"
                        placeholder="Select option 2"
                        value={dropdown2Value}
                        onChange={item => {
                            setDropdown2Value(item.value);
                        }}
                    />
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setModalVisible(false)} >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

        </View >
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: customColors.background,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        padding: 20,
        backgroundColor: customColors.primary,
    },
    headerText: {
        textAlign: 'center',
        fontFamily: customFonts.plusJakartaSansBold,
        fontSize: 18,
        color: customColors.white,
        marginLeft: 15,
    },
    functionalities: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 20,
        borderWidth: 2.5,
        borderColor: customColors.secondary,
        borderRadius: 15,
        margin: 15,
    },
    functionality: {
        width: '30%',
        aspectRatio: 1,
        alignItems: 'center',
        paddingVertical: 25,
        marginBottom: 20,
    },
    functionalityText: {
        color: customColors.accent,
        fontFamily: customFonts.plusJakartaSansSemiBold,
        fontSize: 14.5,
        fontWeight: '700',
        textAlign: 'center',
        marginTop: 10,
    },


});