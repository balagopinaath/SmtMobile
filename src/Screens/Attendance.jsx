import { StyleSheet, Text, ScrollView, View, TouchableOpacity, TextInput, Alert, Image, PermissionsAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import CameraComponent from '../Components/CameraComponent';
import Geolocation from '@react-native-community/geolocation'
import { API } from '../Config/Endpoint';
import { customColors, customFonts } from '../Config/helper';

const Attendance = () => {
    const navigation = useNavigation();
    const [activeStatus, setActiveStatus] = useState(0)
    const [locationEnabled, setLocationEnabled] = useState(false);
    const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
    const [watchId, setWatchId] = useState(false);
    const [capturedPhotoPath, setCapturedPhotoPath] = useState(null);
    const [formValues, setFormValues] = useState({
        UserId: '',
        Start_KM: '',
        Latitude: '',
        Longitude: '',
        Start_KM_Pic: ''
    })

    useEffect(() => {
        (async () => {
            try {
                const userId = await AsyncStorage.getItem('UserId');
                setFormValues({ ...formValues, UserId: userId });
            } catch (err) {
                console.log(err);
            }
        })();
    }, [])

    useEffect(() => {
        const checkPermission = async () => {
            const granted = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            )
            setLocationPermissionGranted(granted)
            return granted
        }

        const checkLocationStatus = () => {
            Geolocation.getCurrentPosition(
                (position) => {
                    setLocationEnabled(true);
                },
                (error) => {
                    setLocationEnabled(false);
                }
            );
        };

        const requestLocationPermission = async () => {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'The Sales App needs your location permission',
                        message: 'Sales app needs access to your location ',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    setLocationPermissionGranted(true);
                    startWatchingPosition();
                } else {
                    console.log('Location permission denied');
                }
            } catch (err) {
                console.warn('Error requesting location permission:', err);
            }
        };

        const startWatchingPosition = () => {
            const id = Geolocation.watchPosition(
                newPosition => {
                    const { latitude, longitude } = newPosition.coords;
                    setFormValues(prevState => ({
                        ...prevState,
                        Latitude: latitude.toString(),
                        Longitude: longitude.toString(),
                    }));
                },
                error => {
                    console.error('Error getting location:', error);
                },
                { enableHighAccuracy: true, distanceFilter: 2 } // Update interval in meters
            );
            setWatchId(id);
        };

        const stopWatchingPosition = () => {
            if (watchId) {
                Geolocation.clearWatch(watchId);
            }
        };

        checkPermission().then(granted => {
            if (granted) {
                checkLocationStatus()
                requestLocationPermission()
            } else {
                requestLocationPermission();
            }
        }).catch(err => {
            console.log(err)
        })

        return () => {
            stopWatchingPosition(); // Make sure to stop watching when the component unmounts
        };

    }, [watchId])

    const handleInputChange = value => {
        setFormValues({ ...formValues, Start_KM: value });
    };

    const handlePhotoCapture = async (photoPath) => {
        setCapturedPhotoPath(photoPath);
        setFormValues({ ...formValues, Start_KM_Pic: photoPath });
    };

    const handleSubmit = async () => {
        try {
            if (!formValues.Latitude || !formValues.Longitude) {
                Alert.alert('Location Permission', 'Please enable location services.');
                return;
            }

            const formData = new FormData();
            formData.append('UserId', formValues.UserId);
            formData.append('Start_KM', formValues.Start_KM);
            formData.append('Latitude', formValues.Latitude);
            formData.append('Longitude', formValues.Longitude);
            formData.append("Start_KM_Pic", {
                uri: `file://${formValues.Start_KM_Pic}`,
                name: 'photo.jpg',
                type: 'image/jpeg'
            });

            const response = await fetch(API.attendance, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to post data to server');
            }

            const responseData = await response.json();
            navigation.replace('HomeScreen');
            console.log('Response from server:', responseData);
        } catch (error) {
            console.error('Error posting data:', error);
            Alert.alert('Error', 'Failed to submit data. Please try again later.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Attendance</Text>
            </View>

            <View>
                <TextInput
                    style={styles.input}
                    value={formValues.Start_KM}
                    keyboardType='decimal-pad'
                    placeholder='Starting Kilometers'
                    autoCapitalize='characters'
                    onChangeText={handleInputChange}
                />
            </View>

            {!capturedPhotoPath ? (
                <CameraComponent onPhotoCapture={handlePhotoCapture} />
            ) : (
                <>
                    {capturedPhotoPath && typeof capturedPhotoPath === 'string' ? (
                        <View style={styles.previewImageContainer}>
                            <Image
                                source={`file://${capturedPhotoPath}` ? { uri: 'file://' + capturedPhotoPath } : null}
                                style={styles.previewImage}
                            />
                        </View>
                    ) : null}
                </>
            )}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>

        </ScrollView>
    )
}

export default Attendance

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: customColors.background,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: customColors.primary,
        marginBottom: 20
    },
    headerText: {
        fontFamily: customFonts.plusJakartaSansMedium,
        color: customColors.white,
        fontSize: 15,
        marginLeft: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginTop: 10,
        marginBottom: 20,
        marginHorizontal: 15
    },
    previewImageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    previewImage: {
        width: 350,
        height: 350,
        resizeMode: 'cover',
        borderRadius: 10,
    },
    button: {
        flex: 1,
        backgroundColor: customColors.accent,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        marginBottom: 25,
        marginHorizontal: 15
    },
    buttonText: {
        color: customColors.white,
        fontSize: 16,
    },
})