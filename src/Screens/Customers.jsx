import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import CustomIcon from 'react-native-vector-icons/FontAwesome';
import { API } from '../Config/Endpoint';
import { customColors, customFonts } from '../Config/helper';

const Customers = () => {
    const navigation = useNavigation();
    const [data, setData] = useState([]);
    const [area, setArea] = useState([]);
    const [selectedArea, setSelectedArea] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filteredData, setFilteredData] = useState([]);
    const [filteredRetailers, setFilteredRetailers] = useState([])
    const [selectedRetailer, setSelectedRetailer] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchCustomersData();
        fetchAreas();
    }, []);

    const fetchAreas = async () => {
        try {
            const response = await fetch(API.areas);
            if (!response.ok) {
                throw new Error(`API request failed with status: ${response.status}`);
            }
            const jsonData = await response.json();
            setArea(jsonData.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchCustomersData = async () => {
        try {
            const response = await fetch(`${API.retailers}${1}`);
            if (!response.ok) {
                throw new Error(`API request failed with status: ${response.status}`);
            }
            const jsonData = await response.json();
            setData(jsonData.data);
            setFilteredData(jsonData.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!selectedRetailer) { // Only filter by area if no retailer is selected
            if (selectedArea) {
                const filtered = data.filter(r => r.Area_Id === selectedArea.Area_Id);
                setFilteredData(filtered);
            } else {
                setFilteredData(data);
            }
        }
    }, [selectedArea, data]);

    useEffect(() => {
        if (!selectedRetailer) { // Only update retailers if no specific retailer is selected
            if (selectedArea) {
                const filteredRetailers = data.filter(r => r.Area_Id === selectedArea.Area_Id);
                setFilteredRetailers(filteredRetailers);
            } else {
                setFilteredRetailers([]);
            }
        }
    }, [selectedArea, data]);

    const filterDataBasedOnRetailer = (retailer) => {
        if (retailer) {
            const newData = data.filter(item => item.Retailer_Id === retailer.Retailer_Id);
            setFilteredData(newData);
        } else {
            // No retailer selected, revert to showing all data within the selected area
            const areaData = data.filter(item => item.Area_Id === (selectedArea ? selectedArea.Area_Id : null));
            setFilteredData(areaData);
        }
    };

    useEffect(() => {
        if (searchQuery.length > 0) {
            const filtered = data.filter(item =>
                item.Retailer_Name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredData(filtered);
        } else {
            // Revert to filtering based on dropdown selections if search is cleared
            if (selectedRetailer) {
                filterDataBasedOnRetailer(selectedRetailer);
            } else if (selectedArea) {
                const filtered = data.filter(r => r.Area_Id === selectedArea.Area_Id);
                setFilteredData(filtered);
            } else {
                setFilteredData(data);
            }
        }
    }, [searchQuery, data, selectedArea, selectedRetailer]);

    return (
        <View style={styles.container}>

            {loading ? (
                <ActivityIndicator style={styles.activityIndicator} size="large" color={customColors.primary} />
            ) : (
                <>
                    <View style={styles.dropdownContainer}>
                        <Dropdown
                            data={area}
                            labelField="Area_Name"
                            valueField="Area_Id"
                            placeholder="Select area"
                            value={selectedArea}
                            onChange={item => {
                                setSelectedArea(item);
                                setSelectedRetailer(null);
                            }}
                            maxHeight={300}
                            // disable={selectedRetailer !== null}
                            search
                            searchPlaceholder="Search areas"
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                        />
                        <Dropdown
                            data={[{ Retailer_Id: 'all', Retailer_Name: 'All Retailers' }, ...filteredRetailers]}
                            labelField="Retailer_Name"
                            valueField="Retailer_Id"
                            placeholder="Select retailer"
                            value={selectedRetailer ? selectedRetailer.Retailer_Id : null}
                            onChange={item => {
                                if (item.Retailer_Id === 'all') {
                                    // If 'All Retailers' option is selected, reset the selected retailer
                                    setSelectedRetailer(null);
                                    // Set filtered data to all retailers' data
                                    setFilteredData(data)
                                } else {
                                    setSelectedRetailer(item);
                                    filterDataBasedOnRetailer(item);
                                }
                            }}
                            // disable={selectedArea !== null}
                            maxHeight={300}
                            search
                            searchPlaceholder="Search retailers"
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                        />
                    </View>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by retailer name"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        returnKeyType="search"
                    />
                    <Text style={styles.headerRetail}>Retailers in Selected Area:</Text>
                    <ScrollView>
                        {filteredData.map(item => (
                            <TouchableOpacity key={item.Retailer_Id} onPress={() => navigation.navigate('CustomersDetails', { item })}>
                                <View style={styles.itemContainer}>
                                    <View style={{ flex: 1, }}>
                                        <Text style={styles.itemText}>{item.Retailer_Name}</Text>
                                        <Text style={styles.itemMobile}>{item.Mobile_No}</Text>
                                        <Text style={styles.itemMobile}>{item.AreaGet}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </>
            )}
        </View >
    );
};

export default Customers;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: customColors.background,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: customColors.primary,
        marginBottom: 20
    },
    headerText: {
        fontFamily: customFonts.plusJakartaSansBold,
        color: customColors.white,
        fontSize: 15,
        fontWeight: '500',
        textAlign: 'center',
        marginLeft: 15
    },
    activityIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchInput: {
        fontSize: 16,
        padding: 10,
        margin: 15,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
    },
    dropdownContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginHorizontal: 20,
        marginVertical: 20,
    },
    dropdown: {
        width: '50%',
        marginHorizontal: 15,
        height: 45,
        padding: 15,
        borderRadius: 10,
        borderWidth: 0.5,
    },
    placeholderStyle: {
        fontFamily: customFonts.plusJakartaSansBold,
        fontSize: 15,
        fontWeight: '500'
    },
    selectedTextStyle: {
        fontFamily: customFonts.plusJakartaSansMedium,
        fontSize: 15,
        fontWeight: '600'
    },
    inputSearchStyle: {
        fontFamily: customFonts.plusJakartaSansMedium,
        fontSize: 14,
        fontWeight: '400'
    },
    headerRetail: {
        fontFamily: customFonts.plusJakartaSansMedium,
        fontSize: 16,
        fontWeight: '500',
        color: customColors.black,
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 15,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: 'gray',
    },
    itemImage: {
        width: 50,
        height: 50,
        marginRight: 15,
        borderRadius: 5,
    },
    itemText: {
        fontFamily: customFonts.plusJakartaSansMedium,
        fontSize: 15,
        fontWeight: '500',
        color: customColors.black,
        marginVertical: 2,
    },
    itemMobile: {
        fontFamily: customFonts.plusJakartaSansMedium,
        fontSize: 12,
        fontWeight: '200',
    }
});

