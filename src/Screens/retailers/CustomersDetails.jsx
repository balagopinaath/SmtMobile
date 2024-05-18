import { Linking, StyleSheet, Text, TouchableOpacity, Dimensions, View, PermissionsAndroid, Alert, ToastAndroid, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import Geolocation from '@react-native-community/geolocation'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import CustomIcon from 'react-native-vector-icons/FontAwesome';
import CustomAntIcon from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/FontAwesome'
import { API } from '../../Config/Endpoint';
import { customFonts, customColors } from '../../Config/helper';

const { width } = Dimensions.get('window');

const CustomersDetails = ({ route }) => {
    const navigation = useNavigation();
    const { item } = route.params;
    const latitude = item.Latitude;
    const longitude = item.Longitude;
    const phoneNumber = item.Mobile_No;
    const [userId, setUserId] = useState('');
    const [location, setLocation] = useState(false);
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

    const requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'The Sales App needs your location permission',
                    message:
                        'Sales app needs access to your location ' +
                        'so you can register your attendance.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can use the Location');
                getCurrentLocation();
            } else {
                console.log('Location permission denied');
            }
        } catch (err) {
            console.warn(err);
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
        <View style={styles.container}>

            <View style={styles.retailersContainer}>
                <View style={styles.retailersInner}>
                    <Text style={styles.labelText}>Name:</Text>
                    <Text style={styles.infoText}>{item.Retailer_Name}</Text>
                </View>

                <View style={styles.retailersInner}>
                    <Text style={styles.labelText}>Address:</Text>
                    <Text style={styles.infoText}>{`${item.Reatailer_Address}, ${item.Reatailer_City}, ${item.StateGet} - ${item.PinCode}`}</Text>
                </View>

                <View style={styles.retailersInner}>
                    <Text style={styles.labelText}>Contact Person:</Text>
                    <Text style={styles.infoText}>{item.Contact_Person}</Text>
                </View>

                <View style={styles.retailersInner}>
                    <Text style={styles.labelText}>Channel:</Text>
                    <Text style={styles.infoText}>{item.Retailer_Channel_Id}</Text>
                </View>

                <View style={styles.retailersInner}>
                    <Text style={styles.labelText}>GST:</Text>
                    <Text style={styles.infoText}>{item.Gstno}</Text>
                </View>

                <View style={styles.retailersInner}>
                    <Text style={styles.labelText}>Distributor:</Text>
                    <Text style={styles.infoText}>{item.Distributor_Id}</Text>
                </View>

                <View style={styles.retailersInner}>
                    <Text style={styles.labelText}>Contact:</Text>
                    <TouchableOpacity onPress={handleCall}>
                        <Text style={[styles.infoText, styles.link]}>{item.Mobile_No}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => {
                    Linking.openURL(`${API.whatsApp}${item.Mobile_No}/?text=Hi`)
                }}>
                    <Icon name="whatsapp" size={25} color="green" />
                    <Text style={styles.buttonText}>WhatsApp</Text>
                </TouchableOpacity>

                {latitude !== null && longitude !== null && (
                    <TouchableOpacity style={styles.button} onPress={handleLocation}>
                        <Icon name="map-o" size={20} color="red" />
                        <Text style={styles.buttonText}>Maps Direction</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EditCustomer', { item })}>
                    <CustomAntIcon name="edit" size={20} color="blue" />
                    <Text style={styles.buttonText}>Edit Retailers</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleUpdateLocation}>
                    <Icon name="map-marker" size={20} color="red" />
                    <Text style={styles.buttonText}>Update Location</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('StockClosing', { item }) }}>
                    <Icon name="bar-chart-o" size={20} color="blue" />
                    <Text style={styles.buttonText}>Closing Stock</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

export default CustomersDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: customColors.background,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: customColors.primary,
    },
    headerText: {
        fontFamily: customFonts.plusJakartaSansMedium,
        fontSize: 15,
        color: customColors.white,
        marginLeft: 15
    },
    retailersContainer: {
        width: '90%',
        alignSelf: 'center',
        backgroundColor: customColors.white,
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
        fontWeight: 'bold',
        marginRight: 10,
        width: 100,
    },
    infoText: {
        flex: 1,
        color: 'black',
    },
    link: {
        fontFamily: customFonts.plusJakartaSansBold,
        color: 'blue',
        textDecorationLine: 'underline',
    },
    buttonContainer: {
        marginTop: 5,
    },
    button: {
        width: width * 0.5,
        height: 55,
        flexDirection: 'row',
        alignSelf: 'center',
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 5,
        marginVertical: 5,
    },
    buttonText: {
        fontFamily: customFonts.plusJakartaSansBold,
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold',
        // color: '#333',
        color: customColors.accent
    },
});