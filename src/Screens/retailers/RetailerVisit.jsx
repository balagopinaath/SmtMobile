import { Image, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View, Modal, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import { API } from '../../Config/Endpoint';
import Icon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native'
import { customColors, typography } from '../../Config/helper';
import { Dropdown } from 'react-native-element-dropdown';
import CustomRadioButton from '../../Components/CustomRadioButton';
import LocationIndicator from '../../Components/LocationIndicator';
import CameraComponent from '../../Components/CameraComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RetailerVisit = () => {
    const navigation = useNavigation();
    const scheme = useColorScheme();
    const colors = customColors[scheme === 'dark' ? 'dark' : 'light'];
    const [formValues, setFormValues] = useState({
        Retailer_Id: selectedRetail,
        Retailer_Name: '',
        Contact_Person: '',
        Mobile_No: '',
        Route_Id: '',
        Location_Address: '',
        Narration: '',
        Location_Image: ''
    });
    const [retailerData, setRetailerData] = useState([])
    const [selectedRetail, setSelectedRetail] = useState(null);
    const [selectedValue, setSelectedValue] = useState('exist');
    const [capturedPhotoPath, setCapturedPhotoPath] = useState(null);
    const [showCameraModal, setShowCameraModal] = useState(false);
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [id, setId] = useState()

    useEffect(() => {
        (async () => {
            try {
                const userId = await AsyncStorage.getItem('UserId');
                const companyId = await AsyncStorage.getItem('Company_Id');
                fetchCustomersData(companyId)
                setId(userId)
            } catch (err) {
                console.log(err);
            }
        })();
    }, [])

    const fetchCustomersData = async (companyId) => {
        try {
            const response = await fetch(`${API.retailerName}${companyId}`);
            if (!response.ok) {
                throw new Error(`API request failed with status: ${response.status}`);
            }
            const jsonData = await response.json();
            setRetailerData(jsonData.data)
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleInputChange = (fieldName, value) => {
        setFormValues(prevState => ({
            ...prevState,
            [fieldName]: value
        }));
    };

    const handlePhotoCapture = async (photoPath) => {
        setCapturedPhotoPath(photoPath);
        setFormValues(prevState => ({
            ...prevState,
            Location_Image: photoPath
        }));
    };

    const clearPhoto = () => {
        setCapturedPhotoPath(null);
    };

    const handleSubmit = async () => {
        const formData = new FormData();

        formData.append("Mode", selectedValue === 'exist' ? 1 : 2);

        if (selectedValue === 'exist') {
            formData.append("Retailer_Id", selectedRetail);
            if (location.latitude && location.longitude) {
                formData.append("Latitude", location.latitude);
                formData.append("Longitude", location.longitude);
            }
            formData.append("Narration", formValues.Narration);
            formData.append("EntryBy", id);
        } else {
            formData.append("Reatailer_Name", formValues.Retailer_Name);
            formData.append("Contact_Person", formValues.Contact_Person);
            formData.append("Contact_Mobile", formValues.Mobile_No);
            formData.append("Location_Address", formValues.Location_Address);

            if (formValues.Mobile_No.trim() === '') {
                ToastAndroid.show('Mobile Number cannot be empty', ToastAndroid.LONG);
                return;
            }

            if (location.latitude && location.longitude) {
                formData.append("Latitude", location.latitude);
                formData.append("Longitude", location.longitude);
            }
            formData.append("Narration", formValues.Narration);
            formData.append("EntryBy", id);
        }

        if (capturedPhotoPath) {
            const photo = {
                uri: `file://${formValues.Location_Image}`,
                type: 'image/jpeg',
                name: capturedPhotoPath
            };
            formData.append("Location_Image", photo);
        }

        fetch(API.visitedLog, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        }).then(response => response.json())
            .then(data => {
                if (data.success) {
                    ToastAndroid.show(data.message, ToastAndroid.LONG);
                    navigation.navigate('HomeScreen')
                }
            }).catch(error => {
                ToastAndroid.show(error, ToastAndroid.LONG);
                console.error('Error submitting form:', error);
            });
    };

    return (
        <ScrollView style={styles(colors).container}>

            <LocationIndicator onLocationUpdate={(locationData) => setLocation(locationData)} />

            <View style={styles(colors).radioView}>
                <CustomRadioButton
                    label="New Retailer"
                    selected={selectedValue === 'new'}
                    onSelect={() => setSelectedValue('new')}
                />

                <CustomRadioButton
                    label="Existing Retailer"
                    selected={selectedValue === 'exist'}
                    onSelect={() => { setSelectedValue('exist') }}
                />
            </View>

            {selectedValue === 'exist' &&
                <ScrollView>
                    <Dropdown
                        data={retailerData}
                        labelField="Retailer_Name"
                        valueField="Retailer_Id"
                        placeholder="Select Retailer"
                        value={selectedRetail}
                        onChange={item => {
                            setSelectedRetail(item.Retailer_Id);
                            setFormValues(prevState => ({
                                ...prevState,
                                Retailer_Id: item.Retailer_Id
                            }));
                        }}
                        maxHeight={300}
                        search
                        searchPlaceholder="Search Retailer"
                        style={styles(colors).dropdown}
                        placeholderStyle={styles(colors).placeholderStyle}
                        containerStyle={styles(colors).dropdownContainer}
                        selectedTextStyle={styles(colors).selectedTextStyle}
                        inputSearchStyle={styles(colors).inputSearchStyle}
                        maxFontSizeMultiplier={1.2}
                    />

                    <TextInput
                        maxFontSizeMultiplier={1.2}
                        style={styles(colors).textArea}
                        multiline={true}
                        numberOfLines={4}
                        placeholder='Enter a narration'
                        value={formValues.Narration}
                        onChangeText={(text) => handleInputChange('Narration', text)} // Ensure this is properly set
                    />

                    <View style={styles(colors).buttonGroup}>
                        <TouchableOpacity onPress={() => setShowCameraModal(true)}
                            style={styles(colors).button}
                        >
                            <Text maxFontSizeMultiplier={1.2} style={styles(colors).buttonText}>
                                {!capturedPhotoPath ? 'Take Photo' : 'Preview Photo'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleSubmit}
                            style={styles(colors).button}
                        ><Text style={styles(colors).buttonText}>Submit</Text></TouchableOpacity>
                    </View>

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
                                                <Text style={styles(colors).buttonText}>Retake Photo</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => setShowCameraModal(false)} style={styles(colors).button}>
                                                <Text style={styles(colors).buttonText}>Okay</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                )
                            }
                        </View>
                    </Modal>
                </ScrollView>
            }

            {selectedValue === 'new' &&
                <View>
                    <TextInput
                        maxFontSizeMultiplier={1.2}
                        style={styles(colors).inputBox}
                        value={formValues.Retailer_Name}
                        keyboardType="default"
                        autoCapitalize="characters"
                        placeholder="Retailer Name"
                        onChangeText={(text) => handleInputChange('Retailer_Name', text)}
                    />

                    <TextInput
                        maxFontSizeMultiplier={1.2}
                        style={styles(colors).inputBox}
                        value={formValues.Contact_Person}
                        keyboardType="default"
                        autoCapitalize="characters"
                        placeholder="Contact Person"
                        onChangeText={(text) => handleInputChange('Contact_Person', text)}
                    />

                    <TextInput
                        maxFontSizeMultiplier={1.2}
                        style={styles(colors).inputBox}
                        value={formValues.Mobile_No}
                        keyboardType="phone-pad"
                        autoCapitalize="none"
                        placeholder="Mobile Number"
                        onChangeText={(text) => handleInputChange('Mobile_No', text)}
                    />

                    <TextInput
                        maxFontSizeMultiplier={1.2}
                        style={styles(colors).inputBox}
                        value={formValues.Location_Address}
                        keyboardType="default"
                        placeholder="Address"
                        onChangeText={(text) => handleInputChange('Location_Address', text)}
                    />

                    <TextInput
                        maxFontSizeMultiplier={1.2}
                        style={styles(colors).textArea}
                        multiline={true}
                        numberOfLines={4}
                        placeholder='Enter a narration'
                        value={formValues.Narration}
                        onChangeText={(text) => handleInputChange('Narration', text)} // Ensure this is properly set
                    />

                    <View style={styles(colors).buttonGroup}>
                        <TouchableOpacity onPress={() => setShowCameraModal(true)}
                            style={styles(colors).button}
                        ><Text style={styles(colors).buttonText}>{!capturedPhotoPath ? 'Take Photo' : 'Preview Photo'}</Text></TouchableOpacity>

                        <TouchableOpacity onPress={handleSubmit}
                            style={styles(colors).button}
                        ><Text style={styles(colors).buttonText}>Submit</Text></TouchableOpacity>
                    </View>

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
                                                <Text style={styles(colors).buttonText}>Retake Photo</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => setShowCameraModal(false)} style={styles(colors).button}>
                                                <Text style={styles(colors).buttonText}>Okay</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                )
                            }
                        </View>
                    </Modal>
                </View>
            }

        </ScrollView>
    )
}

