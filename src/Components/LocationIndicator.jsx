import { PermissionsAndroid, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { customColors, customFonts } from '../Config/helper';

const LocationIndicator = () => {
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
                },
                (error) => {
                    setLocationEnabled(false);
                }
            );
        };

        const startWatchingPosition = () => {
            const watchId = Geolocation.watchPosition(
                newPosition => {
                    const { latitude, longitude } = newPosition.coords;
                    setCurrentLocation({ latitude, longitude });
                },
                error => {
                    console.error('Error getting location:', error);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 } // Update interval in meters
            );
            return watchId;
        };

        const intervalId = setInterval(() => {
            checkLocationStatus();
        }, 5000); // Check location status every 5 seconds

        const initializeLocation = async () => {
            const granted = await checkPermission();
            if (granted) {
                checkLocationStatus();
                startWatchingPosition();
            } else {
                Alert.alert('Location Permission', 'Location permission denied. App cannot function properly without it.');
            }
        };

        initializeLocation()

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
                    console.log('Location permission granted');
                    setLocationPermissionGranted(true);
                    startWatchingPosition()
                } else {
                    console.log('Location permission denied');
                    Alert.alert('Location Permission', 'Location permission denied. App cannot function properly without it.');
                }
            } catch (err) {
                console.warn(err);
            }
        };



        return () => {
            clearInterval(intervalId);
        };



    }, [locationPermissionGranted, refresh])

    const fetchEvent = () => {
        setFetchButton(!fetchButton);
        setRefresh(!refresh)
    };

    const refreshLocation = () => {
        setCurrentLocation({ latitude: '', longitude: '' });
    };

    return (
        <View style={styles.card}>
            <View style={styles.cardRow}>
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
            <TouchableOpacity onPress={refreshLocation} style={styles.refreshButton}>
                {/* <Icon name="refresh" color={customColors.black} size={25} /> */}
                <Text style={styles.refreshButtonText}>Refresh Status</Text>
            </TouchableOpacity>
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
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    refreshButton: {
        flexDirection: 'row',
        borderWidth: 0.5,
        padding: 5,
        borderColor: customColors.accent,
        borderRadius: 5,
        marginLeft: 'auto',
        marginHorizontal: 15,
        marginTop: 15
    },
    refreshButtonText: {
        fontFamily: customFonts.plusJakartaSansRegular,
        fontSize: 14,
        fontWeight: '500',
        color: customColors.text,
    }
})