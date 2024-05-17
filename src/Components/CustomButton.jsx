import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import { customColors, customFonts } from '../Config/helper'

const CustomButton = ({ children, onPress }) => {
    return (
        <View style={styles.container}>
            <Pressable
                onPress={onPress}
                style={({ pressed }) => pressed
                    ? [styles.buttonInterContainer, styles.pressed]
                    : styles.buttonInterContainer
                }
                android_ripple={{ color: customColors.accent }}>
                <Text style={styles.buttonText}>{children}</Text>
            </Pressable>
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
        backgroundColor: customColors.accent,
        paddingVertical: 8,
        paddingHorizontal: 20,
        elevation: 2,
    },
    buttonText: {
        fontFamily: customFonts.plusJakartaSansMedium,
        color: customColors.white,
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },
    pressed: {
        opacity: 0.75,
    }
})