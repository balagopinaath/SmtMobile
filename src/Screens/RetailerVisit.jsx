import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { API } from '../Config/Endpoint';
import Icon from 'react-native-vector-icons/FontAwesome';
import { customColors, customFonts } from '../Config/helper';
import { Dropdown } from 'react-native-element-dropdown';
import CustomRadioButton from '../Components/CustomRadioButton';
import LocationIndicator from '../Components/LocationIndicator';

const RetailerVisit = () => {
    const [retailerData, setRetailerData] = useState([])
    const [selectedRetail, setSelectedRetail] = useState(null);
    const [selectedValue, setSelectedValue] = useState('exist');

    useEffect(() => {
        fetchCustomersData()
    }, [])

    const fetchCustomersData = async () => {
        try {
            const response = await fetch(`${API.retailerName}${1}`);
            if (!response.ok) {
                throw new Error(`API request failed with status: ${response.status}`);
            }
            const jsonData = await response.json();
            setRetailerData(jsonData.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Icon name="angle-left" color={customColors.white} size={20} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Log Info</Text>
            </View>

            <LocationIndicator />

            <View style={styles.radioView}>
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
                <View>
                    <Dropdown
                        data={retailerData}
                        labelField="Retailer_Name"
                        valueField="Retailer_Id"
                        placeholder="Select Retailer"
                        value={selectedRetail}
                        onChange={item => {
                            setSelectedRetail(item);
                        }}
                        maxHeight={300}
                        search
                        searchPlaceholder="Search Retailer"
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                    />

                    <TextInput
                        style={styles.textArea}
                        multiline={true}
                        numberOfLines={4}
                        placeholder='Enter a narration'
                        value='hi'
                        onChangeText={(text) => this.setState({ text })}
                    />

                    <TouchableOpacity onPress={() => doLoginStuff()}
                        style={styles.button}
                    ><Text style={styles.buttonText}>Submit</Text></TouchableOpacity>

                </View>
            }

            {selectedValue === 'new' &&
                <View>
                    <TextInput
                        style={styles.inputBox}
                        // value={formValues.Gstno}
                        keyboardType='default'
                        autoCapitalize='characters'
                        placeholder='Retailer Name'
                    // onChangeText={(text) => handleInputChange('Gstno', text)}
                    />

                    <TextInput
                        style={styles.inputBox}
                        // value={formValues.Gstno}
                        keyboardType='default'
                        autoCapitalize='characters'
                        placeholder='Contact Person'
                    // onChangeText={(text) => handleInputChange('Gstno', text)}
                    />

                    <TextInput
                        style={styles.inputBox}
                        // value={formValues.Gstno}
                        keyboardType='default'
                        autoCapitalize='characters'
                        placeholder='Mobile Number'
                    // onChangeText={(text) => handleInputChange('Gstno', text)}
                    />
                    <TextInput
                        style={styles.textArea}
                        multiline={true}
                        numberOfLines={4}
                        placeholder='Enter a narration'
                        value='hi'
                        onChangeText={(text) => this.setState({ text })}
                    />
                    <TouchableOpacity onPress={() => doLoginStuff()}
                        style={styles.button}
                    ><Text style={styles.buttonText}>Submit</Text></TouchableOpacity>
                </View>
            }

        </View>
    )
}

export default RetailerVisit

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
        fontFamily: customFonts.plusJakartaSansBold,
        color: customColors.white,
        fontSize: 15,
        fontWeight: '500',
        textAlign: 'center',
        marginLeft: 15
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
        borderWidth: 0.5,
    },
    placeholderStyle: {
        fontFamily: customFonts.plusJakartaSansBold,
        fontSize: 15,
        fontWeight: '500'
    },
    selectedTextStyle: {
        fontFamily: customFonts.plusJakartaSansMedium,
        fontSize: 15,
        fontWeight: '600'
    },
    inputSearchStyle: {
        fontFamily: customFonts.plusJakartaSansMedium,
        fontSize: 14,
        fontWeight: '400'
    },
    textArea: {
        borderWidth: 0.5,
        marginHorizontal: 20,
        borderRadius: 15,
        padding: 10,
        fontFamily: customFonts.plusJakartaSansMedium,
        fontSize: 14,
        fontWeight: '400'
    },
    button: {
        width: 150,
        height: 50,
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: customColors.primary,
        color: customColors.white,
        borderRadius: 10,
        marginTop: 30
    },
    buttonText: {
        textAlign: 'center',
        fontFamily: customFonts.plusJakartaSansBold,
        fontSize: 14,
        fontWeight: '400',
        color: customColors.white
    },

    inputBox: {
        borderWidth: 1,
        marginHorizontal: 20,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
})