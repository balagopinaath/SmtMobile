import { Button, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import { customColors, customFonts } from '../../Config/helper';
import { API } from '../../Config/Endpoint';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Accordion from '../../Components/Accordion';

const StockInfo = () => {
    const navigation = useNavigation();
    const [logData, setLogData] = useState([])
    const [name, setName] = useState()

    useEffect(() => {
        (async () => {
            try {
                const currentDate = new Date();
                const userId = await AsyncStorage.getItem('UserId');
                const userName = await AsyncStorage.getItem('Name');
                setName(userName)
                fetchStockLog(currentDate.toISOString(), userId);
            } catch (err) {
                console.log(err);
            }
        })();
    }, [])

    const fetchStockLog = async (toDay, id) => {
        try {
            const response = await fetch(`${API.closingStockReport}${id}&reqDate=${toDay}`, {
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

    const editOption = (item) => {
        navigation.navigate('StockClosing', { item, isEdit: true })
    }

    const renderHeader = (item) => (
        <View style={styles.header}>
            <Text style={styles.headerText}>{item.Retailer_Name}</Text>
        </View>
    )

    const renderContent = (item) => (
        <View style={styles.content}>
            <TouchableOpacity style={styles.editButton} onPress={() => editOption(item)} >
                <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>

            <View style={styles.row}>
                <Text style={[styles.cell, styles.cellHead]}>SNo</Text>
                <Text style={[styles.cell, styles.cellHead]}>Product Name</Text>
                <Text style={[styles.cell, styles.cellHead]}>Quantity</Text>
            </View>
            {item.ProductCount.map((product, index) => (
                <View key={index} style={styles.row}>
                    <Text style={[styles.cell, styles.cellText]}>{product.S_No}</Text>
                    <Text style={styles.cellMultiline}>{product.Product_Name}</Text>
                    <Text style={styles.cell}>{product.ST_Qty}</Text>
                </View>
            ))}
        </View>
    )

    return (
        <ScrollView style={styles.container}>
            <Accordion
                data={logData}
                renderHeader={renderHeader}
                renderContent={renderContent}
            />
        </ScrollView>
    )
}

export default StockInfo

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: customColors.primary,
    },
    headerText: {
        fontSize: 16,
        fontFamily: customFonts.plusJakartaSansMedium,
        color: customColors.text,
        fontWeight: '500',
    },
    content: {
        padding: 10,
    },
    editButton: {
        alignSelf: 'flex-end',
        backgroundColor: customColors.accent,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginVertical: 5,
        borderRadius: 5,
    },
    editButtonText: {
        textAlign: 'center',
        fontFamily: customFonts.plusJakartaSansSemiBold,
        fontSize: 14,
        color: customColors.white,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
        borderBottomWidth: 0.75,
        borderBottomColor: customColors.black,
    },
    cell: {
        flex: 1,
        textAlign: 'left',
        flexWrap: 'wrap',
    },
    cellMultiline: {
        flex: 2,
        textAlign: 'left',
        flexWrap: 'wrap',
    },
    cellHead: {
        fontFamily: customFonts.plusJakartaSansBold,
        fontSize: 14,
        fontWeight: '500'
    },
    cellText: {
        fontSize: 12,
        fontFamily: customFonts.plusJakartaSansBold,
        fontWeight: '500'
    }
})