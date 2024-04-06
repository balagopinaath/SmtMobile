import {
    FlatList,
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    TextInput,
    Image,
    ActivityIndicator,
} from 'react-native'
import React, { memo, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import CustomIcon from '../Components/CustomIcon';
import Colors from '../Config/Colors';


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
                "http://192.168.1.10:5000/api/saniForce/retailers"
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
                return item.retailer_Name.toLowerCase().includes(query.toLowerCase()) ||
                    item.mobile_No.includes(query);
            });
            setFilteredData(filtered);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.push('CustomersDetails', { item })}>
            <View style={styles.row}>
                <Text style={styles.cell}>{item.retailer_Name}</Text>
                <Text style={styles.cell}>{item.mobile_No}</Text>
                <CustomIcon name="arrow-right" size={25} color={Colors.black} />
                {/* Add more Text components for other fields */}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Customers</Text>
            <TextInput
                style={styles.input}
                placeholder="Search by name or phone number"
                onChangeText={handleSearch}
                value={searchQuery}
            />

            {filteredData.length > 0 ? (
                <FlatList style={{ color: '#000' }}
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
        padding: 16,
        paddingTop: 30,
        backgroundColor: '#fff',
        color: '#000'
    },
    input: {
        height: 40,
        color: '#000',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#000',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 10,
        color: '#000',
    },
    cell: {
        flex: 1,
        fontSize: 16,
        paddingHorizontal: 5,
        color: '#000',
    },
    mapIcon: {
        width: 25,
        height: 25,
    }
});