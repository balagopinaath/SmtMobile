import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator, LogBox } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, } from 'react-native-vision-camera';
import { useNavigation, useRoute } from '@react-navigation/native'
import Colors from '../Config/Colors';

const TakePhoto = ({ route }) => {
    const navigation = useNavigation();
    const { item } = route.params;

    const device = useCameraDevice('back');
    const camera = useRef(null);
    const { hasPermission, requestPermission } = useCameraPermission();

    const [photoPath, setPhotoPath] = useState();
    const [capturedPhotoPath, setCapturedPhotoPath] = useState(null);

    useEffect(() => {
        checkPermission();
    }, [hasPermission]);

    const checkPermission = async () => {
        requestPermission(true);
    };

    const takePhoto = async () => {
        try {
            const photo = await camera.current.takePhoto({
                qualityPrioritization: 'quality',
                enableAutoRedEyeReduction: true,
                flash: 'off',
                enableShutterSound: true
            });

            // console.log('photo', photo.path);
            setPhotoPath(photo.path)
            setCapturedPhotoPath(photo.path)

        } catch (err) {
            console.log(err)
        }
    };

    const savePhoto = () => {
        if (capturedPhotoPath) {
            navigation.push('EditCustomer', { imageUri: capturedPhotoPath, item: item });
        }
    };

    if (device == null) return (<ActivityIndicator />);

    LogBox.ignoreLogs([
        'Non-serializable values were found in the navigation state',
    ]);

    return (
        <View style={styles.container}>
            <Camera
                ref={camera}
                photo={true}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
            />
            {photoPath && (
                <>
                    <Image style={styles.image} source={{ uri: 'file://' + photoPath }} />
                    <TouchableOpacity style={styles.saveButton} onPress={savePhoto}>
                        <Text style={styles.captureButtonText}>Save Photo</Text>
                    </TouchableOpacity>
                </>
            )}

            <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
                <Text style={styles.captureButtonText}>Caputre Photo</Text>
            </TouchableOpacity>
        </View>
    );
}

export default TakePhoto

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    headerButton: {
        marginRight: 10,
    },
    previewImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    image: {
        position: 'absolute',
        top: 100,
        alignSelf: 'center',
        paddingTop: 8,
        width: "80%",
        height: "60%",
    },
    saveButton: {
        position: 'absolute',
        top: 600,
        alignSelf: 'center',
        backgroundColor: Colors.accent,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 30,
    },
    captureButton: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        backgroundColor: Colors.accent,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 30,
    },
    captureButtonText: {
        color: Colors.white,
        fontSize: 16,
    },
});