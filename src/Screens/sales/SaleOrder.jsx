import { Alert, Button, Image, KeyboardAvoidingView, Modal, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View, useColorScheme } from 'react-native'
import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import PagerView from 'react-native-pager-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-element-dropdown';
import { API } from '../../Config/Endpoint';
import { customColors, customFonts, typography } from '../../Config/helper';
import CustomButton from '../../Components/CustomButton';

const SaleOrder = ({ route }) => {
    const navigation = useNavigation();
    const pagerRef = useRef(null);
    const scheme = useColorScheme();
    const colors = customColors[scheme === 'dark' ? 'dark' : 'light'];
    const [selectedTab, setSelectedTab] = useState(0);
    const [productData, setProductData] = useState([])
    const initialStockValue = {
        So_Id: '',
        Company_Id: '',
        ST_Date: new Date().toISOString().split('T')[0],
        Branch_Id: '',
        Retailer_Id: '',
        Retailer_Name: '',
        Narration: '',
        Created_by: '',
        Product_Array: [],
        Sales_Person_Id: '',
    }
    const [stockInputValue, setStockInputValue] = useState(initialStockValue)
    const [retailers, setRetailers] = useState([])
    const [selectedRetail, setSelectedRetail] = useState(null);
    const [quantities, setQuantities] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [total, setTotal] = useState(0);
    const [isEdit, setIsEdit] = useState(false);
    const [saleOrderId, setSaleOrderId] = useState(null);


    useEffect(() => {
        const initialize = async () => {
            try {
                const userId = await AsyncStorage.getItem('UserId');
                const branchId = await AsyncStorage.getItem('branchId');
                const companyId = await AsyncStorage.getItem('Company_Id');

                fetchRetailers(companyId);
                fetchGroupedproducts(companyId);

                setStockInputValue(prev => ({
                    ...prev,
                    Created_by: userId,
                    Sales_Person_Id: userId,
                    Branch_Id: branchId,
                }));
            } catch (err) {
                console.log(err);
            }

            // Check if editing
            if (route.params?.isEdit && route.params?.item) {
                const { item } = route.params;
                setIsEdit(true);
                setSaleOrderId(item.Sales_Order_Id);
                setSelectedRetail(item.Retailer_Id);
                setStockInputValue({
                    So_Id: item.So_Id,
                    Company_Id: item.Company_Id,
                    ST_Date: new Date(item.So_Date).toISOString().split('T')[0],
                    Retailer_Id: item.Retailer_Id,
                    Retailer_Name: item.Retailer_Name,
                    Branch_Id: item.Branch_Id,
                    Narration: item.Narration,
                    Created_by: item.Created_by,
                    Product_Array: item.Products_List,
                    Sales_Person_Id: item.Sales_Person_Id,
                });
                setQuantities(item.Products_List.map(product => ({
                    Item_Id: product.Item_Id,
                    Bill_Qty: product.Bill_Qty.toString(),
                    Item_Rate: product.Item_Rate.toString(),
                })));
            }
        };

        initialize();
    }, [])

    const fetchRetailers = async (id) => {
        try {
            const response = await fetch(`${API.retailers}${id}`);
            const jsonData = await response.json();

            if (jsonData.success) {
                setRetailers(jsonData.data)
            }

        } catch (err) {
            console.error("Error fetching data:", err);
        }
    }

    const fetchGroupedproducts = async (id) => {
        console.log(`${API.groupedProducts}${id}`)
        fetch(`${API.groupedProducts}${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setProductData(data.data)
                }
            }).catch(e => console.error(e))
    };

    const handleTabPress = (index) => {
        setSelectedTab(index);
        pagerRef.current.setPage(index);
    };

    const onPageSelected = (e) => {
        setSelectedTab(e.nativeEvent.position);
    };

    const handleQuantityChange = (productId, value, rate) => {
        const updatedQuantities = [...quantities];
        const productIndex = updatedQuantities.findIndex(item => item.Item_Id === productId);

        if (productIndex !== -1) {
            updatedQuantities[productIndex].Bill_Qty = value;
            updatedQuantities[productIndex].Item_Rate = rate;
        } else {
            updatedQuantities.push({
                Item_Id: productId,
                Bill_Qty: value,
                Item_Rate: rate,
            });
        }
        setQuantities(updatedQuantities);
    };

    function numberToWords(num) {
        const under20 = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
        const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
        const thousand = ['thousand', 'million', 'billion'];

        if (num < 20) return under20[num];
        if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 === 0 ? '' : ' ' + under20[num % 10]);
        if (num < 1000) return under20[Math.floor(num / 100)] + ' hundred' + (num % 100 === 0 ? '' : ' ' + numberToWords(num % 100));

        for (let i = 0; i < thousand.length; i++) {
            let decimal = Math.pow(1000, i + 1);
            if (num < decimal) {
                return numberToWords(Math.floor(num / Math.pow(1000, i))) + ' ' + thousand[i - 1] + (num % Math.pow(1000, i) === 0 ? '' : ' ' + numberToWords(num % Math.pow(1000, i)));
            }
        }
        return num;
    }

    useEffect(() => {
        let newTotal = 0;
        productData.forEach(group => {
            group.GroupedProductArray.forEach(product => {
                const quantityObj = quantities.find(item => item.Item_Id === product.Product_Id);
                if (quantityObj && quantityObj.Bill_Qty > 0) {
                    const qty = parseFloat(quantityObj.Bill_Qty);
                    const rate = parseFloat(quantityObj.Item_Rate) || 0;
                    newTotal += qty * rate;
                }
            });
        });
        setTotal(isNaN(newTotal) ? 0 : newTotal);
    }, [quantities, productData]);

    const handlePreview = () => {
        setModalVisible(true);
    };

    const handleSubmit = async () => {
        if (quantities.length <= 0 || !selectedRetail) {
            Alert.alert('Error', 'Please select a retailer and enter product quantities.');
            return;
        }

        const orderProducts = quantities.filter(q => parseFloat(q.Bill_Qty) > 0);

        if (orderProducts.length <= 0) {
            Alert.alert('Error', 'Enter at least one product quantity.');
            return;
        }

        const orderDetails = {
            ...stockInputValue,
            Product_Array: orderProducts
        };

        // console.log("Final order details:", orderDetails);

        try {
            const method = isEdit ? 'PUT' : 'POST';
            const response = await fetch(`${API.saleOrder}`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderDetails)
            });

            const data = await response.json();
            console.log('post data', data)

            if (data.success) {
                Alert.alert('Success', data.message);
                // Reset state after successful submission
                setStockInputValue(initialStockValue);
                setQuantities([]);
                setSelectedRetail(null);
                setModalVisible(false);
            } else {
                Alert.alert('Error', data.message);
            }
        } catch (err) {
            console.log(err)
            Alert.alert('Error', err);
        }
    }

    return (
        <View style={styles(colors).container}>
            <Dropdown
                data={retailers}
                labelField="Retailer_Name"
                valueField="Retailer_Id"
                placeholder="Select Retailer"
                value={selectedRetail}
                onChange={item => {
                    setSelectedRetail(item.Retailer_Id);
                    setStockInputValue(prevState => ({
                        ...prevState,
                        Retailer_Id: item.Retailer_Id,
                        Retailer_Name: item.Retailer_Name,
                        Company_Id: item.Company_Id,
                    }));
                }}
                maxHeight={300}
                search
                searchPlaceholder="Search Retailer"
                style={styles(colors).dropdown}
                containerStyle={styles(colors).dropdownContainer}
                placeholderStyle={styles(colors).placeholderStyle}
                selectedTextStyle={styles(colors).selectedTextStyle}
                inputSearchStyle={styles(colors).inputSearchStyle}
            />
            <View style={styles(colors).narrationContainer}>
                <TextInput
                    maxFontSizeMultiplier={1.2}
                    style={styles(colors).narrationContainerInputText}
                    placeholder='Narration'
                    onChangeText={(text) => setStockInputValue({ ...stockInputValue, Narration: text })}
                />
                <View style={styles(colors).narrationContainerButtonGroup}>
                    <CustomButton onPress={() => navigation.goBack()}>Cancel</CustomButton>
                    <CustomButton onPress={handlePreview}>Preview</CustomButton>
                </View>
            </View>

            <View style={{}}>
                <ScrollView horizontal
                    contentContainerStyle={styles(colors).tabContainer}
                    showsHorizontalScrollIndicator={true}
                >
                    {productData.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles(colors).tabButton,
                                selectedTab === index
                                && styles(colors).activeTab
                            ]}
                            onPress={() => handleTabPress(index)}
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
                        {productData.map((group, groupIndex) => (
                            <View key={groupIndex}>
                                {group.GroupedProductArray.map((product, pIndex) => (
                                    <View key={pIndex} style={styles(colors).pagerViewContainer}>
                                        <View style={{ flexDirection: 'row', paddingVertical: 15 }}>
                                            <Image
                                                style={{
                                                    width: 125,
                                                    height: 125,
                                                    borderRadius: 8,
                                                    marginRight: 10,
                                                }}
                                                source={{ uri: product.productImageUrl }}
                                            />
                                            <View style={styles(colors).card}>
                                                <Text style={styles(colors).pagerViewContainerText}>{product.Product_Name}</Text>
                                                <Text style={styles(colors).pagerViewContainerSubText}>{product.UOM}</Text>
                                                <TextInput
                                                    style={styles(colors).pagerViewContainerInputText}
                                                    onChangeText={(text) =>
                                                        handleQuantityChange(product.Product_Id, text, product.Item_Rate)
                                                    }
                                                    value={
                                                        quantities.find(item => item.Item_Id === product.Product_Id)?.Bill_Qty || ''
                                                    }
                                                    placeholder="Quantity"
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

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View style={styles(colors).modalOverlay}>
                        <View style={styles(colors).modalContent}>
                            <Text style={styles(colors).modalTitle}>Order Summary</Text>
                            <Text>{stockInputValue.Retailer_Name}</Text>
                            <ScrollView style={styles(colors).tableContainer}>
                                <View style={styles(colors).tableHeader}>
                                    <Text style={styles(colors).headerText}>Name</Text>
                                    <Text style={styles(colors).headerText}>Qty</Text>
                                    <Text style={styles(colors).headerText}>UOM</Text>
                                    <Text style={styles(colors).headerText}>Rate</Text>
                                    <Text style={styles(colors).headerText}>Amount</Text>
                                </View>
                                {productData.map((group, groupIndex) => (
                                    group.GroupedProductArray.map((product, pIndex) => {
                                        const quantityObj = quantities.find(item => item.Item_Id === product.Product_Id);
                                        if (quantityObj && quantityObj.Bill_Qty > 0) {
                                            const qty = quantityObj.Bill_Qty;
                                            const rate = quantityObj.Item_Rate || 0;
                                            const amount = qty * rate;
                                            return (
                                                <View key={pIndex} style={styles(colors).tableRow}>
                                                    <Text style={styles(colors).rowText}>{product.Product_Name}</Text>
                                                    <Text style={styles(colors).rowText}>{qty}</Text>
                                                    <Text style={styles(colors).rowText}>{product.UOM}</Text>
                                                    <Text style={styles(colors).rowText}>{rate}</Text>
                                                    <Text style={styles(colors).rowText}>{amount.toFixed(2)}</Text>
                                                </View>
                                            );
                                        }
                                    })
                                ))}
                            </ScrollView>
                            <View style={styles(colors).totalContainer}>
                                <Text style={styles(colors).totalText}>Total Amount: ₹{total.toFixed(2)}/-</Text>
                                <Text style={styles(colors).totalText}>In Words: {numberToWords(total)} only.</Text>
                            </View>
                            <TouchableOpacity
                                style={styles(colors).closeButton}
                                onPress={handleSubmit}
                            >
                                <Text>Submit Order</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles(colors).closeButton}
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                <Text>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    )
}

export default SaleOrder

const styles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    narrationContainer: {
        marginHorizontal: 20,
        marginVertical: 10,
    },
    narrationContainerInputText: {
        ...typography.h6(colors),
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
    dropdown: {
        marginHorizontal: 20,
        marginVertical: 20,
        height: 45,
        padding: 15,
        borderRadius: 10,
        borderWidth: 0.5,
    },
    dropdownContainer: {
        backgroundColor: colors.background,
        borderColor: colors.textPrimary,
        borderWidth: 0.5,
        borderRadius: 10,
    },
    placeholderStyle: {
        ...typography.h6(colors),
        fontWeight: '500'
    },
    selectedTextStyle: {
        ...typography.h6(colors),
        fontWeight: '600'
    },
    inputSearchStyle: {
        ...typography.h6(colors),
        fontWeight: '400'
    },
    tabContainer: {
        height: 55,
        flexDirection: 'row',
        backgroundColor: colors.background === "#000000" ? colors.black : colors.white,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 50,
    },
    tabButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: colors.primary,
    },
    pagerViewContainer: {
        backgroundColor: colors.background === "#000000" ? colors.black : colors.white,
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
        ...typography.body1(colors),
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
    pagerViewContainerInputText: {
        fontFamily: customFonts.plusJakartaSansSemiBold,
        fontSize: 14,
        padding: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        marginTop: 5,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        width: '90%', // Adjust size according to your preference
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    tableContainer: {
        maxHeight: 300, // Set a max height for scrollable content
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    headerText: {
        flex: 1, // Equal width columns
        textAlign: 'center',
        fontWeight: 'bold',
        padding: 10,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    rowText: {
        flex: 1,
        textAlign: 'center',
        padding: 10,
    },
    closeButton: {
        marginTop: 10,
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#ddd',
        borderRadius: 5,
    },
    totalContainer: {
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: '#ddd',  // Light grey border for a subtle separation
        marginTop: 10,
        backgroundColor: 'white', // White background for the total section
        // alignItems: 'center', // Center alignment of total text
    },

    totalText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333', // Dark grey color for text for better readability
    }
})