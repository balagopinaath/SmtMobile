import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, TextInput, FlatList, useColorScheme, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API } from '../../Config/Endpoint';
import { customColors, typography } from '../../Config/helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

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

    const renderItem = useCallback(({ item }) => (
        <TouchableOpacity onPress={() => navigation.push('CustomersDetails', { item })} style={styles(colors).card} >

            <View style={styles(colors).cardContent}>
                <Text maxFontSizeMultiplier={1.2} style={styles(colors).retailerName}>{item.Retailer_Name.trim()}</Text>
                <Text maxFontSizeMultiplier={1.2} style={styles(colors).retailerDetail}>
                    <Icon name="call-outline" size={16} color={colors.primary} /> {item.Mobile_No || 'N/A'}
                </Text>

                <Text maxFontSizeMultiplier={1.2} style={styles(colors).retailerDetail}>
                    <Icon name="location-outline" size={16} color={colors.primary} /> {item.AreaGet}, {item.StateGet}
                </Text>

                <Text maxFontSizeMultiplier={1.2} style={styles(colors).retailerDetail}>
                    <Icon name="business-outline" size={16} color={colors.primary} /> {item.Company_Name}
                </Text>

            </View>
            <Icon name="chevron-forward" size={24} color={colors.primary} style={styles(colors).chevronIcon} />
        </TouchableOpacity>
    ), [colors, navigation]);

    const memoizedRenderItem = useMemo(() => renderItem, [renderItem]);

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

            {loading ? (
                <ActivityIndicator style={styles(colors).activityIndicator} size="large" color={colors.primary} />
            ) : (
                <>
                    {filteredData.length > 0 ? (
                        <FlatList
                            data={filteredData}
                            renderItem={memoizedRenderItem}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={styles(colors).listContainer}
                        />

                    ) : (
                        <View style={styles(colors).noDataContainer}>
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
        padding: 10,
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
        backgroundColor: colors.secondary,
        marginBottom: 30
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background === "#000000" ? colors.black : colors.white,
        padding: 15,
        marginVertical: 8,
        borderRadius: 10,
        shadowColor: colors.surface,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginHorizontal: 15,
    },
    cardContent: {
        flex: 1,
        justifyContent: 'center',
    },
    retailerDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    retailerName: {
        ...typography.h6(colors),
        fontWeight: '700',
        marginBottom: 2,
    },
    retailerDetail: {
        ...typography.body1(colors),
        fontWeight: '400',
        marginVertical: 2,
    },
    chevronIcon: {
        marginLeft: 'auto',
    },
    listContainer: {
        paddingBottom: 10,
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        color: colors.textSecondary,
        fontSize: 16,
    },
});