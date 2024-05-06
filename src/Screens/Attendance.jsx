import { StyleSheet, Text, ScrollView, View, TouchableOpacity, TextInput, Image, PermissionsAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import CustomIcon from '../Components/CustomIcon';
import Colors from '../Config/Colors';
import Fonts from '../Config/Fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CameraComponent from '../Components/CameraComponent';
import Geolocation from '@react-native-community/geolocation'

const Attendance = () => {
    const navigation = useNavigation();
    const [locationEnabled, setLocationEnabled] = useState(false);
    const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
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
                getAttendanceInfo(userId)
            } catch (err) {
                console.log(err);
            }
        })();

        requestLocationPermission()

    }, [])

    const getAttendanceInfo = async (userId) => {
        try {
            const url = `http://192.168.1.2:9001/api/getMyLastAttendance?UserId=${userId}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const attendanceStatus = await response.json();

            if (attendanceStatus && attendanceStatus.data && attendanceStatus.data.length > 0) {
                const activeStatus = attendanceStatus.data[0].Active_Status;
                if (activeStatus !== undefined && activeStatus === 1) {
                    navigation.replace('HomeScreen');
                } else {
                    console.log('Attendance data found but inactive');
                    // Handle other cases if needed
                }
            } else {
                console.log('Attendance data not found or invalid format');
            }
        } catch (error) {
            console.log("Error fetching attendance data:", error);
        }
    }

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
                checkLocationStatus();
            } else {
                console.log('Location permission denied');
            }
        } catch (err) {
            console.warn('Error requesting location permission:', err);
        }
    };

    const checkLocationStatus = async () => {
        const enabled = await Geolocation.requestAuthorization();
        if (enabled === 'authorizedAlways' || enabled === 'authorizedWhenInUse') {
            Geolocation.getCurrentPosition(
                (position) => {
                    setLocationEnabled(true);
                    const { latitude, longitude } = position.coords;
                    setFormValues({
                        ...formValues,
                        Latitude: latitude,
                        Longitude: longitude,
                    });
                },
                (error) => {
                    setLocationEnabled(false);
                    console.error('Error getting current position:', error);
                }
            );
        } else {
            console.log('Location services disabled');
        }
    };

    const handleInputChange = value => {
        setFormValues({ ...formValues, Start_KM: value });
    };

    const handlePhotoCapture = async (photoPath) => {
        await requestLocationPermission()
        setCapturedPhotoPath(photoPath);
        setFormValues({ ...formValues, Start_KM_Pic: photoPath });
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('UserId', formValues.UserId);
            formData.append('Start_KM', formValues.Start_KM);
            formData.append('Latitude', formValues.Latitude);
            formData.append('Longitude', formValues.Longitude);
            formData.append("Start_KM_Pic", {
                uri: `file://${formValues.Start_KM_Pic}`,
                name: 'photo.jpg',
                type: 'image/jpeg'
            })

            console.log(formValues)

            const response = await fetch('http://192.168.1.2:9001/api/attendance', {
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
            navigation.replace('HomeScreen')
            console.log('Response from server:', responseData);

        } catch (error) {
            console.error('Error posting data:', error);
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
        backgroundColor: Colors.background,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: Colors.primary,
        marginBottom: 20
    },
    headerText: {
        fontFamily: Fonts.plusJakartaSansMedium,
        color: Colors.white,
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
        backgroundColor: Colors.accent,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        marginBottom: 25,
        marginHorizontal: 15
    },
    buttonText: {
        color: Colors.white,
        fontSize: 16,
    },
})