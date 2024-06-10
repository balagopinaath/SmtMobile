import { Image, Modal, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View, useColorScheme } from 'react-native'
import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import PagerView from 'react-native-pager-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../Config/Endpoint';
import { customColors, typography } from '../Config/helper';
import CustomButton from '../Components/CustomButton';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/AntDesign';

const StockClosing = ({ route }) => {
    const navigation = useNavigation();
    const { item, isEdit } = route.params;
    const scheme = useColorScheme();
    const colors = customColors[scheme === 'dark' ? 'dark' : 'light'];
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
    const [modalVisible, setModalVisible] = useState(false);

    const [productPacks, setProductPacks] = useState([])
    const [dropdownData, setDropdownData] = useState([])
    const [selectedProductGroup, setSelectedProductGroup] = useState(dropdownData[0]?.Pack_Id || 0);
    const [filteredProductData, setFilteredProductData] = useState([]);
    const [selectedProductPack, setSelectedProductPack] = useState(null);

    const [isImageModalVisible, setImageModalVisible] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const userId = await AsyncStorage.getItem('UserId');
                const companyId = await AsyncStorage.getItem('Company_Id');
                fetchproductPacks(companyId)

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
                    filterProductDataByPack(selectedProductGroup, data.data)
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

    const fetchproductPacks = async (id) => {
        try {
            const response = await fetch(`${API.productPacks}${id}`);
            const jsonData = await response.json();

            if (jsonData.success) {
                const dropdownOptions = [
                    { Pack: "All", Pack_Id: 0 },
                    ...jsonData.data.filter(pack => pack.Pack_Id !== 0)
                ];
                setDropdownData(dropdownOptions);
                const initialPackId = dropdownOptions[0]?.Pack_Id || 0;
                setSelectedProductGroup(initialPackId);
                filterProductDataByPack(initialPackId, productData);

                setProductPacks(jsonData.data);
            }
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };

    const filterProductDataByPack = (packId, data) => {
        // console.log("Filtering with Pack Id:", packId); // Debug log
        const filteredData = (data || productData).map(group => {
            const filteredGroup = {
                ...group,
                GroupedProductArray: group.GroupedProductArray.filter(product => product.Pack_Id === packId || packId === 0)
            };
            return filteredGroup.GroupedProductArray.length ? filteredGroup : null;
        }).filter(group => group !== null);

        // console.log("Filtered Data:", JSON.stringify(filteredData, null, 2)); // Debug log
        setFilteredProductData(filteredData);
    };

    const handlePackSelection = (packId) => {
        setSelectedProductPack(packId);
        filterProductDataByPack(packId);
    };

    const getStockCount = (productId) => {
        const mergedData = productClosingData.filter(item => Number(item.Item_Id) === Number(productId));
        if (mergedData.length > 0 && mergedData[0].Previous_Balance !== undefined) {
            return {
                previousBalance: mergedData[0].Previous_Balance,
                hasPreviousBalance: mergedData[0].Previous_Balance > 0
            };
        } else {
            return {
                previousBalance: 0,
                hasPreviousBalance: false
            };
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

    const handleUpdatePress = () => {
        setModalVisible(true);
    };

    const handleModalSubmit = () => {
        setModalVisible(false);
        postClosingStock();
    };

    const handleImagePress = (imageUrl) => {
        setCurrentImage(imageUrl);
        setImageModalVisible(true);
    };

    const productIdToNameMap = productData.reduce((acc, group) => {
        group.GroupedProductArray.forEach(product => {
            acc[product.Product_Id] = product.Product_Name;
        });
        return acc;
    }, {});

    return (
        <View style={styles(colors).container}>
            <View style={styles(colors).headerContainer}>
                <View style={styles(colors).headerInterContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrowleft" color={colors.white} size={23} />
                    </TouchableOpacity>
                    <Text style={styles(colors).headerContainerText} maxFontSizeMultiplier={1.2}>Closing Stock</Text>
                </View>
                <TouchableOpacity onPress={handleUpdatePress} style={styles(colors).updateContainer}>
                    <Text style={styles(colors).updateText}>
                        UPDATE
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles(colors).retailerInfo}>
                <Icon name="user" size={22} color={colors.primary} />
                <Text style={styles(colors).retailerLabel}>{item.Retailer_Name}</Text>
            </View>

            <Dropdown
                data={dropdownData}
                labelField='Pack'
                valueField="Pack_Id"
                placeholder="Select Product Group"
                value={selectedProductGroup}
                onChange={item => {
                    setSelectedProductGroup(item.Pack_Id);
                    handlePackSelection(item.Pack_Id);
                }}
                maxHeight={300}
                style={styles(colors).dropdown}
                containerStyle={styles(colors).dropdownContainer}
                placeholderStyle={styles(colors).placeholderStyle}
                selectedTextStyle={styles(colors).selectedTextStyle}
            />

            <View style={{ flex: 1 }}>
                <ScrollView horizontal contentContainerStyle={styles(colors).tabContainer} showsHorizontalScrollIndicator={true}>
                    {filteredProductData.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles(colors).tabButton,
                                selectedTab === index
                                && styles(colors).activeTab
                            ]}
                            onPress={() => { handleTabPress(index) }}
                        >
                            <Text maxFontSizeMultiplier={1.2}>{item.Pro_Group}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <ScrollView>
                    <PagerView
                        style={{ marginBottom: 250, }}
                        initialPage={selectedTab}
                        ref={pagerRef}
                        onPageSelected={onPageSelected}
                    >

                        {filteredProductData.map((item, index) => (
                            <View key={index}>
                                {item.GroupedProductArray.map((product, pIndex) => {
                                    const stockCount = getStockCount(product.Product_Id);
                                    return (
                                        <View key={pIndex} style={styles(colors).pagerViewContainer}>
                                            <View style={styles(colors).card}>
                                                <TouchableOpacity
                                                    style={{
                                                        width: "40%",
                                                        height: 175,
                                                        marginTop: 25,
                                                    }} onPress={() => handleImagePress(product.productImageUrl)}>
                                                    <Image
                                                        style={{
                                                            width: "100%",
                                                            height: '100%',
                                                            borderRadius: 8,
                                                            marginRight: 10,
                                                            resizeMode: 'contain'
                                                        }}
                                                        source={{
                                                            uri: product.productImageUrl,
                                                        }}
                                                    />
                                                </TouchableOpacity>
                                                <View style={styles(colors).retailersContainer}>
                                                    <Text style={styles(colors).pagerViewContainerText}>{product.Product_Name}</Text>
                                                    <Text style={styles(colors).pagerViewContainerSubText}>{product.UOM}</Text>
                                                    <Text style={styles(colors).dateText}>Closing Date: {getClosingStockDate(product.Product_Id).toLocaleDateString()}</Text>
                                                    <Text style={[styles(colors).dateText, stockCount.hasPreviousBalance && styles(colors).highlightedText]}>Previous Stock: {stockCount.previousBalance}</Text>
                                                    <TextInput
                                                        style={styles(colors).pagerViewContainerInputText}
                                                        onChangeText={(text) =>
                                                            handleStockInputChange(
                                                                product.Product_Id,
                                                                text,
                                                                getClosingStockDate(product.Product_Id),
                                                                stockCount.previousBalance
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
                                                        placeholder="Closing Stock Qty"
                                                        keyboardType='number-pad'
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        ))}
                    </PagerView>
                </ScrollView>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View style={styles(colors).modalOverlay}>
                    <View style={styles(colors).modalContainer}>
                        <Text style={styles(colors).modalTitle}>Confirmation</Text>
                        {closingStockValues.map((stock, index) => (
                            <View key={index} style={styles(colors).confirmContainer}>
                                <View style={styles(colors).confirmTextContainer}>
                                    <Text style={styles(colors).productText}>{productIdToNameMap[stock.Product_Id]}</Text>
                                    <Text style={styles(colors).quantityText}>Quantity: {stock.ST_Qty}</Text>
                                </View>
                            </View>
                        ))}
                        <TextInput
                            style={styles(colors).modalInputText}
                            placeholder='Narration'
                            onChangeText={(text) =>
                                setStockInputValue({
                                    ...stockInputValue,
                                    Narration: text,
                                })
                            }
                        />
                        <View style={{ flexDirection: 'row', marginVertical: 20, marginHorizontal: 75 }}>
                            <CustomButton onPress={handleModalSubmit}>Update</CustomButton>
                            <CustomButton onPress={() => setModalVisible(false)}>Cancal</CustomButton>
                        </View>
                    </View>
                </View>
            </Modal >

            <Modal
                animationType="slide"
                transparent={true}
                visible={isImageModalVisible}
                onRequestClose={() => setImageModalVisible(false)}
            >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
                    <TouchableOpacity onPress={() => setImageModalVisible(false)} style={{ position: 'absolute', top: 40, right: 20 }}>
                        <Icon name="close" size={30} color="#fff" />
                    </TouchableOpacity>
                    <Image
                        source={{ uri: currentImage }}
                        style={{ width: '90%', height: '80%', resizeMode: 'contain' }}
                    />
                </View>
            </Modal>

        </View >
    )
}

export default StockClosing

const styles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.background,
    },
    headerContainer: {
        flexDirection: 'row',
        backgroundColor: colors.primary,
        padding: 20,
        justifyContent: 'space-between'
    },
    headerInterContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerContainerText: {
        ...typography.h5(colors),
        color: colors.white,
        textAlign: 'center',
        marginHorizontal: 10,
    },
    updateContainer: {
        alignSelf: 'flex-end',
        alignItems: 'flex-end'
    },
    updateText: {
        ...typography.body1(colors),
        color: colors.white
    },
    retailerInfo: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    retailerLabel: {
        ...typography.h6(colors),
        color: colors.accent,
        fontWeight: '500',
        marginLeft: 10,
    },
    dropdown: {
        marginHorizontal: 25,
        marginBottom: 15,
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
        ...typography.body1(colors),
        fontWeight: '500'
    },
    selectedTextStyle: {
        ...typography.body1(colors),
        fontWeight: '600'
    },
    tabContainer: {
        height: 50,
        flexDirection: 'row',
        backgroundColor: colors.background === "#000000" ? colors.black : colors.white,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 25
    },
    tabButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: colors.primary,
    },
    pagerViewContainer: {
        backgroundColor: colors.background === "#000000" ? colors.black : colors.white,
        borderRadius: 10,
        margin: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 5,
    },
    card: {
        flexDirection: 'row',
    },
    retailersContainer: {
        width: '60%',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    pagerViewContainerText: {
        ...typography.body1(colors),
        fontWeight: 'bold',
    },
    pagerViewContainerSubText: {
        ...typography.body2(colors),
        fontWeight: '500',
    },
    highlightedText: {
        backgroundColor: '#FFFF00',
        color: '#000',
        fontWeight: 'bold',
    },
    dateText: {
        ...typography.body1(colors),
        // color: '#444',
        marginBottom: 4,
    },
    pagerViewContainerInputText: {
        ...typography.body2(colors),
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        padding: 20,
        backgroundColor: colors.background === "#000000" ? colors.black : colors.white,
        borderRadius: 10,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalTitle: {
        ...typography.h6(colors),
        fontWeight: 'bold',
        marginBottom: 15,
    },
    confirmContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    confirmTextContainer: {
        flex: 1
    },
    productText: {
        ...typography.body1(colors),
        fontWeight: 'bold',
    },
    quantityText: {
        ...typography.body2(colors),
        color: '#888',
    },
    modalInputText: {
        ...typography.h6(colors),
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginHorizontal: 'auto',
        marginTop: 25
    },
})