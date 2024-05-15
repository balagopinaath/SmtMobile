import { PermissionsAndroid, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { customColors, customFonts } from '../Config/helper';

const LocationIndicator = ({ onLocationUpdate }) => {
    const [currentLocation, setCurrentLocation] = useState(
        {
            'latitude': '',
            'longitude': ''
        }
    )
    const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
    const [locationEnabled, setLocationEnabled] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [fetchButton, setFetchButton] = useState(true);

    useEffect(() => {
        const checkPermission = async () => {
            const granted = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );
            setLocationPermissionGranted(granted);
            return granted;
        };

        const checkLocationStatus = () => {
            Geolocation.getCurrentPosition(
                (position) => {
                    setLocationEnabled(true);
                    const { latitude, longitude } = position.coords;
                    setCurrentLocation({ latitude, longitude });
                    if (onLocationUpdate) {
                        onLocationUpdate({ latitude, longitude });
                    }
                },
                (error) => {
                    setLocationEnabled(false);
                    console.error('Error getting location:', error);
                }
            );
        };

        const initializeLocation = async () => {
            const granted = await checkPermission();
            if (granted) {
                checkLocationStatus();
            } else {
                Alert.alert('Location Permission', 'Location permission denied. App cannot function properly without it.');
            }
        };

        const getLocationPermission = async () => {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Sales App Location Permission',
                        message: 'Sales App needs access to your location',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    // console.log('Location permission granted');
                    setLocationPermissionGranted(true);
                    checkLocationStatus(); // Call checkLocationStatus after permission is granted
                } else {
                    console.log('Location permission denied');
                    setLocationEnabled(false); // Update locationEnabled state if permission is denied
                    Alert.alert('Location Permission', 'Location permission denied. App cannot function properly without it.');
                }
            } catch (err) {
                console.warn(err);
            }
        };

        // Call getLocationPermission when locationPermissionGranted changes or refresh is triggered
        if (!locationPermissionGranted || refresh) {
            getLocationPermission();
        }

    }, [locationPermissionGranted, refresh, onLocationUpdate]);

    const fetchEvent = () => {
        setFetchButton(!fetchButton);
        setRefresh(!refresh)
    };

    const refreshLocation = () => {
        setCurrentLocation({ latitude: '', longitude: '' });
        setLocationEnabled(false); // Reset locationEnabled when location is refreshed
    };

    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Location Status</Text>
            <View style={styles.cardContent}>
                <View style={styles.row}>
                    <View style={locationPermissionGranted ? styles.active : styles.inActive}>
                        <Text style={styles.text}>Permission</Text>
                    </View>
                    <View style={locationEnabled ? styles.active : styles.inActive}>
                        <Text style={styles.text}>Location</Text>
                    </View>
                    <View style={(currentLocation.latitude && currentLocation.longitude) ? styles.active : styles.inActive}>
                        <Text style={styles.text}>Position</Text>
                    </View>
                </View>
                <View style={styles.buttonGroup}>
                    <TouchableOpacity onPress={refreshLocation} style={styles.refreshButton}>
                        <Text style={styles.refreshButtonText}>Refresh Status</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={fetchEvent} style={styles.refreshButton}>
                        <Text style={styles.refreshButtonText}>Fetch Location</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default LocationIndicator

const styles = StyleSheet.create({
    card: {
        backgroundColor: customColors.white,
        borderRadius: 10,
        padding: 15,
        elevation: 3,
        marginVertical: 10,
        marginHorizontal: 20,
    },
    cardTitle: {
        fontSize: 13,
        fontFamily: customFonts.plusJakartaSansRegular,
        fontWeight: 'bold',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        borderStyle: 'dashed',
        paddingBottom: 5,
    },
    cardContent: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'stretch',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    active: {
        padding: 5,
        paddingHorizontal: 10,
        backgroundColor: '#DAF7A6',
        borderRadius: 50,
    },
    inActive: {
        padding: 5,
        paddingHorizontal: 10,
        backgroundColor: '#FF5733',
        borderRadius: 50,
    },
    text: {
        fontFamily: customFonts.plusJakartaSansRegular,
        fontSize: 14,
        fontWeight: '500',
        color: customColors.text,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    refreshButton: {
        borderWidth: 0.5,
        padding: 5,
        borderColor: customColors.accent,
        borderRadius: 5,
        marginHorizontal: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    refreshButtonText: {
        fontFamily: customFonts.plusJakartaSansRegular,
        fontSize: 14,
        fontWeight: '500',
        color: customColors.text,
    },
})