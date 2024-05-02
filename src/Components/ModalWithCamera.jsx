import React, { useState } from 'react';
import { Modal, View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import CameraComponent from './CameraComponent';

const ModalWithCamera = ({ visible, onClose, onSubmit }) => {
    const [textInputValue, setTextInputValue] = useState('');
    const [capturedPhoto, setCapturedPhoto] = useState(null);

    const handleInputChange = (text) => {
        setTextInputValue(text);
    };

    const handlePhotoCapture = (photoPath) => {
        setCapturedPhoto(photoPath);
    };

    const handleSubmit = () => {
        onSubmit(textInputValue, capturedPhoto);
        setTextInputValue('');
        setCapturedPhoto(null);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.innerContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter something..."
                        value={textInputValue}
                        onChangeText={handleInputChange}
                    />
                    <View style={styles.cameraContainer}>
                        <CameraComponent onPhotoCapture={handlePhotoCapture} />
                    </View>
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default ModalWithCamera

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    innerContainer: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    input: {
        width: '100%',
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
    },
    cameraContainer: {
        width: '100%',
        aspectRatio: 1,
        marginBottom: 20,
    },
    submitButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
    },
})