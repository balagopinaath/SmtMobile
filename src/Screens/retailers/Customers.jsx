import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView, Image, TextInput, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import CustomIcon from 'react-native-vector-icons/FontAwesome';
import { API } from '../../Config/Endpoint';
import { customColors, customFonts } from '../../Config/helper';

const Customers = () => {
    const navigation = useNavigation();
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRetailersData();
    }, []);

    const fetchRetailersData = async () => {
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

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (Array.isArray(data)) {
            const filtered = data.filter(item => {
                return item.Retailer_Name.toLowerCase().includes(query.toLowerCase()) ||
                    item.Mobile_No.includes(query);
            });
            setFilteredData(filtered);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.push('CustomersDetails', { item })}>
            <View style={styles.retailerContainer}>
                <View style={styles.retailerInfo}>
                    <Text style={styles.retailerInfo}>{item.Retailer_Name}</Text>
                    <Text style={styles.retailerInfo}>{item.Mobile_No}</Text>
                </View>
                <Text style={styles.retailerArea}>{item.AreaGet}</Text>
                {/* Add more Text components for other fields */}
            </View>
        </TouchableOpacity>
    );


    return (
        <View style={styles.container}>
            <TextInput
                value={searchQuery}
                style={styles.searchInput}
                placeholder="Search by retailer name"
                onChangeText={handleSearch}
                returnKeyType="search"
            />
            <View style={styles.retailerContainer}>
                <Text style={styles.retailerTitle}>Retailer Info</Text>
                <Text style={styles.retailerTitle}>Area</Text>
            </View>

            {loading ? (
                <ActivityIndicator style={styles.activityIndicator} size="large" color={customColors.primary} />
            ) : (
                <>
                    {filteredData.length > 0 ? (
                        <FlatList style={{ color: '#000' }}
                            data={filteredData}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                        />

                    ) : (
                        <Text style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>No data found</Text>
                    )}
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
        fontFamily: customFonts.plusJakartaSansRegular,
        fontSize: 16,
        paddingHorizontal: 20,
        margin: 20,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 30,
    },
    retailerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    retailerTitle: {
        flex: 1,
        fontFamily: customFonts.plusJakartaSansBold,
        fontSize: 14,
        fontWeight: '500',
        marginHorizontal: 25,
        color: customColors.text,
    },
    retailerInfo: {
        fontFamily: customFonts.plusJakartaSansRegular,
        fontSize: 14,
        fontWeight: '500',
        paddingHorizontal: 15,
        color: customColors.text,
    },
    retailerArea: {
        fontFamily: customFonts.plusJakartaSansRegular,
        fontSize: 14,
        fontWeight: '500',
        paddingHorizontal: 50,
        color: customColors.text,
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

