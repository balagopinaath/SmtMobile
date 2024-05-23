import { StyleSheet, Text, Dimensions, TouchableOpacity, useColorScheme } from 'react-native'
import React from 'react'
import { customColors, typography } from '../Config/helper'

const { width } = Dimensions.get('window')

const CustomRadioButton = ({ label, selected, onSelect }) => {
    const scheme = useColorScheme();
    const colors = customColors[scheme === 'dark' ? 'dark' : 'light'];

    return (
        <TouchableOpacity
            style={[styles(colors).radioButton,
            { backgroundColor: selected ? colors.accent : '#FFF' }]}
            onPress={onSelect}
        >
            <Text style={[styles(colors).radioButtonText,
            { color: selected ? '#FFF' : '#000' }]}>
                {label}
            </Text>
        </TouchableOpacity>
    )
}

export default CustomRadioButton

const styles = (colors) => StyleSheet.create({
    radioButton: {
        padding: 12,
        borderRadius: 10,
        marginHorizontal: 15,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#007BFF',
        alignItems: 'center',
        justifyContent: 'center',
        width: width * 0.4,
    },
    radioButtonText: {
        ...typography.h6(colors),
    },
})