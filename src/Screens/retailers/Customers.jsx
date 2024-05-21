import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, TextInput, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API } from '../../Config/Endpoint';
import { customColors, typography } from '../../Config/helper';

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
                    <Text style={styles.retailerName}>{item.Retailer_Name}</Text>
                    <Text style={styles.retailerMobile}>{item.Mobile_No}</Text>
                </View>
                <Text style={styles.retailerArea}>{item.AreaGet}</Text>
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
            <View style={styles.retailerHeading}>
                <Text style={styles.retailerTitle}>Retailer Info</Text>
                <Text style={styles.retailerTitle}>Area</Text>
            </View>

            {loading ? (
                <ActivityIndicator style={styles.activityIndicator} size="large" color={customColors.primary} />
            ) : (
                <>
                    {filteredData.length > 0 ? (
                        <FlatList
                            data={filteredData}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                        />

                    ) : (
                        <View style={styles.noDataText}>
                            <Text style={{ ...typography.h5 }}>No data found</Text>
                        </View>
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
    activityIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchInput: {
        ...typography.h6,
        paddingHorizontal: 20,
        margin: 25,
        borderColor: customColors.textSecondary,
        borderWidth: 0.75,
        borderRadius: 30,
    },
    retailerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: customColors.white,
        padding: 15,
        marginTop: 10,
        marginBottom: 10,
        marginHorizontal: 10,
        borderRadius: 10,
        shadowColor: customColors.surface,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    retailerInfo: {
        flex: 1,
        flexDirection: 'column',
    },
    retailerHeading: {
        flexDirection: 'row',
        alignContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: customColors.background,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    retailerTitle: {
        flex: 1,
        ...typography.h6,
        fontWeight: '600',
        textAlign: 'left',
    },
    retailerName: {
        ...typography.h6,
        fontWeight: '700',
    },
    retailerMobile: {
        ...typography.h6,
        fontWeight: '400',
    },
    retailerArea: {
        ...typography.h6,
        fontWeight: '400',
        paddingHorizontal: 50,
    },
    noDataText: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        color: customColors.textSecondary,
        fontSize: 16,
    },
});