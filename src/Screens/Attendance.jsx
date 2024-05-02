import { StyleSheet, Text, ScrollView, View, TouchableOpacity, TextInput, Image } from 'react-native'
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

        getAttendanceInfo(formValues.UserId)

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

            if (attendanceStatus.data[0].length > 0) {
                if (attendanceStatus.data[0].Active_Status == 1) {
                    navigation.replace('HomeScreen');
                } else {
                    // navigation.replace('');
                }
            }
        } catch (error) {
            console.log("Error fetching attendance data:", error);
        }
    }


    const handleInputChange = value => {
        setFormValues({ ...formValues, Start_KM: value });
    };

    const handlePhotoCapture = (photoPath) => {
        setCapturedPhotoPath(photoPath);
        setFormValues({ ...formValues, Start_KM_Pic: photoPath });
    };

    const handleGeoData = async () => {
        try {
            Geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude.toString();
                    const longitude = position.coords.longitude.toString();
                    console.log('form', formValues.Latitude, formValues.Longitude)

                    setFormValues({
                        ...formValues,
                        Latitude: latitude,
                        Longitude: longitude,
                    });
                }
            )
        } catch (error) {
            console.error('Error fetching geolocation data:', error);
        }
    }

    const handleSubmit = async () => {
        try {
            await handleGeoData();
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
                        <>
                            <Image
                                source={`file://${capturedPhotoPath}` ? { uri: 'file://' + capturedPhotoPath } : null}
                                style={styles.previewImage}
                            />
                        </>
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
    previewImage: {
        alignSelf: 'flex-end',
        width: '60%',
        height: '15%',
        resizeMode: 'cover',
        borderRadius: 10,
        marginBottom: 20,
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