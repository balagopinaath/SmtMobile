import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation, useRoute } from '@react-navigation/native'
import ImageViewer from 'react-native-image-viewing';
import CustomIcon from '../Components/CustomIcon';
import Colors from '../Config/Colors';
import Fonts from '../Config/Fonts';

const EditCustomer = ({ route }) => {
    const { item } = route.params;
    const navigation = useNavigation();
    const routeParam = useRoute();

    const [editValue, setEditValue] = useState({
        Retailer_Id: "",
        Retailer_Name: "",
        Contact_Person: "",
        Mobile_No: "",
        Retailer_Channel_Id: "",
        Retailer_Class: "",
        Route_Id: "",
        Area_Id: "",
        Reatailer_Address: "",
        Reatailer_City: "",
        PinCode: "",
        State_Id: "",
        Sales_Force_Id: "",
        Distributor_Id: "",
        Gstno: "",
        Created_By: "",
        Profile_Pic: ""
    })
    const [routes, setRoutes] = useState(editValue.Route_Id)
    const [areas, setAreas] = useState(editValue.Area_Id)
    const [state, setState] = useState(editValue.State_Id)
    const [distributors, setDistributors] = useState(editValue.Distributor_Id)
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    const [imageUri, setImageUri] = useState(null);

    useEffect(() => {
        fetchRoutes()
        fetchAreas()
        fetchStates()
        fetchDistributors()

        if (routeParam.params?.imageUri) {
            setImageUri(routeParam.params.imageUri);
        }
    }, [routeParam.params?.imageUri])

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

    const handleInputChange = (field, value) => {
        setEditValue({ ...editValue, [field]: value });
    };

    const handleImageCapture = (uri) => {
        setImageUri(uri);
        setEditValue({ ...editValue, profilePic: uri })
    };

    const handleOpenCamera = () => {
        navigation.navigate('TakePhoto', { onImageCapture: handleImageCapture, item: item });
    };

    const handleSubmit = () => {
        if (
            !editValue.Retailer_Name ||
            !editValue.Contact_Person ||
            !editValue.Gstno ||
            !editValue.Route_Id ||
            !editValue.Area_Id ||
            !editValue.Reatailer_Address ||
            !editValue.Reatailer_City ||
            !editValue.PinCode ||
            !editValue.State_Id ||
            !editValue.Mobile_No ||
            !editValue.Distributor_Id
        ) {
            Alert.alert('Please fill in all required fields.');
            return;
        }

        console.log('Form submitted successfully:', editValue);
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.pop()}>
                    <CustomIcon name="arrow-left" color={Colors.white} size={25} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Edit Retailer</Text>
            </View>

            <ScrollView>
                <View style={styles.TopContainer}>
                    {routes && routes.length > 0 && (
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
                                onChange={(selectedValue) => {
                                    setEditValue({ ...editValue, Route_Id: selectedValue.Route_Id })
                                    setIsFocus(false)
                                }}
                                labelField="Route_Name"
                            />
                        </>
                    )}

                    <Text style={styles.label}>Retailer Name <Text style={{ color: "red" }}>*</Text></Text>
                    <TextInput
                        style={styles.input}
                        value={item.Retailer_Name}
                        placeholder='Retailer Name'
                        onChangeText={(text) => handleInputChange('Retailer_Name', text)}
                    />

                    <Text style={styles.label}>Contact Person <Text style={{ color: "red" }}>*</Text></Text>
                    <TextInput
                        style={styles.input}
                        value={item.Contact_Person}
                        placeholder='Contact Person'
                        onChangeText={(text) => handleInputChange('Contact_Person', text)}
                    />

                    <Text style={styles.mobileLabel}>GST Number <Text style={{ color: "red" }}>*</Text></Text>
                    <TextInput
                        style={styles.input}
                        value={item.Gstno}
                        keyboardType='default'
                        placeholder='GST Number'
                        onChangeText={(text) => handleInputChange('Gstno', text)}
                    />

                    {imageUri && typeof imageUri === 'string' ? (
                        <>
                            <TouchableOpacity
                                onPress={() => setImageUri(null)}
                                style={styles.removeButton}>
                                <CustomIcon name="close-circle" size={24} color={'red'} />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Image source={`file://${imageUri}` ? { uri: 'file://' + imageUri } : null} style={styles.previewImage} />
                            </TouchableOpacity>
                        </>
                    ) : null}

                    <TouchableOpacity style={styles.updateButton} onPress={handleOpenCamera}>
                        <Text style={styles.updateButtonText}>Take Photo</Text>
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
                                    setEditValue({ ...editValue, Area_Id: value.Area_Id })
                                    setIsFocus(false)
                                }}
                                labelField="Area_Name"
                            />
                        </>

                    )}

                    <Text style={styles.mobileLabel}>Retailer Address <Text style={{ color: "red" }}>*</Text></Text>
                    <TextInput
                        style={styles.input}
                        value={item.Reatailer_Address}
                        keyboardType='default'
                        placeholder='Reatailer Address'
                        onChangeText={(text) => handleInputChange('Reatailer_Address', text)}
                    />

                    <Text style={styles.label}>City <Text style={{ color: "red" }}>*</Text></Text>
                    <TextInput
                        style={styles.input}
                        value={item.Reatailer_City}
                        keyboardType='default'
                        placeholder='City'
                        onChangeText={(text) => handleInputChange('Reatailer_City', text)}
                    />

                    <Text style={styles.label}>PinCode <Text style={{ color: "red" }}>*</Text></Text>
                    <TextInput
                        style={styles.input}
                        value={item.PinCode}
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
                                    setEditValue({ ...editValue, State_Id: value.State_Id })
                                    setIsFocus(false)
                                }}
                                labelField="State_Name"
                            />
                        </>
                    )}

                    <Text style={styles.mobileLabel}>Mobile Number <Text style={{ color: "red" }}>*</Text></Text>
                    <TextInput
                        style={styles.input}
                        value={item.Mobile_No}
                        keyboardType='phone-pad'
                        placeholder='Mobile Number'
                        onChangeText={(text) => handleInputChange('Mobile_No', text)}
                    />

                    {distributors && (
                        <>
                            <Text style={styles.label}>Distributor <Text style={{ color: "red" }}>*</Text></Text>
                            <Dropdown
                                data={distributors}
                                value={value}
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                search
                                maxHeight={300}
                                placeholder={!isFocus ? "Select Distributor" : "..."}
                                searchPlaceholder="Search..."
                                onChange={(value) => {
                                    setEditValue({ ...editValue, Distributor_Id: value.Distributor_Id })
                                    setIsFocus(false)
                                }}
                                labelField="distributor_Name"
                            />
                        </>
                    )}

                    <TouchableOpacity style={styles.updateButton} onPress={handleSubmit}>
                        <Text style={styles.updateButtonText}>Update</Text>
                    </TouchableOpacity>


                </View>
            </ScrollView>
        </View>
    )
}

export default EditCustomer

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
    },
    headerText: {
        fontFamily: Fonts.plusJakartaSansMedium,
        fontSize: 15,
        color: Colors.white,
        marginLeft: 10
    },
    TopContainer: {
        padding: 20,
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
        color: Colors.text,
        fontFamily: Fonts.plusJakartaSansBold
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    mobileLabel: {
        fontSize: 14,
        marginBottom: 5,
        color: Colors.text,
        marginTop: 10,
        fontFamily: Fonts.plusJakartaSansBold
    },
    previewImage: {
        width: '100',
        height: 200,
        resizeMode: 'cover',
        borderRadius: 10,
        marginBottom: 20,
    },
    removeButton: {
        position: 'absolute',
        color: Colors.white,
        top: 378,
        right: 10,
        zIndex: 1,
    },
    updateButton: {
        backgroundColor: Colors.secondary,
        borderRadius: 5,
        alignItems: 'center',
        padding: 10,
        marginBottom: 10,
        marginTop: 10,
    },
    updateButtonText: {
        fontFamily: Fonts.plusJakartaSansBold,
        color: Colors.white,
        fontSize: 16,
    },
})