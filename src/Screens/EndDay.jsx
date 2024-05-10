import { StyleSheet, Text, ScrollView, View, TouchableOpacity, TextInput, Image, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import CustomIcon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CameraComponent from '../Components/CameraComponent';
import { API } from '../Config/Endpoint';
import { customColors, customFonts } from '../Config/helper';

const EndDay = () => {
    const navigation = useNavigation();
    const [capturedPhotoPath, setCapturedPhotoPath] = useState(null);
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

    const handleSubmit = async () => {
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
            ToastAndroid.show('Your attendance update successfully', ToastAndroid.SHORT);
            navigation.navigate('HomeScreen')

        } catch (error) {
            console.error('Error posting data:', error);
        }
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <CustomIcon name="angle-left" color={customColors.white} size={25} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Close Attendance</Text>
            </View>

            <View>
                <TextInput
                    style={styles.input}
                    value={formValues.End_KM}
                    keyboardType='decimal-pad'
                    placeholder='Ending Kilometers'
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
                <Text style={styles.buttonText}>Close Attendance</Text>
            </TouchableOpacity>

        </ScrollView>
    )
}

export default EndDay

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
        marginLeft: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: customColors.white,
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