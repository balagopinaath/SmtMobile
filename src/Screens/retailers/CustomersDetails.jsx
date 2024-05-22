import { Linking, StyleSheet, Text, TouchableOpacity, View, PermissionsAndroid, Alert, ToastAndroid, ScrollView, Image, useColorScheme } from 'react-native';
import React, { useEffect, useState } from 'react';
import Geolocation from '@react-native-community/geolocation'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { API } from '../../Config/Endpoint';
import { customFonts, customColors, typography } from '../../Config/helper';

const CustomersDetails = ({ route }) => {
    const navigation = useNavigation();
    const { item } = route.params;
    const scheme = useColorScheme();
    const colors = customColors[scheme === 'dark' ? 'dark' : 'light'];
    const latitude = item.Latitude;
    const longitude = item.Longitude;
    const phoneNumber = item.Mobile_No;
    const [userId, setUserId] = useState('');
    const [refresh, setRefresh] = useState(false)

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

    const getCurrentLocation = (successCallback) => {
        Geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                successCallback(latitude, longitude);
            },
            error => {
                console.error('Error getting location:', error);
                switch (error.code) {
                    case 1: console.error('Location permission denied'); break;
                    case 2: console.error('Position unavailable'); break;
                    case 3: console.error('Request timeout'); break;
                    default: console.error('An unknown error occurred'); break;
                }
            },
            { enableHighAccuracy: true, timeout: 30000, maximumAge: 10000 }
        );
    };

    const handleUpdateLocation = () => {
        getCurrentLocation(async (lat, long) => {
            fetch(API.retailerLocation, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    EntryBy: userId,
                    Latitude: lat.toString(),
                    Longitude: long.toString(),
                    Retailer_Id: item.Retailer_Id
                })
            }).then(res => res.json())
                .then(data => {
                    setRefresh(!refresh);
                    if (data.status === 'Success') {
                        Alert.alert(data.message);
                        ToastAndroid.show('Geolocation Data is Updated', ToastAndroid.LONG);
                        console.log('Successfully updated location');
                    } else {
                        Alert.alert(data.message);
                    }
                })
                .catch(error => {
                    console.error('Error in fetching data:', error);
                });
        });
    };

    return (
        <ScrollView style={styles(colors).container}>

            <View style={styles(colors).retailersContainer}>
                <View style={styles(colors).retailersInner}>
                    <Text style={styles(colors).labelText}>Name:</Text>
                    <Text style={styles(colors).infoText}>{item.Retailer_Name}</Text>
                </View>

                <View style={styles(colors).retailersInner}>
                    <Text style={styles(colors).labelText}>Address:</Text>
                    <Text style={styles(colors).infoText}>{`${item.Reatailer_Address}, ${item.Reatailer_City}, ${item.StateGet} - ${item.PinCode}`}</Text>
                </View>

                <View style={styles(colors).retailersInner}>
                    <Text style={styles(colors).labelText}>Contact Person:</Text>
                    <Text style={styles(colors).infoText}>{item.Contact_Person}</Text>
                </View>

                <View style={styles(colors).retailersInner}>
                    <Text style={styles(colors).labelText}>Channel:</Text>
                    <Text style={styles(colors).infoText}>{item.Retailer_Channel_Id}</Text>
                </View>

                <View style={styles(colors).retailersInner}>
                    <Text style={styles(colors).labelText}>GST:</Text>
                    <Text style={styles(colors).infoText}>{item.Gstno}</Text>
                </View>

                <View style={styles(colors).retailersInner}>
                    <Text style={styles(colors).labelText}>Distributor:</Text>
                    <Text style={styles(colors).infoText}>{item.Distributor_Id}</Text>
                </View>

                <View style={styles(colors).retailersInner}>
                    <Text style={styles(colors).labelText}>Contact:</Text>
                    <TouchableOpacity onPress={handleCall}>
                        <Text style={[styles(colors).infoText, styles(colors).link]}>{item.Mobile_No}</Text>
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
                    <Text style={styles(colors).buttonText}>WhatsApp</Text>
                </TouchableOpacity>

                {latitude !== null && longitude !== null && (
                    <TouchableOpacity style={styles(colors).button} onPress={handleLocation}>
                        <Image
                            style={styles(colors).tinyLogo}
                            source={require('../../../assets/images/map.png')}
                        />
                        <Text style={styles(colors).buttonText}>Maps</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity style={styles(colors).button} onPress={() => handleUpdateLocation()}>
                    <Image
                        style={styles(colors).tinyLogo}
                        source={require('../../../assets/images/pin.png')}
                    />
                    <Text style={styles(colors).buttonText}>Update Location</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles(colors).button} onPress={() => { navigation.navigate('StockClosing', { item }) }} >
                    <Image
                        style={styles(colors).tinyLogo}
                        source={require('../../../assets/images/packages.png')}
                    />
                    <Text style={styles(colors).buttonText}>Closing Stock</Text>
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
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: colors.primary,
    },
    headerText: {
        ...typography.h6,
        // color: customColors.white,
        marginLeft: 15
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
        ...typography.h6,
        fontWeight: 'bold',
        marginRight: 10,
    },
    infoText: {
        flex: 1,
        ...typography.h6,
    },
    link: {
        ...typography.h4,
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