import { Modal, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import { customColors, typography } from '../Config/helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../Components/CustomButton';
import { API } from '../Config/Endpoint';

const ProfileScreen = () => {
    const scheme = useColorScheme();
    const colors = customColors[scheme === 'dark' ? 'dark' : 'light'];
    const [name, setName] = useState()
    const [branchName, setBranchName] = useState()
    const [userId, setUserId] = useState()

    const [modalVisible, setModalVisible] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const storedName = await AsyncStorage.getItem('Name');
                const storedBranchName = await AsyncStorage.getItem('branchName');
                const storedUserId = await AsyncStorage.getItem('UserId');
                if (storedName !== null) setName(storedName);
                if (storedBranchName !== null) setBranchName(storedBranchName)
                if (setUserId !== null) setUserId(storedUserId)
            } catch (err) {
                console.log(err);
            }
        })();
    }, [])

    const handleChangePassword = async () => {
        try {
            const response = await fetch(`${API.changePassword}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userId,
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('data', data)
                if (data.success) {
                    ToastAndroid.show(data.message, ToastAndroid.LONG);
                    setModalVisible(false);
                } else {
                    ToastAndroid.show(data.message, ToastAndroid.LONG);
                }
            } else {
                const data = await response.json();
                ToastAndroid.show('Failed to change password', + data.message, ToastAndroid.LONG);
            }
        } catch (err) {
            console.error(err);
            ToastAndroid.show('Failed to change password: ' + err.message, ToastAndroid.LONG);
        }
    }

    const handleDelete = async () => {
        try {
            const response = await fetch(`${API.delete}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            const data = await response.json();
            if (data.success) {
                ToastAndroid.show(data.message, ToastAndroid.LONG);
            }
        } catch (err) {
            console.error(err);
            ToastAndroid.show(err, ToastAndroid.LONG);
        }
    }

    return (
        <View style={styles(colors).container}>
            <View style={styles(colors).formGroup}>
                <Text style={styles(colors).label}>Name</Text>
                <TextInput
                    style={styles(colors).input}
                    value={name}
                    editable={false}
                />
            </View>

            <View style={styles(colors).formGroup}>
                <Text style={styles(colors).label}>Branch</Text>
                <TextInput
                    style={styles(colors).input}
                    value={branchName}
                    editable={false}
                />
            </View>

            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles(colors).button} >
                <Text style={styles(colors).buttonText}>Change Password</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={[styles(colors).button, { backgroundColor: colors.accent }]} >
                <Text style={styles(colors).buttonText}>Delete Account</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles(colors).modalOverlay}>
                    <View style={styles(colors).modalContainer}>
                        <Text style={styles(colors).modalTitle}>Change Password</Text>
                        <TextInput
                            style={styles(colors).modalInput}
                            placeholder="Old Password"
                            secureTextEntry={true}
                            value={oldPassword}
                            onChangeText={setOldPassword}
                        />
                        <TextInput
                            style={styles(colors).modalInput}
                            placeholder="New Password"
                            secureTextEntry={true}
                            value={newPassword}
                            onChangeText={setNewPassword}
                        />
                        <View style={styles(colors).modalButtonContainer}>
                            <TouchableOpacity onPress={handleChangePassword} style={styles(colors).modalButton}>
                                <Text style={styles(colors).modalButtonText}>Submit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles(colors).modalButton}>
                                <Text style={styles(colors).modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    )
}

export default ProfileScreen

const styles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: colors.background,
        justifyContent: 'center',
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        ...typography.h3(colors),
        color: customColors.text,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.white,
        borderRadius: 10,
        padding: 15,
        backgroundColor: colors.secondary,
        color: colors.text,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        ...typography.body1(colors),
    },
    button: {
        marginTop: 20,
        padding: 15,
        borderRadius: 10,
        backgroundColor: colors.primary,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        alignItems: 'center',
    },
    buttonText: {
        ...typography.button(colors),
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: colors.background,
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        ...typography.h5(colors),
        fontWeight: 'bold',
        marginBottom: 20,
        color: colors.text,
    },
    modalInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: colors.accent,
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        backgroundColor: colors.primary,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
    },
    modalButtonText: {
        ...typography.button(colors),
        color: colors.white,
    },
})