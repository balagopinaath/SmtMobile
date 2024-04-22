import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { Camera, useCameraDevice, useCameraPermission, } from 'react-native-vision-camera'
import Colors from '../Config/Colors'

const CameraComponent = ({ onPhotoCapture }) => {
    const device = useCameraDevice('back');
    const camera = useRef(null);
    const { hasPermission, requestPermission } = useCameraPermission();

    useEffect(() => {
        checkPermission();
    }, [hasPermission]);

    const checkPermission = async () => {
        requestPermission(true);
    };

    const takePhoto = async () => {
        try {
            const photo = await camera.current.takePhoto({
                qualityPrioritization: 'balanced',
                enableAutoRedEyeReduction: true,
                enableAutoStabilization: true,
                flash: 'off',
                enableShutterSound: true
            });

            onPhotoCapture(photo.path); // Callback to handle captured photo path
        } catch (err) {
            console.log(err);
        }
    };

    if (device == null) return (<ActivityIndicator />);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
                <Text style={styles.captureButtonText}>Take Photo</Text>
            </TouchableOpacity>
            <Camera
                ref={camera}
                photo={true}
                style={[StyleSheet.absoluteFillObject, styles.cameraView]}
                device={device}
                isActive={true}
            />
        </View>
    )
}

export default CameraComponent

const styles = StyleSheet.create({
    container: {
        flex: 2,
        marginBottom: 180,
    },
    cameraView: {
        width: "55%",
        height: "400%",
        left: 160,
    },
    captureButton: {
        alignSelf: 'flex-start',
        position: 'relative',
        top: 160,
        backgroundColor: Colors.accent,
        borderRadius: 5,
        justifyContent: 'center',
        paddingVertical: 15,
        paddingHorizontal: 30,
    },
    captureButtonText: {
        color: Colors.white,
        fontSize: 16,
    },
})