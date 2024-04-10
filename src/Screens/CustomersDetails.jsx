import { Button, Image, Linking, StyleSheet, Text, TouchableOpacity, Vibration, View, PermissionsAndroid, Alert, ToastAndroid } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Geolocation from '@react-native-community/geolocation'
import AsyncStorage from '@react-native-async-storage/async-storage'

const CustomersDetails = ({ route }) => {
    const { item } = route.params;

    const latitude = item.latitude;
    const longitude = item.longitude;
    const phoneNumber = item.mobile_No;
    const [userId, setUserId] = useState('');
    const [location, setLocation] = useState(false);
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const id = await AsyncStorage.getItem('UserId');
                setUserId(id);
                // console.log('userId', id)
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

        fetch("http://192.168.1.10:5000/api/saniForce/retailers", {
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
            <View style={styles.detailsContainer}>
                <Text style={styles.tableHeader}>Constomer Details</Text>
                <View style={styles.tableRow}>
                    <Text style={styles.label}>Name:</Text>
                    <Text style={styles.value}>{item.retailer_Name}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.label}>Address:</Text>
                    <Text style={styles.value}>{`${item.address}, ${item.city}, ${item.stateName} - ${item.pinCode}`}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.label}>Designation:</Text>
                    <Text style={styles.value}>{item.designation}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.label}>Channel:</Text>
                    <Text style={styles.value}>{item.retailer_Channel}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.label}>Distributor:</Text>
                    <Text style={styles.value}>{item.distributorName}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.label}>Contact:</Text>
                    <TouchableOpacity onPress={handleCall}>
                        <Text style={[styles.value, styles.link]}>{item.mobile_No}</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.messageButton}
                    onPress={() => {
                        Linking.openURL(`https://wa.me/+91${item.mobile_No}/?text=Hi`)
                    }}>
                    <Text style={styles.messageButtonText}>WhatsApp</Text>
                </TouchableOpacity>
                {latitude !== null && longitude !== null && (
                    <Button
                        title="Location"
                        type="solid"
                        onPress={handleLocation}
                        buttonStyle={styles.locationButton}
                    />
                )}
                <Button
                    title="Update Location"
                    type="solid"
                    onPress={() => requestLocationPermission()}
                    buttonStyle={styles.updateLocation}
                />
            </View>
        </View>
    )
}

export default CustomersDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 10,
        marginVertical: 15,
        marginHorizontal: 15
    },
    detailsContainer: {
        flex: 1,
    },
    tableHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 10,
        color: '#000'
    },
    tableRow: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    label: {
        flex: 1,
        fontWeight: 'bold',
        color: '#000'
    },
    value: {
        flex: 2,
        color: '#000'
    },
    link: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
    messageButton: {
        backgroundColor: '#25D366',
        padding: 10,
        borderRadius: 5,
        marginTop: 25,
        marginBottom: 25
    },
    messageButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
    locationButton: {
        marginTop: 10,
        backgroundColor: '#3498db',
    },
    updateLocation: {
        marginTop: 10,
        backgroundColor: '#25D366',
    },
});