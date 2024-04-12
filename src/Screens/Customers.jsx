import {
    FlatList,
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    TextInput,
    ActivityIndicator,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import CustomIcon from '../Components/CustomIcon';
import Colors from '../Config/Colors';
import Fonts from '../Config/Fonts';

const Customers = () => {
    const navigation = useNavigation();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        fetchCustomersData()
    }, [])

    const fetchCustomersData = async () => {
        try {
            const response = await fetch(
                "http://192.168.1.10:9001/api/masters/retailers?Company_Id=1"
                // `https://api.salesjump.in/api/MasterData/getRetailerDetails?senderID=shri`
            );
            const jsonData = await response.json();

            if (!response.ok) {
                throw new Error(`API request failed with status: ${response.status}`);
            }
            setData(jsonData.data);
            setFilteredData(jsonData.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
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
            <View style={styles.row}>
                <Text style={styles.cell}>{item.Retailer_Name}</Text>
                <Text style={styles.cell}>{item.Mobile_No}</Text>
                <CustomIcon name="arrow-right" size={25} color={Colors.black} />
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.pop()}>
                    <CustomIcon name="arrow-left" color={Colors.white} size={25} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Retailers Information</Text>
            </View>

            {loading && (
                <>
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                </>
            )}

            <View style={styles.inputEvent}>
                <TextInput
                    style={styles.inputSearch}
                    placeholder="Search by name or phone number"
                    onChangeText={handleSearch}
                    value={searchQuery}
                />
                <TouchableOpacity style={styles.addButton} onPressOut={() => navigation.push('AddCustomer')}>
                    <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
            </View>

            {filteredData.length > 0 ? (
                <FlatList
                    data={filteredData}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />

            ) : (
                <Text>No data found</Text>
            )}
        </View>
    )
}

export default Customers

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        color: Colors.black
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
        fontSize: 15,
        color: Colors.white,
        marginLeft: 10
    },
    inputEvent: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 10,

    },
    inputSearch: {
        fontFamily: Fonts.plusJakartaSansMedium,
        height: 40,
        color: Colors.black,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 15,
    },
    addButton: {
        backgroundColor: Colors.secondary,
        borderRadius: 5,
        height: 40,
        paddingHorizontal: 20,
        paddingVertical: 5,
    },
    addButtonText: {
        fontFamily: Fonts.plusJakartaSansMedium,
        color: Colors.white,
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 10,
        marginHorizontal: 20,
        color: Colors.black,
    },
    cell: {
        flex: 1,
        fontSize: 16,
        fontFamily: Fonts.plusJakartaSansRegular,
        paddingHorizontal: 5,
        color: Colors.black,
    },
    mapIcon: {
        width: 25,
        height: 25,
    }
});