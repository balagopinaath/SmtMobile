import { StyleSheet, Text, ScrollView, View, TouchableOpacity, TextInput, Alert, Image, PermissionsAndroid, ToastAndroid, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import CameraComponent from '../Components/CameraComponent';
import Geolocation from '@react-native-community/geolocation'
import { API } from '../Config/Endpoint';
import { customColors, customFonts } from '../Config/helper';
import LocationIndicator from '../Components/LocationIndicator';

const Attendance = (locationData) => {
    const navigation = useNavigation();
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [activeStatus, setActiveStatus] = useState(0)
    const [locationEnabled, setLocationEnabled] = useState(false);
    const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
    const [watchId, setWatchId] = useState(false);
    const [capturedPhotoPath, setCapturedPhotoPath] = useState(null);
    const [formValues, setFormValues] = useState({
        UserId: '',
        Start_KM: '',
        Latitude: locationData.latitude,
        Longitude: locationData.longitude,
        Start_KM_Pic: ''
    })
    const [loading, setLoading] = useState(false);

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

    const handleInputChange = value => {
        setFormValues({ ...formValues, Start_KM: value });
    };

    const handlePhotoCapture = async (photoPath) => {
        setCapturedPhotoPath(photoPath);
        setFormValues({ ...formValues, Start_KM_Pic: photoPath });
    };

    const handleLocationUpdate = (locationData) => {
        // Update latitude and longitude in formValues state
        setFormValues(prevState => ({
            ...prevState,
            Latitude: locationData.latitude,
            Longitude: locationData.longitude,
        }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            if (!formValues.Latitude || !formValues.Longitude) {
                Alert.alert('Location Permission', 'Please enable location services.');
                return;
            }

            const formData = new FormData();
            formData.append('UserId', formValues.UserId);
            formData.append('Start_KM', formValues.Start_KM);
            formData.append('Latitude', location.latitude);
            formData.append('Longitude', location.longitude);
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
            ToastAndroid.show(responseData.message, ToastAndroid.LONG);
            navigation.replace('HomeScreen');
        } catch (error) {
            console.error('Error posting data:', error);
            Alert.alert('Error', 'Failed to submit data. Please try again later.');
        } finally {
            setLoading(false); // Set loading to false when form submission completes (either success or error)
        }
    };

    return (
        <ScrollView style={styles.container}>

            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={customColors.accent} />
                </View>
            )}

            <LocationIndicator onLocationUpdate={handleLocationUpdate} />

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
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
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