import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import { customColors, customFonts } from '../Config/helper';
import { API } from '../Config/Endpoint';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StockInfo = () => {
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

    return (
        <View style={styles.container}>

            {logData && logData.map((item, index) => (
                <View key={index}>
                    <View>
                        <Text>Date: <Text>{new Date(item.ST_Date).toISOString().substring(0, 10)}</Text></Text>
                        <Text>By: <Text>{name}</Text></Text>
                        <Text>Retailer Name: <Text>{item.Retailer_Name}</Text></Text>
                    </View>

                    <View style={[styles.row, styles.header]}>
                        <Text style={styles.cell}>SNo</Text>
                        <Text style={styles.cell}>Quantity</Text>
                    </View>
                    {item.ProductCount.map((product, index) => (
                        <View key={index} style={styles.row}>
                            <Text style={styles.cell}>{product.S_No}</Text>
                            <Text style={styles.cell}>{product.PR_Qty}</Text>
                        </View>
                    ))}

                </View>
            ))}
        </View>
    )
}

export default StockInfo

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
    },
    header: {
        backgroundColor: '#f0f0f0',
        borderBottomWidth: 2,
        borderBottomColor: '#aaa',
    },
    cell: {
        flex: 1,
        textAlign: 'center',
    },

})