import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/AntDesign';
import Colors from '../Config/Colors';
import Fonts from '../Config/Fonts';
import ModalWithCamera from '../Components/ModalWithCamera';

const HomeScreen = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('')
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const userName = await AsyncStorage.getItem('Name');
                setName(userName)
            } catch (err) {
                console.log(err);
            }
        })();
    }, []);

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('UserId');
            await AsyncStorage.removeItem('userName');
            await AsyncStorage.removeItem('Name');
            await AsyncStorage.removeItem('UserType');
            await AsyncStorage.removeItem('branchId');
            await AsyncStorage.removeItem('branchName');
            await AsyncStorage.removeItem('userType');
            await AsyncStorage.removeItem('userTypeId');
            navigation.replace("LoginScreen");
        } catch (e) {
            console.error('Error clearing AsyncStorage:', e);
        }
    };

    const openModal = () => {
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Colors.primary} />
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Welcome, {name}!</Text>
                <TouchableOpacity onPress={logout}>
                    <Icon name="logout" color={Colors.white} size={20} />
                </TouchableOpacity>
            </View>

            <View style={styles.ContainerAction}>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.actionButton} onPress={() => { navigation.push('Customers') }}>
                        <Icon name="exclamationcircleo" color={Colors.white} size={25} />
                        <Text style={styles.actionButtonText}>Retailers</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton} onPress={() => { navigation.push('AddCustomer') }}>
                        <Icon name="plus" color={Colors.white} size={25} />
                        <Text style={styles.actionButtonText}>Add</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.row}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Icon name="edit" color={Colors.white} size={23} />
                        <Text style={styles.actionButtonText}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <Icon name="shoppingcart" color={Colors.white} size={25} />
                        <Text style={styles.actionButtonText}>Sales</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.row}>
                    <TouchableOpacity style={styles.actionButton} onPress={() => { navigation.push('Attendance') }} >
                        <Icon name="enviromento" color={Colors.white} size={25} />
                        <Text style={styles.actionButtonText}>Register</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <Icon name="team" color={Colors.white} size={25} />
                        <Text style={styles.actionButtonText}>Delivery</Text>
                    </TouchableOpacity>
                </View>
            </View>


            <TouchableOpacity style={styles.floatingButton} onPressOut={openModal}>
                {/* <Icon name="close" color={Colors.white} size={25} /> */}
                <Text style={styles.floatingButtonText}>End Day</Text>
            </TouchableOpacity>
            <ModalWithCamera
                isVisible={isModalVisible}
                onClose={closeModal}
                onSubmit={closeModal}
            />

        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: Colors.primary,
    },
    headerText: {
        fontFamily: Fonts.plusJakartaSansBold,
        fontSize: 18,
        color: Colors.white
    },
    ContainerAction: {
        marginHorizontal: 25,
        marginVertical: 25
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    actionButton: {
        width: '40%',
        flexDirection: 'row',
        backgroundColor: Colors.accent,
        borderRadius: 10,
        padding: 15,
        marginBottom: 25,
    },
    actionButtonText: {
        fontFamily: Fonts.plusJakartaSansMedium,
        fontSize: 16,
        color: Colors.white,
        marginLeft: 10,
    },
    floatingButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 30,
    },
    floatingButtonText: {
        fontFamily: Fonts.plusJakartaSansMedium,
        fontSize: 16,
        color: Colors.white,
        marginLeft: 13,
        marginTop: 5,
    }
});