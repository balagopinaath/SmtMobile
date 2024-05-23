import { Button, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import { customColors, customFonts, typography } from '../../Config/helper';
import { API } from '../../Config/Endpoint';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Accordion from '../../Components/Accordion';

const StockInfo = () => {
    const navigation = useNavigation();
    const scheme = useColorScheme();
    const colors = customColors[scheme === 'dark' ? 'dark' : 'light'];
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
        <View style={styles(colors).header}>
            <Text maxFontSizeMultiplier={1.2} style={styles(colors).headerText}>{item.Retailer_Name}</Text>
        </View>
    )

    const renderContent = (item) => (
        <View style={styles(colors).content}>
            <TouchableOpacity style={styles(colors).editButton} onPress={() => editOption(item)} >
                <Text maxFontSizeMultiplier={1.2} style={styles(colors).editButtonText}>Edit</Text>
            </TouchableOpacity>

            <View style={styles(colors).row}>
                <Text maxFontSizeMultiplier={1.2} style={[styles(colors).cell, styles(colors).cellHead]}>SNo</Text>
                <Text maxFontSizeMultiplier={1.2} style={[styles(colors).cell, styles(colors).cellHead]}>Product Name</Text>
                <Text maxFontSizeMultiplier={1.2} style={[styles(colors).cell, styles(colors).cellHead]}>Quantity</Text>
            </View>
            {item.ProductCount.map((product, index) => (
                <View key={index} style={styles(colors).row}>
                    <Text maxFontSizeMultiplier={1.2} style={[styles(colors).cell, styles(colors).cellText]}>{product.S_No}</Text>
                    <Text maxFontSizeMultiplier={1.2} style={styles(colors).cellMultiline}>{product.Product_Name}</Text>
                    <Text maxFontSizeMultiplier={1.2} style={styles(colors).cell}>{product.ST_Qty}</Text>
                </View>
            ))}
        </View>
    )

    return (
        <ScrollView style={styles(colors).container}>
            <Accordion
                data={logData}
                renderHeader={renderHeader}
                renderContent={renderContent}
            />
        </ScrollView>
    )
}

export default StockInfo

const styles = (colors) => StyleSheet.create({
    container: {
        padding: 10,
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
    content: {
        padding: 10,
    },
    editButton: {
        alignSelf: 'flex-end',
        backgroundColor: colors.accent,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginVertical: 5,
        borderRadius: 5,
    },
    editButtonText: {
        ...typography.body1(colors),
        textAlign: 'center',
        color: colors.white,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
        borderBottomWidth: 0.75,
        borderBottomColor: colors.black,
    },
    cell: {
        flex: 1,
        textAlign: 'left',
        flexWrap: 'wrap',
        ...typography.body1(colors),
    },
    cellMultiline: {
        flex: 2,
        textAlign: 'left',
        flexWrap: 'wrap',
        ...typography.body1(colors),
    },
    cellHead: {
        ...typography.body1(colors),
        fontWeight: '500'
    },
    cellText: {
        ...typography.body1(colors),
        fontWeight: '500'
    }
})