export default RetailerVisit

const styles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    radioView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20
    },
    dropdown: {
        marginHorizontal: 20,
        marginVertical: 20,
        height: 45,
        padding: 15,
        borderRadius: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        backgroundColor: colors.background,
    },
    dropdownContainer: {
        backgroundColor: colors.background, // Background color of the dropdown list
        borderColor: colors.textPrimary, // Border color of the dropdown list
        borderWidth: 0.5,
        borderRadius: 10,
    },
    placeholderStyle: {
        ...typography.h6(colors),
        fontWeight: '500',
        color: colors.textSecondary,
    },
    selectedTextStyle: {
        ...typography.h6(colors),
        fontWeight: '600',
        color: colors.textPrimary,
    },
    inputSearchStyle: {
        ...typography.h6(colors),
        fontWeight: '400',
        color: colors.textPrimary,
    },
    textArea: {
        borderWidth: 1,
        marginHorizontal: 20,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        ...typography.body1(colors),
        color: colors.text,
        fontWeight: '400',
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 50
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        marginLeft: 'auto',
        top: 15,
        right: 25,
    },
    previewImageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    previewImage: {
        width: 350,
        height: 450,
        resizeMode: 'cover',
        borderRadius: 10,
    },
    button: {
        width: 150,
        height: 50,
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: colors.primary,
        color: colors.white,
        borderRadius: 10,
        marginTop: 30
    },
    buttonText: {
        textAlign: 'center',
        ...typography.button(colors),
        fontWeight: '400',
    },
    clearPhotoButton: {
        width: 150,
        height: 50,
        marginTop: 30,
        backgroundColor: colors.accent,
        color: colors.white,
        padding: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    inputBox: {
        borderWidth: 1,
        marginHorizontal: 20,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        ...typography.body1(colors),
        color: colors.text,
    },
})