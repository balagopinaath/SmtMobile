import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, TextInput, FlatList, useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API } from '../../Config/Endpoint';
import { customColors, typography } from '../../Config/helper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Customers = () => {
    const navigation = useNavigation();
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const scheme = useColorScheme();
    const colors = customColors[scheme === 'dark' ? 'dark' : 'light'];

    useEffect(() => {
        (async () => {
            try {
                const companyId = await AsyncStorage.getItem('Company_Id');
                fetchRetailersData(companyId)
            } catch (err) {
                console.log(err);
            }
        })();
    }, []);

    const fetchRetailersData = async (id) => {
        try {
            const response = await fetch(`${API.retailers}${id}`);
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
            <View style={styles(colors).retailerContainer}>
                <View style={styles(colors).retailerInfo}>
                    <Text maxFontSizeMultiplier={1.2} style={styles(colors).retailerName}>{item.Retailer_Name}</Text>
                    <Text maxFontSizeMultiplier={1.2} style={styles(colors).retailerMobile}>{item.Mobile_No}</Text>
                </View>
                <Text maxFontSizeMultiplier={1.2} style={styles(colors).retailerArea}>{item.AreaGet}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles(colors).container}>
            <TextInput
                maxFontSizeMultiplier={1.2}
                value={searchQuery}
                style={styles(colors).searchInput}
                placeholder="Search by retailer name"
                onChangeText={handleSearch}
                returnKeyType="search"
            />
            <View style={styles(colors).retailerHeading}>
                <Text maxFontSizeMultiplier={1.2} style={styles(colors).retailerTitle}>Retailer Info</Text>
                <Text maxFontSizeMultiplier={1.2} style={styles(colors).retailerTitle}>Area</Text>
            </View>

            {loading ? (
                <ActivityIndicator style={styles(colors).activityIndicator} size="large" color={colors.primary} />
            ) : (
                <>
                    {filteredData.length > 0 ? (
                        <FlatList
                            data={filteredData}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                        />

                    ) : (
                        <View style={styles(colors).noDataText}>
                            <Text maxFontSizeMultiplier={1.2} style={{ ...typography.h5(colors) }}>No data found</Text>
                        </View>
                    )}
                </>

            )}
        </View >
    );
};

export default Customers;

const styles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    activityIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchInput: {
        ...typography.h6(colors),
        paddingHorizontal: 10,
        margin: 15,
        borderColor: colors.textSecondary,
        borderWidth: 1,
        borderRadius: 15,
        backgroundColor: colors.secondary
    },
    retailerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.background === "#000000" ? colors.black : colors.white,
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 10,
        borderRadius: 10,
        shadowColor: colors.surface,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    retailerInfo: {
        flex: 2,
        flexDirection: 'column',
        marginRight: 10,
    },
    retailerHeading: {
        flexDirection: 'row',
        alignContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    retailerTitle: {
        flex: 1,
        ...typography.h6(colors),
        fontWeight: '600',
    },
    retailerName: {
        ...typography.h6(colors),
        fontWeight: '700',
        marginBottom: 5,
    },
    retailerMobile: {
        ...typography.body1(colors),
        fontWeight: '400',
    },
    retailerArea: {
        ...typography.body1(colors),
        fontWeight: '400',
        paddingHorizontal: 50,
        textAlign: 'right',
    },
    noDataText: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        color: colors.textSecondary,
        fontSize: 16,
    },
});