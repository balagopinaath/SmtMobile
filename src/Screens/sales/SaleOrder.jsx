import { Button, Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import PagerView from 'react-native-pager-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../../Config/Endpoint';
import { customColors, customFonts } from '../../Config/helper';
import CustomButton from '../../Components/CustomButton';

const SaleOrder = () => {
    const navigation = useNavigation();
    const pagerRef = useRef(null);
    const [selectedTab, setSelectedTab] = useState(0);
    const [productData, setProductData] = useState([])
    const [productClosingData, setProductClosingData] = useState([])
    const initialStockValue = {
        Company_Id: '',
        ST_Date: new Date().toISOString().split('T')[0],
        Retailer_Id: '',
        Retailer_Name: '',
        Narration: '',
        Created_by: '',
        Product_Stock_List: [],
    }
    const [stockInputValue, setStockInputValue] = useState(initialStockValue)
    const [closingStockValues, setClosingStockValues] = useState([]);

    useEffect(() => {
        fetchGroupedproducts()
    }, [])

    const fetchGroupedproducts = async () => {
        fetch(`${API.groupedProducts}${1}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setProductData(data.data)
                }
            }).catch(e => console.error(e))
    };

    const handleTabPress = (index) => {
        setSelectedTab(index);
        pagerRef.current.setPage(index); // Set the currently visible page in the PagerView
    };

    const onPageSelected = (e) => {
        setSelectedTab(e.nativeEvent.position); // Update the selectedTab state when page is selected
    };

    return (
        <View style={styles.container}>
            <View style={styles.narrationContainer}>
                <TextInput
                    style={styles.narrationContainerInputText}
                    placeholder='Narration'
                // onChangeText={}
                />
                <View style={styles.narrationContainerButtonGroup}>
                    <CustomButton onPress={() => navigation.goBack()}>Cancel</CustomButton>
                    <CustomButton onPress={{}}>Update</CustomButton>
                </View>

                <View style={{ flex: 1 }}>
                    <ScrollView horizontal contentContainerStyle={styles.tabContainer} showsHorizontalScrollIndicator={true}>
                        {productData.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.tabButton,
                                    selectedTab === index
                                    && styles.activeTab
                                ]}
                                onPress={() => { handleTabPress(index) }}
                            >
                                <Text>{item.Pro_Group}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <ScrollView>
                        <PagerView
                            style={{ marginTop: 15 }}
                            initialPage={selectedTab}
                            ref={pagerRef}
                            onPageSelected={onPageSelected}
                        >
                            {productData?.map((item, index) => (
                                <View key={index}>
                                    {item.GroupedProductArray.map((product, pIndex) => (
                                        <View key={pIndex} style={styles.pagerViewContainer}>
                                            <View style={{ flexDirection: 'row', paddingVertical: 15 }}>
                                                <Image
                                                    style={{
                                                        width: 125,
                                                        height: 125,
                                                        borderRadius: 8,
                                                        marginRight: 10,
                                                    }}
                                                    source={{
                                                        uri: product.productImageUrl,
                                                    }}
                                                />
                                                <View style={styles.card}>
                                                    <Text style={styles.pagerViewContainerText}>{product.Product_Name}</Text>
                                                    <Text style={styles.pagerViewContainerSubText}>{product.UOM}</Text>
                                                    <TextInput
                                                        style={styles.pagerViewContainerInputText}
                                                        // onChangeText={(text) =>
                                                        //     handleStockInputChange(
                                                        //         product.Product_Id,
                                                        //         text,
                                                        //         getClosingStockDate(product.Product_Id),
                                                        //         getStockCount(product.Product_Id)
                                                        //     )
                                                        // }
                                                        // value={
                                                        //     (closingStockValues.find(
                                                        //         (ooo) =>
                                                        //             Number(ooo?.Product_Id) ===
                                                        //             Number(product?.Product_Id)
                                                        //     )?.ST_Qty
                                                        //         || '').toString()
                                                        // }
                                                        placeholder="Closing Stock Quantity"
                                                        keyboardType='number-pad'

                                                    />
                                                </View>
                                            </View>
                                        </View>
                                    ))}

                                </View>
                            ))}

                        </PagerView>

                    </ScrollView>

                </View>
            </View>
        </View>
    )
}

export default SaleOrder

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: customColors.background,
    },
    narrationContainer: {
        marginHorizontal: 20,
        marginVertical: 10,
    },
    narrationContainerInputText: {
        color: customColors.text,
        fontFamily: customFonts.plusJakartaSansRegular,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#a1a1a1',
        borderRadius: 8,
        padding: 12,
        marginHorizontal: 'auto',
    },
    narrationContainerButtonGroup: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginVertical: 15,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    tabButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: 'blue',
    },
})