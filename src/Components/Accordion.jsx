import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'

const Accordion = ({ data }) => {
    const navigation = useNavigation();
    const [expanded, setExpanded] = useState(false);

    const toggleAccordion = (index) => {
        if (expanded === index) {
            setExpanded(null);
        } else {
            setExpanded(index);
        }
    };

    const navigateToRetailerInfo = (retailer) => {
        navigation.navigate('CustomersDetails', { retailer });
    };

    return (
        <ScrollView style={styles.container}>
            {data.map((area, index) => (
                <View key={index} style={styles.areaContainer}>
                    <TouchableOpacity onPress={() => toggleAccordion(index)}>
                        <Text style={styles.areaName}>{area.Area_Name}</Text>
                    </TouchableOpacity>
                    {expanded === index && (
                        <View style={styles.retailersContainer}>
                            {area.Area_Retailers.map((retailer, retailerIndex) => (
                                <TouchableOpacity key={retailerIndex} onPress={() => navigateToRetailerInfo(retailer)}>
                                    <Text style={styles.retailerName}>{retailer.Retailer_Name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
            ))}
        </ScrollView>
    )
}

export default Accordion

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    areaContainer: {
        marginBottom: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
    },
    areaName: {
        padding: 10,
        fontWeight: 'bold',
    },
    retailersContainer: {
        padding: 10,
    },
    retailerName: {
        marginLeft: 10,
    },
})