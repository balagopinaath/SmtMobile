import { Button, Image, Linking, StyleSheet, Text, TouchableOpacity, Vibration, View, PermissionsAndroid, Alert, ToastAndroid } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Geolocation from '@react-native-community/geolocation'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import CustomIcon from '../Components/CustomIcon';
import Colors from '../Config/Colors';
import Fonts from '../Config/Fonts';

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
            const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
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
                    title: 'ERP App Location Permission',
                    message:
                        'ERP App needs access to your camera ' +
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

    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                handleUpdateLocation(latitude, longitude)
            },
            (error) => {
                console.error('Error getting location:', error);
                switch (error.code) {
                    case 1:
                        console.error('Location permission denied');
                        break;
                    case 2:
                        console.error('Position unavailable');
                        break;
                    case 3:
                        console.error('Request timeout');
                        break;
                    default:
                        console.error('An unknown error occurred');
                        break;
                }
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    const handleUpdateLocation = async (lat, long) => {
        fetch("http://192.168.1.10:9001/api/masters/retailers?Company_Id=1", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                EntryBy: userId,
                Latitude: lat.toString(),
                Longitude: long.toString(),
                retailer_code: item.retailer_code
            })
        }).then(res => res.json())
            .then(data => {
                setRefresh(!refresh);
                if (data.status === 'Success') {
                    Alert.alert(data.message);
                    console.log('successfully')
                } else {
                    Alert.alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error in fetching data:', error);
            });
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.pop()}>
                    <CustomIcon name="arrow-left" color={Colors.white} size={25} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Details</Text>
            </View>

            <View style={styles.detailsContainer}>
                <View style={styles.tableRow}>
                    <Text style={styles.label}>Name:</Text>
                    <Text style={styles.value}>{item.Retailer_Name}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.label}>Address:</Text>
                    <Text style={styles.value}>{`${item.Reatailer_Address}, ${item.Reatailer_City}, ${item.StateGet} - ${item.PinCode}`}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.label}>Contact Person:</Text>
                    <Text style={styles.value}>{item.Contact_Person}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.label}>Channel:</Text>
                    <Text style={styles.value}>{item.Retailer_Channel_Id}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.label}>Distributor:</Text>
                    <Text style={styles.value}>{item.Distributor_Id}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.label}>Contact:</Text>
                    <TouchableOpacity onPress={handleCall}>
                        <Text style={[styles.value, styles.link]}>{item.Mobile_No}</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.messageButton}
                    onPress={() => {
                        Linking.openURL(`https://wa.me/+91${item.Mobile_No}/?text=Hi`)
                    }}>
                    <Text style={styles.messageButtonText}>WhatsApp</Text>
                </TouchableOpacity>
                {latitude !== null && longitude !== null && (
                    <>
                        <TouchableOpacity onPress={handleLocation} style={styles.directionButton}>
                            <Text style={styles.directionButtonText}>Direction</Text>
                        </TouchableOpacity>
                    </>
                )}

                <TouchableOpacity onPress={() => navigation.push('EditCustomer', { item })} style={styles.editButton}>
                    <Text style={styles.directionButtonText}>Edit Retailers</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={requestLocationPermission} style={styles.directionButton}>
                    <Text style={styles.directionButtonText}>Update Location</Text>
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
        backgroundColor: Colors.background,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: Colors.primary,
    },
    headerText: {
        fontFamily: Fonts.plusJakartaSansMedium,
        fontSize: 15,
        color: Colors.white,
        marginLeft: 10
    },
    detailsContainer: {
        padding: 20,
        marginVertical: 15,
        marginHorizontal: 15
    },
    tableRow: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    label: {
        flex: 1,
        fontFamily: Fonts.plusJakartaSansMedium,
        fontWeight: '700',
        color: Colors.black
    },
    value: {
        flex: 2,
        fontFamily: Fonts.plusJakartaSansRegular,
        fontWeight: '600',
        color: Colors.black
    },
    link: {
        color: 'blue',
        textDecorationLine: 'underline',
        fontFamily: Fonts.plusJakartaSansBold,
    },
    messageButton: {
        backgroundColor: '#25D366',
        padding: 10,
        borderRadius: 5,
        marginTop: 25,
    },
    messageButtonText: {
        fontFamily: Fonts.plusJakartaSansMedium,
        fontWeight: '700',
        color: Colors.white,
        textAlign: 'center',
    },
    directionButton: {
        marginTop: 15,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        backgroundColor: '#3498db',
    },
    directionButtonText: {
        fontFamily: Fonts.plusJakartaSansMedium,
        color: Colors.white,
        fontWeight: '700'
    },

    editButton: {
        marginTop: 15,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        backgroundColor: Colors.secondary,
    },
});