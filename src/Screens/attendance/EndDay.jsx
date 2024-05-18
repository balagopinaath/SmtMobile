import { StyleSheet, Text, ScrollView, View, TouchableOpacity, TextInput, Image, ToastAndroid, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CameraComponent from '../../Components/CameraComponent';
import { API } from '../../Config/Endpoint';
import { customColors, customFonts } from '../../Config/helper';

const EndDay = () => {
    const navigation = useNavigation();
    const [capturedPhotoPath, setCapturedPhotoPath] = useState(null);
    const [showCameraModal, setShowCameraModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formValues, setFormValues] = useState({
        Id: '',
        End_KM: '',
        End_KM_Pic: ''
    })

    useEffect(() => {
        (async () => {
            try {
                const userId = await AsyncStorage.getItem('UserId');
                getAttendanceInfo(userId)
                setFormValues({ ...formValues, Id: userId });
            } catch (err) {
                console.log(err);
            }
        })();
    }, [])

    const getAttendanceInfo = async (userId) => {
        try {
            const url = `${API.MyLastAttendance}${userId}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const attendanceStatus = await response.json();

            setFormValues({ ...formValues, Id: attendanceStatus.data[0].Id });
        } catch (error) {
            console.log("Error fetching attendance data:", error);
        }
    };

    const handleInputChange = value => {
        setFormValues({ ...formValues, End_KM: value });
    };

    const handlePhotoCapture = (photoPath) => {
        setCapturedPhotoPath(photoPath);
        setFormValues({ ...formValues, End_KM_Pic: photoPath });
    };

    const clearPhoto = () => {
        setCapturedPhotoPath(null);
    };

    const handleSubmit = async () => {
        if (isSubmitting) return; // Prevent multiple submissions
        setIsSubmitting(true); // Set submitting state to true
        try {
            const formData = new FormData();
            formData.append('Id', formValues.Id);
            formData.append('End_KM', formValues.End_KM);
            formData.append("End_KM_Pic", {
                uri: `file://${formValues.End_KM_Pic}`,
                name: 'photo.jpg',
                type: 'image/jpeg'
            })

            console.log(formValues)

            const response = await fetch(API.attendance, {
                method: 'DELETE',
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
            ToastAndroid.show('Your attendance update successfully', ToastAndroid.LONG);
            navigation.navigate('HomeScreen')

        } catch (error) {
            console.error('Error posting data:', error);
        } finally {
            setIsSubmitting(false); // Reset submitting state
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.inputGroup}>
                <TextInput
                    style={styles.textInput}
                    value={formValues.End_KM}
                    keyboardType='number-pad'
                    placeholder='Ending Kilometers'
                    autoCapitalize='characters'
                    onChangeText={handleInputChange}
                />
                <TouchableOpacity onPress={() => setShowCameraModal(true)}
                    style={styles.cameraButton}
                >
                    <Text style={styles.buttonText}>{!capturedPhotoPath ? 'Take Photo' : 'Preview Photo'}</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={[styles.submitButton, isSubmitting && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={isSubmitting}
            >
                <Text style={styles.buttonText}>Close Attendance</Text>
            </TouchableOpacity>

            <Modal
                visible={showCameraModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowCameraModal(false)}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity onPress={() => setShowCameraModal(false)} style={styles.closeButton}>
                        <Icon name='close' size={30} color={customColors.white} />
                    </TouchableOpacity>
                    {
                        !capturedPhotoPath ? (
                            <CameraComponent onPhotoCapture={handlePhotoCapture} />
                        ) : (
                            capturedPhotoPath && typeof capturedPhotoPath === 'string' && (
                                <View style={styles.previewImageContainer}>
                                    <Image
                                        source={{ uri: 'file://' + capturedPhotoPath }}
                                        style={styles.previewImage}
                                    />
                                    <TouchableOpacity onPress={clearPhoto} style={styles.clearPhotoButton}>
                                        <Text style={styles.buttonText}>Retake Photo</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        )
                    }
                </View>
            </Modal>
        </View>
    )
}

export default EndDay

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: customColors.background,
        justifyContent: 'center',
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
        fontFamily: customFonts.plusJakartaSansMedium,
        color: customColors.text,
        fontSize: 14,
    },
    cameraButton: {
        backgroundColor: customColors.accent,
        borderRadius: 5,
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 20,
    },
    buttonText: {
        fontFamily: customFonts.plusJakartaSansMedium,
        color: customColors.white,
        fontSize: 16,
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
    submitButton: {
        backgroundColor: customColors.accent,
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
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
})