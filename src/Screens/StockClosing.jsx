import { Button, Image, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome'
import Colors from '../Config/Colors';
import Fonts from '../Config/Fonts';
import PagerView from 'react-native-pager-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../Config/Endpoint';

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

    const [stockValues, setStockValues] = useState({});
    const [stockInputValue, setStockInputValue] = useState(initialStockValue)

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
        updateInitialStockValue()
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

    const handleStockInputChange = (productId, value) => {
        setStockValues(prevState => ({
            ...prevState,
            [productId]: value
        }));
        console.log(productId, value)
    };

    const updateInitialStockValue = () => {
        const productStockList = Object.keys(stockValues).map(productId => ({
            Product_Id: productId,
            Stock_Value: stockValues[productId]
        }));

        setStockInputValue(prevState => ({
            ...prevState,
            Product_Stock_List: productStockList
        }));
    };

    const postClosingStock = async () => {
        updateInitialStockValue();

        if (stockInputValue.Product_Stock_List.length > 0 && stockInputValue.Retailer_Id) {
            try {
                const response = await fetch(API.closingStock, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(stockInputValue)
                });
                const data = await response.json();

                if (data.success) {
                    ToastAndroid.show(data.message, ToastAndroid.SHORT);
                } else {
                    ToastAndroid.show(data.message, ToastAndroid.SHORT);
                }
            } catch (e) {
                console.error(e);
                ToastAndroid.show('Failed to post stock data', ToastAndroid.SHORT);
            }
        } else {
            ToastAndroid.show('Please enter at least one valid stock value', ToastAndroid.SHORT);
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
                                        <TextInput
                                            style={styles.pagerViewContainerInputText}
                                            // value={product.Product_Id}
                                            placeholder={`Previous: ${getStockCount(product.Product_Id)}`}
                                            keyboardType='number-pad'
                                            onChangeText={(text) => handleStockInputChange(product.Product_Id, text)}
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
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="angle-left" color={Colors.white} size={25} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Closing Stock Report</Text>
            </View>

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
                        style={{ flex: 1, marginTop: 15 }}
                        initialPage={selectedTab}
                        ref={pagerRef}
                        onPageSelected={onPageSelected}
                    >
                        {tabs.map((tab, index) => (
                            <View key={index} style={{ flex: 1 }}>
                                {tab.content}
                            </View>
                        ))}
                    </PagerView>
                </ScrollView>
            </View>

            <View style={styles.narrationContainer}>
                <TextInput
                    style={styles.narrationContainerInputText}
                    value={initialStockValue.Narration}
                    placeholder='Narration'
                // onChangeText={(text) => handleInputChange('Retailer_Name', text)}
                />
                <View style={styles.narrationContainerButtonGroup}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={{ color: Colors.black, fontSize: 14, fontWeight: '500', }}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={postClosingStock}>
                        <Text style={{ color: Colors.accent, fontSize: 14, fontWeight: '500', marginLeft: 20 }}>Update</Text>
                    </TouchableOpacity>
                </View>

            </View>

        </View>
    )
}

export default StockClosing

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: Colors.background,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: Colors.primary,
    },
    headerText: {
        fontFamily: Fonts.plusJakartaSansMedium,
        fontSize: 15,
        color: Colors.white,
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
        borderBottomColor: Colors.lightGrey,
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
    pagerViewContainerInputText: {
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 5,
        marginBottom: 20,
    },
    narrationContainer: {
        backgroundColor: '#E2E3E6'
    },
    narrationContainerInputText: {
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#ccc',
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