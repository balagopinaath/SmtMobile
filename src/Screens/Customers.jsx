import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import CustomIcon from '../Components/CustomIcon';
import Colors from '../Config/Colors';
import Fonts from '../Config/Fonts';
import { API } from '../Config/Endpoint';

const Customers = () => {
    const navigation = useNavigation();
    const [data, setData] = useState([]);
    const [area, setArea] = useState([]);
    const [selectedArea, setSelectedArea] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filteredData, setFilteredData] = useState([]);
    const [filteredRetailers, setFilteredRetailers] = useState([])
    const [selectedRetailer, setSelectedRetailer] = useState(null);

    useEffect(() => {
        fetchCustomersData();
        fetchAreas();
    }, []);

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

    useEffect(() => {
        if (selectedArea) {
            const filtered = data.filter(r => r.Area_Id === selectedArea.Area_Id);
            setFilteredData(filtered);
        } else {
            setFilteredData(data);
        }
    }, [selectedArea, data]);

    useEffect(() => {
        if (selectedArea) {
            const filteredRetailers = data.filter(r => r.Area_Id === selectedArea.Area_Id);
            setFilteredRetailers(filteredRetailers);
        } else {
            setFilteredRetailers([]);
        }
    }, [selectedArea, data]);

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <CustomIcon name="angle-left" color={Colors.white} size={25} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Retailers</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <>
                    <Dropdown
                        style={styles.dropdown}
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
                        search
                        searchPlaceholder="Search areas"
                        inputSearchStyle={styles.inputSearchStyle}
                    />
                    <Dropdown
                        style={styles.dropdown}
                        data={filteredRetailers} // Use filteredRetailers state
                        labelField="Retailer_Name"
                        valueField="Retailer_Id"
                        placeholder="Select retailer"
                        value={selectedRetailer}
                        onChange={item => setSelectedRetailer(item)}
                        maxHeight={300}
                        search
                        searchPlaceholder="Search retailers"
                        inputSearchStyle={styles.inputSearchStyle}
                    />
                    <Text style={styles.headerRetail}>Retailers in Selected Area:</Text>
                    <ScrollView>
                        {filteredData.map(item => (
                            <TouchableOpacity key={item.Retailer_Id} onPress={() => navigation.navigate('CustomersDetails', { item })}>
                                <View style={styles.itemContainer}>
                                    <Image
                                        source={{ uri: item.imageUrl }}
                                        style={styles.itemImage}
                                    />
                                    <View style={{ flex: 1, }}>
                                        <Text style={styles.itemText}>{item.Retailer_Name}</Text>
                                        <Text style={styles.itemMobile}>{item.Mobile_No}</Text>
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
        backgroundColor: Colors.background,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: Colors.primary,
        marginBottom: 20
    },
    headerText: {
        fontFamily: Fonts.plusJakartaSansMedium,
        color: Colors.white,
        fontSize: 15,
        marginLeft: 15
    },
    dropdown: {
        marginHorizontal: 20,
        marginVertical: 5,
        height: 50,
        padding: 10,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    headerRetail: {
        fontSize: 16,
        fontWeight: '800',
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 10,
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
        borderRadius: 5, // Optional: Add rounded corners
    },
    item: {
        fontSize: 14,
        marginVertical: 2,
    },
});

