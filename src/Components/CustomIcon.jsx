import { StyleSheet, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import React from 'react'

const CustomIcon = ({ name, size, color }) => {
    return (
        <View style={styles.container}>
            <Icon name={name} size={size} color={color} />
        </View>
    )
}

export default CustomIcon

const styles = StyleSheet.create({
    container: {}
})