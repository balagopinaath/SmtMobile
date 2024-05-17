import { Button, Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import PagerView from 'react-native-pager-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../Config/Endpoint';
import { customColors, customFonts } from '../Config/helper';
import CustomButton from '../Components/CustomButton';

const StockClosing = ({ route }) => {
    const navigation = useNavigation();
    const { item, isEdit } = route.params;
    const pagerRef = useRef(null);
    const [selectedTab, setSelectedTab] = useState(0);
    const [productData, setProductData] = useState([])
    const [productClosingData, setProductClosingData] = useState([])

    const initialStockValue = {
        Company_Id: item.Company_Id,
        ST_Date: new Date().toISOString().split('T')[0],
        Retailer_Id: item.Retailer_Id,
        Retailer_Name: item.Retailer_Name,
        Narration: '',
        Created_by: '',
        Product_Stock_List: [],
        ST_Id: ''
    }

    const [stockInputValue, setStockInputValue] = useState(initialStockValue)
    const [closingStockValues, setClosingStockValues] = useState([]);
    // const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const userId = await AsyncStorage.getItem('UserId');
                setStockInputValue(prev => ({
                    ...prev,
                    Created_by: userId
                }));
            } catch (err) {
                console.log(err);
            }
        })();

        fetchGroupedproducts(item.Company_Id)
        fetchProductClosingStock(item.Retailer_Id)
    }, [stockInputValue.ST_Date, stockInputValue.Retailer_Id])

    useEffect(() => {
        if (isEdit) {
            setClosingStockValues(item.ProductCount.map(product => ({
                Product_Id: product.Item_Id,
                ST_Qty: product.ST_Qty,
                PR_Qty: product.PR_Qty,
                LT_CL_Date: product.LT_CL_Date,
            })));
            setStockInputValue({
                ...stockInputValue,
                ST_Id: item.ST_Id,
                Company_Id: item.Company_Id,
                ST_Date: item.ST_Date,
                Retailer_Id: item.Retailer_Id,
                Narration: item.Narration,
                Created_by: item.Created_by,
            });
        }
    }, [isEdit, item]);

    const fetchGroupedproducts = async (company) => {
        fetch(`${API.groupedProducts}${company}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setProductData(data.data)
                }
            }).catch(e => console.error(e))
    };

    const fetchProductClosingStock = async (Retailer_Id) => {
        fetch(`${API.productClosingStock}${Retailer_Id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setProductClosingData(data.data)
                }
            }).catch(e => console.error(e))
    };

    const getStockCount = (productId) => {
        const mergedData = productClosingData.filter(item => Number(item.Item_Id) === Number(productId));
        if (mergedData.length > 0 && mergedData[0].Previous_Balance !== undefined) {
            return mergedData[0].Previous_Balance;
        } else {
            return 0;
        }
    };

    const getClosingStockDate = (productId) => {
        const productDataItem = productClosingData.find(item => Number(item.Item_Id) === Number(productId));
        if (productDataItem && productDataItem.Cl_Date) {
            const date = new Date(productDataItem.Cl_Date);
            return date;
        } else {
            return new Date();
        }
    };

    const handleStockInputChange = (productId, value, date, previousStock) => {
        const updatedStockIndex = closingStockValues.findIndex(item => Number(item.Product_Id) === Number(productId))

        if (updatedStockIndex !== -1) {
            const updatedValues = [...closingStockValues];
            updatedValues[updatedStockIndex] = {
                ...updatedValues[updatedStockIndex],
                ST_Qty: Number(value),
                PR_Qty: previousStock,
                LT_CL_Date: date,
            };

            setClosingStockValues(updatedValues);
        } else {
            setClosingStockValues(prevValues => [...prevValues, {
                Product_Id: Number(productId),
                ST_Qty: Number(value),
                PR_Qty: previousStock,
                LT_CL_Date: date,
            }]);
        }
    };

    const handleTabPress = (index) => {
        setSelectedTab(index);
        pagerRef.current.setPage(index); // Set the currently visible page in the PagerView
    };

    const onPageSelected = (e) => {
        setSelectedTab(e.nativeEvent.position); // Update the selectedTab state when page is selected
    };

    const postClosingStock = async () => {
        if (closingStockValues.length > 0 && stockInputValue.Retailer_Id) {
            try {
                const response = await fetch(API.closingStock, {
                    method: isEdit ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        ...stockInputValue,
                        Product_Stock_List: closingStockValues
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        ToastAndroid.show(data.message, ToastAndroid.LONG);
                        navigation.navigate('HomeScreen')
                    } else {
                        ToastAndroid.show(data.message, ToastAndroid.LONG);
                    }
                } else {
                    throw new Error('Network response was not ok.');
                }
            } catch (e) {
                console.error(e);
                ToastAndroid.show('Failed to post stock data: ' + e.message, ToastAndroid.LONG);
            }
        } else {
            ToastAndroid.show('Please enter at least one valid stock value', ToastAndroid.LONG);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.retailerInfo}>
                <Text style={styles.retailerLabel}>Retailer Name: {item.Retailer_Name}</Text>
            </View>

            <View style={styles.narrationContainer}>
                <TextInput
                    style={styles.narrationContainerInputText}
                    placeholder='Narration'
                    onChangeText={(text) =>
                        setStockInputValue({
                            ...stockInputValue,
                            Narration: text,
                        })
                    }
                />
                <View style={styles.narrationContainerButtonGroup}>
                    <CustomButton onPress={() => navigation.goBack()}>Cancel</CustomButton>
                    <CustomButton onPress={postClosingStock}>Update</CustomButton>
                </View>
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
                                                <Text style={styles.dateText}>Closing Date: {getClosingStockDate(product.Product_Id).toLocaleDateString()}</Text>
                                                <Text style={styles.dateText}>Previous Stock: {getStockCount(product.Product_Id)}</Text>
                                                <TextInput
                                                    style={styles.pagerViewContainerInputText}
                                                    // value={`${product.Product_Id}`}
                                                    onChangeText={(text) =>
                                                        handleStockInputChange(
                                                            product.Product_Id,
                                                            text,
                                                            getClosingStockDate(product.Product_Id),
                                                            getStockCount(product.Product_Id)
                                                        )
                                                    }
                                                    value={
                                                        (closingStockValues.find(
                                                            (ooo) =>
                                                                Number(ooo?.Product_Id) ===
                                                                Number(product?.Product_Id)
                                                        )?.ST_Qty
                                                            || '').toString()
                                                    }
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
    )
}

export default StockClosing

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: customColors.background,
    },
    retailerInfo: {
        alignItems: 'center',
        marginVertical: 15,
    },
    retailerLabel: {
        fontFamily: customFonts.plusJakartaSansBold,
        fontSize: 15,
        color: customColors.accent,
        fontWeight: '500',
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
    pagerViewContainer: {
        backgroundColor: customColors.white,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        margin: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 5,
    },
    card: {
        flex: 1,
        padding: 10,
    },
    pagerViewContainerText: {
        fontFamily: customFonts.plusJakartaSansRegular,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    pagerViewContainerSubText: {
        fontFamily: customFonts.plusJakartaSansRegular,
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
        marginBottom: 10,
    },
    dateText: {
        fontFamily: customFonts.plusJakartaSansRegular,
        fontSize: 14,
        color: '#444',
        marginBottom: 4,
    },
    pagerViewContainerInputText: {
        fontFamily: customFonts.plusJakartaSansSemiBold,
        fontSize: 14,
        padding: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        marginTop: 5,
    },

})