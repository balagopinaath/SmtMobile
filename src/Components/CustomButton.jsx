import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import { customColors, customFonts } from '../Config/helper'

const CustomButton = ({ children, onPress, activeStatus }) => {
    return (
        <View style={styles.container}>
            {activeStatus === 1 ? (
                <View style={[styles.buttonInterContainer, styles.disabled]}>
                    <Text style={[styles.buttonText, styles.disabledText]}>{children}</Text>
                </View>
            ) : (
                <Pressable
                    onPress={onPress}
                    style={({ pressed }) => pressed
                        ? [styles.buttonInterContainer, styles.pressed]
                        : styles.buttonInterContainer
                    }
                    android_ripple={{ color: customColors.accent }}>
                    <Text style={styles.buttonText}>{children}</Text>
                </Pressable>
            )}
        </View>
    )
}

export default CustomButton

const styles = StyleSheet.create({
    container: {
        borderRadius: 28,
        margin: 4,
        overflow: 'hidden'
    },
    buttonInterContainer: {
        backgroundColor: customColors.primary,
        paddingVertical: 8,
        paddingHorizontal: 16,
        elevation: 2,
    },
    buttonText: {
        fontSize: 14,
        fontFamily: customFonts.plusJakartaSansMedium,
        color: customColors.white,
        textAlign: 'center',
    },
    pressed: {
        opacity: 0.75,
    },
    disabled: {
        backgroundColor: '#CCCCCC', // You can define a color for disabled state
        opacity: 0.5, // You can adjust the opacity to visually indicate the disabled state

    },
    disabledText: {
        color: customColors.text
    },
})