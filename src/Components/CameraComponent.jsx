import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, useColorScheme } from 'react-native'
import React, { useRef, useEffect } from 'react'
import { Camera, useCameraDevice, useCameraPermission, } from 'react-native-vision-camera'
import { customColors, typography } from '../Config/helper'

const CameraComponent = ({ onPhotoCapture, showCamera }) => {
    const scheme = useColorScheme();
    const colors = customColors[scheme === 'dark' ? 'dark' : 'light'];
    const device = useCameraDevice('back');
    const camera = useRef(null);
    const { hasPermission, requestPermission } = useCameraPermission();

    useEffect(() => {
        checkPermission();
    }, [hasPermission]);

    const checkPermission = async () => {
        const granted = await requestPermission(true);
        if (!granted) {
            console.log('Camera permission denied');
        }
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

            onPhotoCapture(photo.path);
        } catch (err) {
            console.log(err);
        }
    };

    if (!hasPermission || device == null) return (<ActivityIndicator />);

    return (
        <View style={[styles(colors).container, showCamera && styles(colors).fullScreen]}>
            <Camera
                ref={camera}
                photo={true}
                style={[styles(colors).cameraView, showCamera && styles(colors).fullScreen]}
                device={device}
                isActive={true}
            />
            <TouchableOpacity style={styles(colors).captureButton} onPress={takePhoto}>
                <Text style={styles(colors).captureButtonText}>Take Photo</Text>
            </TouchableOpacity>
        </View>
    )
}

export default CameraComponent

const styles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cameraView: {
        width: '90%',
        aspectRatio: 1,
    },
    fullScreen: {
        width: '100%',
        height: '100%',
    },
    captureButton: {
        backgroundColor: colors.accent,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 30,
        marginTop: 40,
    },
    captureButtonText: {
        ...typography.button(colors),
    },
})