import { Linking, StyleSheet, Text, TouchableOpacity, View, PermissionsAndroid, Alert, ToastAndroid, ScrollView, Image, useColorScheme, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import Geolocation from '@react-native-community/geolocation'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { API } from '../../Config/Endpoint';
import { customColors, typography } from '../../Config/helper';

const CustomersDetails = ({ route }) => {
    const navigation = useNavigation();
    const { item } = route.params;
    const scheme = useColorScheme();
    const colors = customColors[scheme === 'dark' ? 'dark' : 'light'];
    const latitude = item.Latitude;
    const longitude = item.Longitude;
    const phoneNumber = item.Mobile_No;
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const id = await AsyncStorage.getItem('UserId');
                setUserId(id);
            } catch (e) {
                console.log(e)
            }
        };

        fetchUserId();
    }, [])

    const handleCall = () => {
        if (phoneNumber) {
            Linking.openURL(`tel:${phoneNumber}`);
        } else {
            console.log('Phone number not available');
        }
    };

    const handleLocation = () => {
        if (latitude !== null && longitude !== null) {
            const url = `${API.google_map}${latitude},${longitude}`
            Linking.openURL(url);
        } else {
            console.log('Location not available');
        }
    };

    const handleUpdateLocation = () => {
        Alert.alert(
            'Update Location',
            'Are you sure you want to update the location?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: async () => {
                        try {
                            Geolocation.getCurrentPosition(
                                async (position) => {
                                    const { latitude, longitude } = position.coords;

                                    const response = await fetch(API.retailerLocation, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            EntryBy: userId,
                                            Latitude: latitude.toString(),
                                            Longitude: longitude.toString(),
                                            Retailer_Id: item.Retailer_Id
                                        })
                                    });

                                    if (!response.ok) {
                                        throw new Error('Failed to update location');
                                    }

                                    const data = await response.json();
                                    if (data.status === 'Success') {
                                        Alert.alert(data.message);
                                        ToastAndroid.show('Geolocation Data is Updated', ToastAndroid.LONG);
                                        console.log('Successfully updated location');
                                    } else {
                                        Alert.alert(data.message);
                                    }
                                },
                                error => {
                                    console.error('Error getting location:', error);
                                    Alert.alert('Error', 'Failed to get current location. Please try again later.');
                                },
                                { enableHighAccuracy: true, timeout: 30000, maximumAge: 10000 }
                            );
                        } catch (error) {
                            console.error('Error updating location:', error);
                            Alert.alert('Error', 'Failed to update location. Please try again later.');
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    };

    return (
        <ScrollView style={styles(colors).container}>

            <View style={styles(colors).retailersContainer}>
                <View style={styles(colors).retailersInner}>
                    <Text maxFontSizeMultiplier={1.2} style={styles(colors).labelText}>Name:</Text>
                    <Text maxFontSizeMultiplier={1.2} style={styles(colors).infoText}>{item.Retailer_Name}</Text>
                </View>

                <View style={styles(colors).retailersInner}>
                    <Text maxFontSizeMultiplier={1.2} style={styles(colors).labelText}>Address:</Text>
                    <Text maxFontSizeMultiplier={1.2} style={styles(colors).infoText}>{`${item.Reatailer_Address}, ${item.Reatailer_City}, ${item.StateGet} - ${item.PinCode}`}</Text>
                </View>

                <View style={styles(colors).retailersInner}>
                    <Text maxFontSizeMultiplier={1.2} style={styles(colors).labelText}>Contact Person:</Text>
                    <Text maxFontSizeMultiplier={1.2} style={styles(colors).infoText}>{item.Contact_Person}</Text>
                </View>

                <View style={styles(colors).retailersInner}>
                    <Text maxFontSizeMultiplier={1.2} style={styles(colors).labelText}>Channel:</Text>
                    <Text maxFontSizeMultiplier={1.2} style={styles(colors).infoText}>{item.Retailer_Channel_Id}</Text>
                </View>

                <View style={styles(colors).retailersInner}>
                    <Text maxFontSizeMultiplier={1.2} style={styles(colors).labelText}>GST:</Text>
                    <Text maxFontSizeMultiplier={1.2} style={styles(colors).infoText}>{item.Gstno}</Text>
                </View>

                <View style={styles(colors).retailersInner}>
                    <Text maxFontSizeMultiplier={1.2} style={styles(colors).labelText}>Distributor:</Text>
                    <Text maxFontSizeMultiplier={1.2} style={styles(colors).infoText}>{item.Distributor_Id}</Text>
                </View>

                <View style={styles(colors).retailersInner}>
                    <Text maxFontSizeMultiplier={1.2} style={styles(colors).labelText}>Contact:</Text>
                    <TouchableOpacity onPress={handleCall}>
                        <Text maxFontSizeMultiplier={1.2} style={[styles(colors).infoText, styles(colors).link]}>{item.Mobile_No}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles(colors).buttonContainer}>
                {/* <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EditCustomer', { item })}>
                    <CustomAntIcon name="edit" size={20} color="blue" />
                    <Text style={styles.buttonText}>Edit Retailers</Text>
                </TouchableOpacity> */}

                <TouchableOpacity style={styles(colors).button} onPress={() => {
                    Linking.openURL(`${API.whatsApp}${item.Mobile_No}/?text=Hi`)
                }} >
                    <Image
                        style={styles(colors).tinyLogo}
                        source={require('../../../assets/images/whatsapp.png')}
                    />
                    <Text maxFontSizeMultiplier={1.2} style={styles(colors).buttonText}>WhatsApp</Text>
                </TouchableOpacity>

                {latitude !== null && longitude !== null && (
                    <TouchableOpacity style={styles(colors).button} onPress={handleLocation}>
                        <Image
                            style={styles(colors).tinyLogo}
                            source={require('../../../assets/images/map.png')}
                        />
                        <Text maxFontSizeMultiplier={1.2} style={styles(colors).buttonText}>Maps</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity style={styles(colors).button} onPress={() => handleUpdateLocation()}>
                    <Image
                        style={styles(colors).tinyLogo}
                        source={require('../../../assets/images/pin.png')}
                    />
                    <Text maxFontSizeMultiplier={1.2} style={styles(colors).buttonText}>Update Location</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles(colors).button} onPress={() => { navigation.navigate('StockClosing', { item }) }} >
                    <Image
                        style={styles(colors).tinyLogo}
                        source={require('../../../assets/images/packages.png')}
                    />
                    <Text maxFontSizeMultiplier={1.2} style={styles(colors).buttonText}>Closing Stock</Text>
                </TouchableOpacity>
            </View>

        </ScrollView>
    )
}

export default CustomersDetails

const styles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.background,
    },
    retailersContainer: {
        width: '90%',
        alignSelf: 'center',
        backgroundColor: colors.background === "#000000" ? colors.black : colors.white,
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginVertical: 25,
        elevation: 3,
    },
    retailersInner: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    labelText: {
        width: 100,
        ...typography.body1(colors),
        fontWeight: 'bold',
        marginRight: 10,
    },
    infoText: {
        flex: 1,
        ...typography.body1(colors),
    },
    link: {
        ...typography.h6(colors),
        color: 'blue',
        textDecorationLine: 'underline',
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 20,
        marginHorizontal: 15,
    },
    button: {
        width: '30%',
        alignItems: 'center',
        paddingVertical: 15,
        marginBottom: 20,
    },
    buttonText: {
        ...typography.body1(colors),
        textAlign: 'center',
        fontWeight: '700',
        marginTop: 10,
    },
    tinyLogo: {
        width: 50,
        height: 50,
    }
});