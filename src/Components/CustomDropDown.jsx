import { StyleSheet, Text, View } from 'react-native'
import React, { Fragment } from 'react'
import { Dropdown } from 'react-native-element-dropdown';


const CustomDropDown = ({ label, data, value, onChangeText, labelField, placeholder, searchPlaceholder, search, maxHeight, ...otherProps }) => {
    return (
        <Fragment>
            <Text style={{ fontSize: 16, marginBottom: 5, color: 'black' }}>{label} <Text style={{ color: 'red' }}>*</Text></Text>

            <Dropdown
                data={data}
                value={value}
                onChangeText={onChangeText}
                labelField={labelField}
                placeholder={placeholder || 'Select Value'} // Set default placeholder
                searchPlaceholder={searchPlaceholder || 'Search...'} // Set default search placeholder
                search={search !== undefined ? search : true} // Handle optional search prop
                maxHeight={maxHeight || 300} // Set default max height
                {...otherProps} // Allow passing additional props
                style={{ margin: 5, height: 50, borderBottomColor: 'gray', borderBottomWidth: 0.5 }} // Default styles
            />
        </Fragment>
    )
}

export default CustomDropDown

const styles = StyleSheet.create({})