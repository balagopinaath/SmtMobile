import { View, Text, TextInput, Button, StyleSheet, StatusBar, TouchableOpacity, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import Colors from '../Config/Colors';
import { Dropdown } from 'react-native-element-dropdown';
import CustomIcon from '../Components/CustomIcon';
import Fonts from '../Config/Fonts';
import Geolocation from '@react-native-community/geolocation'

const AddCustomer = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [formValues, setFormValues] = useState({
        Retailer_Name: '',
        Contact_Person: '',
        Mobile_No: '',
        Route_Id: '',
        Area_Id: '',
        Reatailer_Address: '',
        Reatailer_City: '',
        PinCode: '',
        State_Id: '',
        Gstno: '',
        Latitude: '',
        Longitude: '',
        Profile_Pic: '',
        Created_By: '1',
    });
    const [routes, setRoutes] = useState('')
    const [areas, setAreas] = useState('')
    const [state, setState] = useState('')
    const [distributors, setDistributors] = useState('')
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    const [imageUri, setImageUri] = useState(null);

    useEffect(() => {
        fetchRoutes()
        fetchAreas()
        fetchStates()

        if (route.params?.imageUri) {
            setImageUri(route.params.imageUri);
        }
    }, [route.params?.imageUri])

    const fetchRoutes = async () => {
        try {
            const response = await fetch("http://192.168.1.10:9001/api/masters/routes", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();

            if (data.success === true) {
                setRoutes(data.data);
            } else {
                console.log("Failed to fetch routes:", data.message);
            }
        } catch (error) {
            console.log("Error fetching routes:", error);
        }
    };

    const fetchAreas = async () => {
        try {
            const response = await fetch("http://192.168.1.10:9001/api/masters/areas", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();

            if (data.success === true) {
                // console.log(data.data)
                setAreas(data.data);
            } else {
                console.log("Failed to fetch routes:", data.message);
            }
        } catch (error) {
            console.log("Error fetching routes:", error);
        }
    };

    const fetchStates = async () => {
        try {
            const response = await fetch("http://192.168.1.10:9001/api/masters/state", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();

            if (data.success === true) {
                // console.log(data.data)
                setState(data.data);
            } else {
                console.log("Failed to fetch routes:", data.message);
            }
        } catch (error) {
            console.log("Error fetching routes:", error);
        }
    };

    const fetchDistributors = async () => {
        try {
            const response = await fetch("http://192.168.1.10:9001/api/masters/distributors", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();

            if (data.success === true) {
                // console.log(data.data)
                setDistributors(data.data);
            } else {
                console.log("Failed to fetch routes:", data.message);
            }
        } catch (error) {
            console.log("Error fetching routes:", error);
        }
    };

    const handleGeoData = async () => {
        try {
            Geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude.toString();
                    const longitude = position.coords.longitude.toString();

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

    const handleOpenCamera = () => {
        navigation.navigate('OpenCamera', { onImageCapture: handleImageCapture });
    };

    const handleImageCapture = (uri) => {
        setImageUri(uri);
        setFormValues({ ...formValues, profilePic: uri })
    };

    const handleInputChange = (field, value) => {
        setFormValues({ ...formValues, [field]: value });
    };

    const handleSubmit = async () => {
        console.log("Retailer_Name", formValues.Retailer_Name)
        console.log("Contact_Person", formValues.Contact_Person)
        console.log("Mobile_No", formValues.Mobile_No)
        console.log("Route_Id", formValues.Route_Id)
        console.log("Area_Id", formValues.Area_Id)
        console.log("Reatailer_Address", formValues.Reatailer_Address)
        console.log("Reatailer_City", formValues.Reatailer_City)
        console.log("PinCode", formValues.PinCode)
        console.log("State_Id", formValues.State_Id)
        console.log("Gstno", formValues.Gstno)
        console.log("Latitude", formValues.Latitude)
        console.log("Longitude", formValues.Longitude)
        console.log("Profile_Pic", formValues.Profile_Pic)
        console.log("Created_By", formValues.Created_By)

        // console.log("Created_By", `file://${imageUri}`)
        // console.log("Created_By", imageUri)

        var formData = new FormData()
        formData.append("Retailer_Name", formValues.Retailer_Name)
        formData.append("Contact_Person", formValues.Contact_Person)
        formData.append("Mobile_No", formValues.Mobile_No)
        formData.append("Route_Id", formValues.Route_Id)
        formData.append("Area_Id", formValues.Area_Id)
        formData.append("Reatailer_Address", formValues.Reatailer_Address)
        formData.append("Reatailer_City", formValues.Reatailer_City)
        formData.append("PinCode", formValues.PinCode)
        formData.append("State_Id", formValues.State_Id)
        formData.append("Gstno", formValues.Gstno)
        formData.append("Latitude", formValues.Latitude)
        formData.append("Longitude", formValues.Longitude)
        formData.append("Profile_Pic", {
            uri: `file://${imageUri}`,
            name: 'photo.jpg',
            type: 'image/jpeg'
        })
        formData.append("Created_By", formValues.Created_By)

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data",
            },
            body: formData
        };

        fetch("http://192.168.1.10:9001/api/masters/retailers", requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));

    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Colors.primary} />
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.pop()}>
                    <CustomIcon name="arrow-left" color={Colors.white} size={20} />
                </TouchableOpacity>
            </View>

            <ScrollView>
                <View style={styles.TopContainer}>

                    {routes && (
                        <>
                            <Text style={styles.label}>Routes <Text style={{ color: "red" }}>*</Text></Text>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                data={routes}
                                value={value}
                                search
                                maxHeight={300}
                                placeholder={!isFocus ? "Select Route" : "..."}
                                searchPlaceholder="Search..."
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                onChange={(value) => {
                                    // console.log(value)
                                    setFormValues({ ...formValues, Route_Id: value.Route_Id })
                                    setIsFocus(false)
                                }}
                                labelField="Route_Name"
                            />
                        </>
                    )}

                    <Text style={styles.label}>Retailer Name <Text style={{ color: "red" }}>*</Text></Text>
                    <TextInput
                        style={styles.input}
                        value={formValues.Retailer_Name}
                        placeholder='Retailer Name'
                        onChangeText={(text) => handleInputChange('Retailer_Name', text)}
                    />

                    <Text style={styles.label}>Contact Person <Text style={{ color: "red" }}>*</Text></Text>
                    <TextInput
                        style={styles.input}
                        value={formValues.Contact_Person}
                        placeholder='Contact Person'
                        onChangeText={(text) => handleInputChange('Contact_Person', text)}
                    />

                    <Text style={styles.mobileLabel}>GST Number <Text style={{ color: "red" }}>*</Text></Text>
                    <TextInput
                        style={styles.input}
                        value={formValues.Gstno}
                        keyboardType='default'
                        placeholder='GST Number'
                        onChangeText={(text) => handleInputChange('Gstno', text)}
                    />

                    {imageUri && typeof imageUri === 'string' ? (
                        <Image source={`file://${imageUri}` ? { uri: 'file://' + imageUri } : null} style={styles.previewImage} />
                    ) : null}

                    <TouchableOpacity style={styles.geoButton} onPress={handleOpenCamera}>
                        <Text style={styles.geoButtonText}>Open Camera</Text>
                    </TouchableOpacity>

                    {areas && (
                        <>
                            <Text style={styles.label}>Areas <Text style={{ color: "red" }}>*</Text></Text>
                            <Dropdown
                                data={areas}
                                value={value}
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                search
                                maxHeight={300}
                                placeholder={!isFocus ? "Select Area" : "..."}
                                searchPlaceholder="Search..."
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                onChange={(value) => {
                                    // console.log(value)
                                    setFormValues({ ...formValues, Area_Id: value.Area_Id })
                                    setIsFocus(false)
                                }}
                                labelField="Area_Name"
                            />
                        </>

                    )}

                    <View style={styles.geoContainer}>
                        <TextInput
                            style={styles.geoInput}
                            value={formValues.Latitude}
                            placeholder='Latitude'
                            keyboardType='numeric'
                            onChangeText={(text) => handleInputChange('Latitude', text)}
                        />

                        <TextInput
                            style={styles.geoInput}
                            value={formValues.Longitude}
                            placeholder='Longitude'
                            keyboardType='numeric'
                            onChangeText={(text) => handleInputChange('Longitude', text)}
                        />

                        <TouchableOpacity style={styles.geoButton} onPress={handleGeoData}>
                            <Text style={styles.geoButtonText}>GeoData</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.mobileLabel}>Retailer Address <Text style={{ color: "red" }}>*</Text></Text>
                    <TextInput
                        style={styles.input}
                        value={formValues.Reatailer_Address}
                        keyboardType='default'
                        placeholder='Reatailer Address'
                        onChangeText={(text) => handleInputChange('Reatailer_Address', text)}
                    />

                    <Text style={styles.label}>City <Text style={{ color: "red" }}>*</Text></Text>
                    <TextInput
                        style={styles.input}
                        value={formValues.Reatailer_City}
                        keyboardType='default'
                        placeholder='City'
                        onChangeText={(text) => handleInputChange('Reatailer_City', text)}
                    />

                    <Text style={styles.label}>PinCode <Text style={{ color: "red" }}>*</Text></Text>
                    <TextInput
                        style={styles.input}
                        value={formValues.PinCode}
                        keyboardType='number-pad'
                        placeholder='PinCode'
                        onChangeText={(text) => handleInputChange('PinCode', text)}
                    />

                    {state && (
                        <>
                            <Text style={styles.label}>State <Text style={{ color: "red" }}>*</Text></Text>
                            <Dropdown
                                data={state}
                                value={value}
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                search
                                maxHeight={300}
                                placeholder={!isFocus ? "Select State" : "..."}
                                searchPlaceholder="Search..."
                                onChange={(value) => {
                                    // console.log(value)
                                    setFormValues({ ...formValues, State_Id: value.State_Id })
                                    setIsFocus(false)
                                }}
                                labelField="State_Name"
                            />
                        </>
                    )}

                    <Text style={styles.mobileLabel}>Mobile Number <Text style={{ color: "red" }}>*</Text></Text>
                    <TextInput
                        style={styles.input}
                        value={formValues.Mobile_No}
                        keyboardType='phone-pad'
                        placeholder='Mobile Number'
                        onChangeText={(text) => handleInputChange('Mobile_No', text)}
                    />


                    <TouchableOpacity style={styles.geoButton} onPress={handleSubmit}>
                        <Text style={styles.geoButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}

export default AddCustomer

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: Colors.primary,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    TopContainer: {
        padding: 20,
    },
    dropdown: {
        height: 50,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
        marginBottom: 20
    },
    placeholderStyle: {
        fontSize: 16,
    },
    previewImage: {
        width: '100',
        height: 200,
        resizeMode: 'cover',
        borderRadius: 10,
        marginBottom: 20,
    },
    imagePreview: {
        width: 200,
        height: 200,
        resizeMode: 'cover',
        borderRadius: 10,
        marginBottom: 20,
    },
    geoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignContent: 'center',
        marginTop: 10
    },
    geoInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 25,
        marginRight: 15,
    },
    geoButton: {
        flex: 1,
        backgroundColor: Colors.accent,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        marginBottom: 25,
    },
    geoButtonText: {
        color: 'white', // Change the text color as needed
        fontSize: 16,
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
        color: Colors.text,
        fontFamily: Fonts.plusJakartaSansBold
    },
    mobileLabel: {
        fontSize: 14,
        marginBottom: 5,
        color: Colors.text,
        marginTop: 10,
        fontFamily: Fonts.plusJakartaSansBold
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
})