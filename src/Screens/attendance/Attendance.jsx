import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, Image, Modal, ToastAndroid, ActivityIndicator, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/AntDesign';
import CameraComponent from '../../Components/CameraComponent';
import { API } from '../../Config/Endpoint';
import { customColors, typography } from '../../Config/helper';
import LocationIndicator from '../../Components/LocationIndicator';

const Attendance = (locationData) => {
    const navigation = useNavigation();
    const scheme = useColorScheme();
    const colors = customColors[scheme === 'dark' ? 'dark' : 'light'];
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [showCameraModal, setShowCameraModal] = useState(false);
    const [capturedPhotoPath, setCapturedPhotoPath] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formValues, setFormValues] = useState({
        UserId: '',
        Start_KM: '',
        Latitude: locationData.latitude,
        Longitude: locationData.longitude,
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

    const handleLocationUpdate = (locationData) => {
        // Update latitude and longitude in formValues state
        setFormValues(prevState => ({
            ...prevState,
            Latitude: locationData.latitude,
            Longitude: locationData.longitude,
        }));
    };

    const handleInputChange = value => {
        setFormValues({ ...formValues, Start_KM: value });
    };

    const handlePhotoCapture = async (photoPath) => {
        setCapturedPhotoPath(photoPath);
        setFormValues({ ...formValues, Start_KM_Pic: photoPath });
    };

    const clearPhoto = () => {
        setCapturedPhotoPath(null);
    };

    const handleSubmit = async () => {
        if (isSubmitting) return; // Prevent multiple submissions
        setIsSubmitting(true); // Set submitting state to true
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
            setLoading(false);
            setIsSubmitting(false); // Reset submitting state
        }
    };

    return (
        <View style={styles(colors).container}>

            {loading && (
                <View style={styles(colors).loadingContainer}>
                    <ActivityIndicator size="large" color={colors.accent} />
                </View>
            )}

            <LocationIndicator onLocationUpdate={handleLocationUpdate} />

            <View style={styles(colors).inputGroup}>
                <TextInput
                    maxFontSizeMultiplier={1.2}
                    style={styles(colors).textInput}
                    value={formValues.Start_KM}
                    keyboardType='decimal-pad'
                    placeholder='Starting Kilometers'
                    autoCapitalize='characters'
                    onChangeText={handleInputChange}
                />
                <TouchableOpacity onPress={() => setShowCameraModal(true)}
                    style={styles(colors).cameraButton}
                >
                    <Text style={styles(colors).buttonText} maxFontSizeMultiplier={1.2}>{!capturedPhotoPath ? 'Take Photo' : 'Preview Photo'}</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={[styles(colors).submitButton, isSubmitting && styles(colors).disabledButton]}
                onPress={handleSubmit}
                disabled={isSubmitting}
            >
                <Text maxFontSizeMultiplier={1.2} style={styles(colors).buttonText}>Save</Text>
            </TouchableOpacity>

            <Modal
                visible={showCameraModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowCameraModal(false)}
            >
                <View style={styles(colors).modalContainer}>
                    <TouchableOpacity onPress={() => setShowCameraModal(false)} style={styles(colors).closeButton}>
                        <Icon name='close' size={30} color={colors.white} />
                    </TouchableOpacity>
                    {
                        !capturedPhotoPath ? (
                            <CameraComponent onPhotoCapture={handlePhotoCapture} />
                        ) : (
                            capturedPhotoPath && typeof capturedPhotoPath === 'string' && (
                                <View style={styles(colors).previewImageContainer}>
                                    <Image
                                        source={{ uri: 'file://' + capturedPhotoPath }}
                                        style={styles(colors).previewImage}
                                    />
                                    <TouchableOpacity onPress={clearPhoto} style={styles(colors).clearPhotoButton}>
                                        <Text maxFontSizeMultiplier={1.2} style={styles(colors).buttonText}>Retake Photo</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setShowCameraModal(false)} style={[styles(colors).submitButton, { marginTop: 15, backgroundColor: colors.primary }]}>
                                        <Text maxFontSizeMultiplier={1.2} style={styles(colors).buttonText}>Okay</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        )
                    }
                </View>
            </Modal >
        </View >
    )
}

export default Attendance

const styles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
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
    inputGroup: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 50,
        marginHorizontal: 10,
    },
    textInput: {
        borderWidth: 1.5,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginTop: 20,
        marginHorizontal: 20,
        ...typography.h6(colors),
        color: colors.text,
    },
    cameraButton: {
        backgroundColor: colors.accent,
        borderRadius: 5,
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 20,
    },
    buttonText: {
        ...typography.button(colors),
        color: colors.white,
    },
    submitButton: {
        backgroundColor: colors.accent,
        justifyContent: 'center',
        alignContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 5,
    },
    disabledButton: {
        backgroundColor: '#6c757d',
    },
    previewImageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewImage: {
        width: 350,
        height: 350,
        resizeMode: 'cover',
        borderRadius: 10,
        marginLeft: 50,
        marginRight: 50,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        marginLeft: 'auto',
        right: 25,
    },
    clearPhotoButton: {
        marginTop: 25,
        backgroundColor: colors.accent,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
})