import { StyleSheet, Text, View, Pressable, useColorScheme } from 'react-native'
import React from 'react'
import { customColors, typography } from '../Config/helper'

const CustomButton = ({ children, onPress }) => {
    const scheme = useColorScheme();
    const colors = customColors[scheme === 'dark' ? 'dark' : 'light'];

    return (
        <View style={styles(colors).container}>
            <Pressable
                onPress={onPress}
                style={({ pressed }) => pressed
                    ? [styles(colors).buttonInterContainer, styles(colors).pressed]
                    : styles(colors).buttonInterContainer
                }
                android_ripple={{ color: colors.accent }}>
                <Text maxFontSizeMultiplier={1.2} style={styles(colors).buttonText}>{children}</Text>
            </Pressable>
        </View>
    )
}

export default CustomButton

const styles = (colors) => StyleSheet.create({
    container: {
        borderRadius: 28,
        margin: 4,
        overflow: 'hidden'
    },
    buttonInterContainer: {
        backgroundColor: colors.accent,
        paddingVertical: 8,
        paddingHorizontal: 20,
        elevation: 2,
    },
    buttonText: {
        ...typography.button(colors),
        // color: colors.white,
        fontWeight: '500',
        textAlign: 'center',
    },
    pressed: {
        opacity: 0.75,
    }
})