import { Button, Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome'
import PagerView from 'react-native-pager-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../Config/Endpoint';
import { customColors, customFonts } from '../Config/helper';

const StockClosing = ({ route }) => {
    const navigation = useNavigation();
    const { item } = route.params;
    const [stockDate, setStockDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const pagerRef = useRef(null);
    const [selectedTab, setSelectedTab] = useState(0);
    const [productData, setProductData] = useState([])
    const [productClosingData, setProductClosingData] = useState([])
    const [tabs, setTabs] = useState([]);
    const [userNameId, setUserNameId] = useState('')

    const initialStockValue = {
        Company_Id: 1,
        ST_Date: new Date().toISOString().split('T')[0],
        Retailer_Id: item.Retailer_Id,
        Retailer_Name: item.Retailer_Name,
        Narration: '',
        Created_by: userNameId,
        Product_Stock_List: []
    }

    const [stockValues, setStockValues] = useState([]);
    const [stockInputValue, setStockInputValue] = useState(initialStockValue.Product_Stock_List)

    useEffect(() => {
        (async () => {
            try {
                const UserId = await AsyncStorage.getItem('UserId');
                setUserNameId(UserId)
            } catch (err) {
                console.log(err);
            }
        })();

        fetchGroupedproducts()
        fetchProductClosingStock(item.Retailer_Id)
        setStockInputValue({
            ...initialStockValue,
            Product_Stock_List: stockValues
        });
    }, [stockValues])

    const fetchGroupedproducts = async () => {
        try {
            const response = await fetch(
                API.groupedProducts
            );
            const jsonData = await response.json();

            if (jsonData.data) {
                // console.log(jsonData)
                setProductData(jsonData);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchProductClosingStock = async (Retailer_Id) => {
        try {
            const response = await fetch(
                `${API.productClosingStock}${Retailer_Id}`
            );
            const jsonData = await response.json();

            if (jsonData.data) {
                setProductClosingData(jsonData.data)
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const getStockCount = (productId) => {
        if (!productClosingData || productClosingData.length === 0) {
            return '';
        }
        const mergedData = productClosingData.filter(item => Number(item.Item_Id) === Number(productId));
        if (mergedData.length > 0 && mergedData[0].Previous_Balance !== undefined) {
            return `${mergedData[0].Previous_Balance}`;
        } else {
            return 'N/A';
        }
    };

    const getClosingStockDate = (productId) => {
        if (!productClosingData || productClosingData.length === 0) {
            return '';
        }
        const productData = productClosingData.find(item => Number(item.Item_Id) === Number(productId));
        if (productData && productData.Cl_Date !== undefined) {
            const date = new Date(productData.Cl_Date);
            return date.toLocaleDateString(); // Format the date according to your preference
        } else {
            return 'N/A';
        }
    };

    const handleStockInputChange = (productId, value, date, previousStock) => {
        const updatedStock = { Product_Id: productId, ST_Qty: value, PR_Qty: previousStock, LT_CL_Date: date };
        setStockValues(prevValues => {
            const index = prevValues.findIndex(item => item.Product_Id === productId);
            if (index !== -1) {
                const newValues = [...prevValues];
                newValues[index] = updatedStock;
                return newValues;
            } else {
                return [...prevValues, updatedStock];
            }
        });
    };

    const postClosingStock = async () => {
        if (stockInputValue.Product_Stock_List.length > 0 && stockInputValue.Retailer_Id) {
            try {
                const response = await fetch(API.closingStock, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(stockInputValue)
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

    useEffect(() => {
        if (productData && productData.data && productData.data.length > 0) {
            const newTabs = productData.data.map(item => ({
                title: item.Pro_Group,
                content: (
                    <View>
                        {item.GroupedProductArray.map(product => (
                            <View key={`${product.Product_Id}_name`} style={styles.pagerViewContainer}>
                                <View style={{ flexDirection: 'row', paddingVertical: 15 }}>
                                    <Image
                                        style={{
                                            width: 125,
                                            height: 125,
                                        }}
                                        source={{
                                            uri: product.productImageUrl,
                                        }}
                                    />
                                    <View style={{ marginLeft: 10 }}>
                                        <Text style={styles.pagerViewContainerText}>{product.Product_Name}</Text>
                                        <Text style={styles.pagerViewContainerSubText}>{product.UOM}</Text>
                                        <Text style={styles.dateText}>Closing Date: {getClosingStockDate(product.Product_Id)}</Text>
                                        <Text style={styles.dateText}>Previous Stock: {getStockCount(product.Product_Id)}</Text>
                                        <TextInput
                                            style={styles.pagerViewContainerInputText}
                                            // value={`${product.Product_Id}`}
                                            placeholder="Closing Stock Quantity"
                                            keyboardType='number-pad'
                                            onChangeText={(text) =>
                                                handleStockInputChange(
                                                    product.Product_Id,
                                                    text,
                                                    getClosingStockDate(product.Product_Id),
                                                    getStockCount(product.Product_Id)
                                                )
                                            }
                                        />
                                    </View>
                                </View>

                                <View
                                    style={{
                                        flex: 0.5,
                                        borderBottomColor: 'black',
                                        borderBottomWidth: 1,
                                    }}
                                />
                            </View>
                        ))}
                    </View>
                )
            }));
            setTabs(newTabs);
        }
    }, [productData]);

    const handleTabPress = (index) => {
        setSelectedTab(index);
        pagerRef.current.setPage(index); // Set the currently visible page in the PagerView
    };

    const onPageSelected = (e) => {
        setSelectedTab(e.nativeEvent.position); // Update the selectedTab state when page is selected
    };

    const selectDateFn = (event, selectedDate) => {
        const currentDate = selectedDate || stockDate;
        setShow(Platform.OS === 'ios');
        setStockDate(currentDate);
    };

    const showDatePicker = () => {
        setShow(true);
    };

    return (

        <View style={styles.container}>

            <View style={styles.retailerInfo}>
                <Text style={styles.retailerInfoText}>Retailer Name: {item.Retailer_Name}</Text>
            </View>

            <View style={styles.inputContainer}>
                <TouchableOpacity onPress={showDatePicker} style={styles.datePicker}>
                    <TextInput
                        style={styles.textInput}
                        value={stockDate.toDateString()}
                        editable={false}
                    />
                    <Icon name="calendar" color="red" size={20} />
                </TouchableOpacity>

                {show && (
                    <DateTimePicker
                        value={stockDate}
                        onChange={selectDateFn}
                        mode="date"
                        // minimumDate={minimumDate}
                        // maximumDate={todayDate}
                        timeZoneOffsetInMinutes={0}
                        style={{ flex: 1 }}
                        testID="dateTimePicker"
                    />
                )}
            </View>

            <View style={{ flex: 1 }}>
                <ScrollView horizontal contentContainerStyle={styles.tabContainer} showsHorizontalScrollIndicator={true}>
                    {tabs.map((tab, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.tabButton, selectedTab === index && styles.activeTab]}
                            onPress={() => handleTabPress(index)}
                        >
                            <Text>{tab.title}</Text>
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
                        {tabs.map((tab, index) => (
                            <View key={index} style={{ flex: 1 }}>
                                {tab.content}
                                <View style={styles.narrationContainer}>
                                    <TextInput
                                        style={styles.narrationContainerInputText}
                                        value={initialStockValue.Narration}
                                        placeholder='Narration'
                                    // onChangeText={(text) => handleInputChange('Retailer_Name', text)}
                                    />
                                    <View style={styles.narrationContainerButtonGroup}>
                                        <TouchableOpacity onPress={() => navigation.goBack()}>
                                            <Text style={{ color: customColors.black, fontSize: 14, fontWeight: '500', }}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={postClosingStock}>
                                            <Text style={{ color: customColors.accent, fontSize: 14, fontWeight: '500', marginLeft: 20 }}>Update</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
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
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: customColors.primary,
    },
    headerText: {
        fontFamily: customFonts.plusJakartaSansMedium,
        fontSize: 15,
        color: customColors.white,
        marginLeft: 15
    },
    retailerInfo: {
        paddingTop: 15,
        paddingHorizontal: 20,
    },
    retailerInfoText: {
        fontSize: 14,
        fontWeight: '600'
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
    },
    datePicker: {
        flexDirection: 'row',
    },
    textInput: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: 'lightgray',
    },
    tabButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: 'blue',
    },
    pagerViewContainer: {
        paddingHorizontal: 15,
        paddingVertical: 10
    },
    pagerViewContainerText: {
        fontSize: 14,
        fontWeight: '600',
        paddingBottom: 5
    },
    pagerViewContainerSubText: {
        fontSize: 12,
        fontWeight: '500',
        paddingBottom: 20,
    },
    dateText: {
        fontFamily: customFonts.plusJakartaSansRegular,
        fontSize: 14,
    },
    pagerViewContainerInputText: {
        fontFamily: customFonts.plusJakartaSansSemiBold,
        fontSize: 14,
        borderWidth: 0.75,
        borderColor: customColors.black,
        borderRadius: 5,
        padding: 5,
        marginTop: 15,
        marginBottom: 20,
    },
    narrationContainer: {
        backgroundColor: '#E2E3E6'
    },
    narrationContainerInputText: {
        fontSize: 14,
        borderWidth: 1,
        borderColor: customColors.white,
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        marginTop: 20,
        marginHorizontal: 20
    },
    narrationContainerButtonGroup: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginRight: 25,
        marginBottom: 20
    }
})