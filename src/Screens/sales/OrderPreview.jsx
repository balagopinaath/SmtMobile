import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Accordion from '../../Components/Accordion';
import { API } from '../../Config/Endpoint';
import { customColors, customFonts } from '../../Config/helper';

const OrderPreview = () => {
    const navigation = useNavigation();
    const [logData, setLogData] = useState([])

    useEffect(() => {
        (async () => {
            try {
                const currentDate = new Date();
                const userId = await AsyncStorage.getItem('UserId');
                fetchSaleOrder(userId)
            } catch (err) {
                console.log(err);
            }
        })();
    }, [])

    const fetchSaleOrder = async (userId) => {
        try {
            const response = await fetch(`${API.saleOrder}?Company_Id=${1}&Created_by=${userId}`, {
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

    const renderHeader = (item) => {
        return (
            <View style={styles.header}>
                <Text style={styles.headerText}>{item.Retailer_Name}</Text>
            </View>
        );
    };

    const renderContent = (item) => {
        return (
            <View style={styles.content}>
                <View style={styles.contentInner}>
                    <View>
                        <Text style={styles.headerText}>Order Date: {new Date(item.So_Date).toLocaleDateString()}</Text>
                        <Text style={styles.headerText}>Total Invoice Value: ₹ {item.Total_Invoice_value}</Text>
                        <Text style={styles.headerText}>Products:</Text>
                    </View>

                    <TouchableOpacity style={styles.editButton} onPress={() => editOption(item)} >
                        <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.row}>
                    <Text style={[styles.cell, styles.cellHead]}>Name</Text>
                    <Text style={[styles.cell, styles.cellHead]}>Qty</Text>
                    <Text style={[styles.cell, styles.cellHead]}>Rate</Text>
                    <Text style={[styles.cell, styles.cellHead]}>Amount</Text>
                </View>
                {item.Products_List.map((product, index) => (
                    <View key={index} style={styles.row}>
                        <Text style={[styles.cell, styles.cellHead]}>{product.Product_Name}</Text>
                        <Text style={[styles.cell, styles.cellHead]}>{product.Bill_Qty}</Text>
                        <Text style={[styles.cell, styles.cellHead]}>₹ {product.Item_Rate}</Text>
                        <Text style={[styles.cell, styles.cellHead]}>₹ {product.Amount}</Text>
                    </View>
                ))}
            </View>
        );
    };

    const editOption = (item) => {
        // console.log(item)
        navigation.navigate('Orders', { item, isEdit: true })
    }

    return (
        <View style={styles.container}>
            <Accordion data={logData} renderHeader={renderHeader} renderContent={renderContent} />
        </View>
    )
}

export default OrderPreview

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    contentInner: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    editButton: {
        alignSelf: 'flex-start',
        backgroundColor: customColors.accent,
        paddingVertical: 5,
        paddingHorizontal: 10,
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
        justifyContent: 'space-around',
        paddingVertical: 5,
        borderBottomWidth: 0.75,
        borderBottomColor: customColors.black,
    },
    cell: {
        textAlign: 'center',
        flexWrap: 'wrap',
    },
    cell: {
        flex: 2,
        textAlign: 'center',
        flexWrap: 'wrap',
    },
    cellHead: {
        fontFamily: customFonts.plusJakartaSansBold,
        fontSize: 14,
        fontWeight: '500'
    },
})