import { Linking, StyleSheet, Text, TouchableOpacity, View, PermissionsAndroid, Alert, ToastAndroid, ScrollView, Image, useColorScheme, ActivityIndicator, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import Geolocation from '@react-native-community/geolocation'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { API } from '../../Config/Endpoint';
import { customColors, typography } from '../../Config/helper';
import Icon from 'react-native-vector-icons/AntDesign';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomersDetails = ({ route }) => {
    const navigation = useNavigation();
    const { item } = route.params;
    const scheme = useColorScheme();
    const colors = customColors[scheme === 'dark' ? 'dark' : 'light'];
    const latitude = item.Latitude;
    const longitude = item.Longitude;
    const phoneNumber = item.Mobile_No;
    const [userId, setUserId] = useState('');
    const [isImageModalVisible, setImageModalVisible] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const id = await AsyncStorage.getItem('UserId');
                setUserId(id);
            } catch (e) {
                console.log(e)
            }
        };

        fetchUserId();
    }, [])

    const handleCall = () => {
        if (phoneNumber) {
            Linking.openURL(`tel:${phoneNumber}`);
        } else {
            ToastAndroid.show('Phone number not available', ToastAndroid.LONG)
        }
    };

    const handleLocation = () => {
        if (latitude !== null && longitude !== null) {
            const url = `${API.google_map}${latitude},${longitude}${item.Retailer_Name}${item.Reatailer_Address}`
            Linking.openURL(url);
        } else {
            ToastAndroid.show('Location not available', ToastAndroid.LONG)
        }
    };

    const handleImagePress = (imageUrl) => {
        setCurrentImage(imageUrl);
        setImageModalVisible(true);
    };

    const handleUpdateLocation = () => {
        Alert.alert(
            'Add location confirmation!',
            'Are you sure you want to update the location?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: async () => {
                        try {
                            Geolocation.getCurrentPosition(
                                async (position) => {
                                    const { latitude, longitude } = position.coords;

                                    const response = await fetch(API.retailerLocation, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            EntryBy: userId,
                                            Latitude: latitude.toString(),
                                            Longitude: longitude.toString(),
                                            Retailer_Id: item.Retailer_Id
                                        })
                                    });

                                    if (!response.ok) {
                                        throw new Error('Failed to update location');
                                    }

                                    const data = await response.json();
                                    if (data.status === 'Success') {
                                        Alert.alert(data.message);
                                        ToastAndroid.show('Geolocation Data is Updated', ToastAndroid.LONG);
                                        console.log('Successfully updated location');
                                    } else {
                                        Alert.alert(data.message);
                                    }
                                },
                                error => {
                                    console.error('Error getting location:', error);
                                    Alert.alert('Error', 'Failed to get current location. Please try again later.');
                                },
                                { enableHighAccuracy: true, timeout: 30000, maximumAge: 10000 }
                            );
                        } catch (error) {
                            console.error('Error updating location:', error);
                            Alert.alert('Error', 'Failed to update location. Please try again later.');
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    };

    return (
        <ScrollView style={styles(colors).container}>
            <View style={styles(colors).card}>
                <View style={styles(colors).imageContainer}>
                    <TouchableOpacity style={{
                        width: "100%",
                        height: 175,
                    }} onPress={() => handleImagePress(item.imageUrl)}>
                        <Image
                            style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: 8,
                                resizeMode: 'cover'
                            }}
                            source={{ uri: 'https://images.unsplash.com/photo-1717457779557-44f53661aa15' }}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles(colors).retailersContainer}>
                    <View style={styles(colors).retailersInto}>
                        <IconEntypo name="shop" size={22} color={colors.primary} />
                        <Text maxFontSizeMultiplier={1.2} style={styles(colors).retailerText}>{item.Retailer_Name}</Text>
                    </View>

                    <View style={styles(colors).retailersInto}>
                        <IconEntypo name="home" size={22} color={colors.primary} />
                        <Text maxFontSizeMultiplier={1.2} style={styles(colors).retailerText}>{`${item.Reatailer_Address}, ${item.Reatailer_City}, ${item.StateGet} - ${item.PinCode}`}</Text>
                    </View>

                    <View style={styles(colors).retailersInto}>
                        <IconEntypo name="user" size={22} color={colors.primary} />
                        <Text maxFontSizeMultiplier={1.2} style={styles(colors).retailerText}>
                            {item.Contact_Person ? item.Contact_Person : 'N/A'}
                        </Text>
                    </View>

                    <View style={styles(colors).retailersInto}>
                        <IconMaterial name="brightness-percent" size={22} color={colors.primary} />
                        <Text maxFontSizeMultiplier={1.2} style={styles(colors).retailerText}>
                            {`GST: ${item.Gstno ? item.Gstno : 'N/A'}`}
                        </Text>
                    </View>

                    <View style={styles(colors).retailersInto}>
                        <IconEntypo name="phone" size={22} color={colors.primary} />
                        <TouchableOpacity onPressOut={handleCall}>
                            <Text maxFontSizeMultiplier={1.2} style={[styles(colors).retailerText, {
                                color: 'blue',
                                textDecorationLine: 'underline',
                            }]}>
                                {item.Mobile_No ? item.Mobile_No : 'N/A'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={styles(colors).buttonContainer}>
                <TouchableOpacity style={styles(colors).button} onPress={() => { navigation.navigate('StockClosing', { item }) }} >
                    <Image
                        style={styles(colors).tinyLogo}
                        source={require('../../../assets/images/packages.png')}
                    />
                    <Text maxFontSizeMultiplier={1.2} style={styles(colors).buttonText}>Closing Stock</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles(colors).button} onPress={() => {
                    Linking.openURL(`${API.whatsApp}${item.Mobile_No}/?text=Hi`)
                }} >
                    <Image
                        style={styles(colors).tinyLogo}
                        source={require('../../../assets/images/whatsapp.png')}
                    />
                    <Text maxFontSizeMultiplier={1.2} style={styles(colors).buttonText}>WhatsApp</Text>
                </TouchableOpacity>

                {latitude !== null && longitude !== null && (
                    <TouchableOpacity style={styles(colors).button} onPress={handleLocation}>
                        <Image
                            style={styles(colors).tinyLogo}
                            source={require('../../../assets/images/map.png')}
                        />
                        <Text maxFontSizeMultiplier={1.2} style={styles(colors).buttonText}>Maps</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity style={styles(colors).button} onPress={() => handleUpdateLocation()}>
                    <Image
                        style={styles(colors).tinyLogo}
                        source={require('../../../assets/images/pin.png')}
                    />
                    <Text maxFontSizeMultiplier={1.2} style={styles(colors).buttonText}>Add Location</Text>
                </TouchableOpacity>

            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isImageModalVisible}
                onRequestClose={() => setImageModalVisible(false)}
            >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
                    <TouchableOpacity onPress={() => setImageModalVisible(false)} style={{ position: 'absolute', top: 40, right: 20 }}>
                        <Icon name="close" size={30} color="#fff" />
                    </TouchableOpacity>
                    <Image
                        source={{ uri: currentImage }}
                        style={{ width: '90%', height: '80%', resizeMode: 'contain' }}
                    />
                </View>
            </Modal>

        </ScrollView>
    )
}

export default CustomersDetails

const styles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.background,
    },
    card: {
        // flexDirection: 'row',
        backgroundColor: colors.background === "#000000" ? colors.black : colors.white,
        borderRadius: 10,
        marginVertical: 25,
        marginHorizontal: 15,
        elevation: 3,
        overflow: 'hidden',
    },
    imageContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    retailersContainer: {
        width: '100%',
        paddingHorizontal: 25,
        paddingVertical: 15,
    },
    retailersInto: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    retailerText: {
        ...typography.h6(colors),
        marginLeft: 15,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 20,
        marginHorizontal: 15,
    },
    button: {
        width: '30%',
        alignItems: 'center',
        paddingVertical: 15,
        marginBottom: 20,
    },
    buttonText: {
        ...typography.body1(colors),
        textAlign: 'center',
        fontWeight: '700',
        marginTop: 10,
    },
    tinyLogo: {
        width: 50,
        height: 50,
    }
});