import { View, Text, SafeAreaView, TouchableOpacity, PermissionsAndroid, Image, Linking, Alert, StyleSheet, Animated, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import Endpoint from '../Config/Endpoint'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import Geolocation from '@react-native-community/geolocation'
import Colors from '../Config/Colors'
import CustomIcon from '../Components/CustomIcon'

function formatDate(inputDate) {
    const date = new Date(inputDate);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
}

function formatTime(inputTime) {
    const [hours, minutes, seconds] = inputTime.split(':');
    const dateObj = new Date(2000, 0, 1, hours, minutes, seconds);
    const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    return formattedTime;
}

const Dashboard = () => {
    const [uName, setUname] = useState('')
    const [uRole, setURole] = useState('');
    const [uType, setUType] = useState('');
    const [token, setToken] = useState('');
    const [uId, setUId] = useState('');
    const [branch, setBranch] = useState('');
    const [SessionId, setSessionId] = useState('');
    const [loginInfo, setLoginInfo] = useState({});
    const [attendance, setAttanance] = useState([])
    const [dialog, setDialog] = useState(false)

    const [taskApp, setTaskApp] = useState(false)
    const [isEmp, setIsEmp] = useState(false)
    const [isCustomer, setIsCustomer] = useState(false)
    const [summary, setSummary] = useState('');
    const [refresh, setRefresh] = useState(false);
    const [userInfo, setUserInfo] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(
        {
            'latitude': '',
            'longitude': ''
        }
    )
    const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
    const [watchId, setWatchId] = useState(false);
    const [locationEnabled, setLocationEnabled] = useState(false);
    const [fetchButton, setFetchButton] = useState(true);
    const navigate = useNavigation();

    useEffect(() => {
        fetchUserData();
        fetchPageRights();
        fetchAttendance();
        fetchCustomer();

        const checkPermission = async () => {
            const granted = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            )
            setLocationPermissionGranted(granted)
            return granted
        }

        const checkLocationStatus = () => {
            Geolocation.getCurrentPosition(
                (position) => {
                    setLocationEnabled(true);
                },
                (error) => {
                    setLocationEnabled(false);
                }
            );
        };

        const getLocationPermission = async () => {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'ERP App Location Permission',
                        message: 'ERP App needs access to your location',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    // console.log('Location permission granted');
                    setLocationPermissionGranted(true);
                    startWatchingPosition()
                } else {
                    console.log('Location permission denied');
                    Alert.alert('Location Permission', 'Location permission denied. App cannot function properly without it.');
                }
            } catch (err) {
                console.warn(err);
            }
        };

        const startWatchingPosition = () => {
            const id = Geolocation.watchPosition(
                newPosition => {
                    const { latitude, longitude } = newPosition.coords;
                    setCurrentLocation({ latitude, longitude });
                    // console.log('New position:', latitude, longitude);
                },
                error => {
                    console.error('Error getting location:', error);
                },
                { enableHighAccuracy: true, distanceFilter: 2 } // Update interval in meters
            );
            setWatchId(id);
        };

        const stopWatchingPosition = () => {
            if (watchId) {
                Geolocation.clearWatch(watchId);
            }
        };

        let timerId
        let intervalId

        if (isEmp && locationPermissionGranted) {
            // Check permission and status when the component mounts
            checkPermission().then(granted => {
                if (granted) {
                    checkLocationStatus()
                    postGeolocationData()
                } else {
                    getLocationPermission();
                }

                // Timer to post geolocation data every 1 minutes
                timerId = setInterval(() => {
                    postGeolocationData();
                }, 1 * 60 * 1000); // 2 minutes interval

                // Check location status periodically
                intervalId = setInterval(() => {
                    checkLocationStatus();
                }, 1000); // Check every 5 seconds

            }).catch(err => {
                console.log(err)
            })
        } else {
            getLocationPermission();
        }

        return () => {
            clearInterval(intervalId);
            stopWatchingPosition()
            clearInterval(timerId);
        };
    }, [refresh, isEmp, locationPermissionGranted])

    const fetchUserData = async () => {
        try {
            const uname = await AsyncStorage.getItem('Name');
            const role = await AsyncStorage.getItem('UserType');
            const token = await AsyncStorage.getItem('userToken');
            const id = await AsyncStorage.getItem('UserId');
            const loginResponse = await AsyncStorage.getItem('loginResponse')
            const branch = await AsyncStorage.getItem('branchId')
            const uType = await AsyncStorage.getItem('uType')
            const parsed = JSON.parse(loginResponse)
            const user = await AsyncStorage.getItem('user')
            setSessionId(parsed.SessionId)
            setUname(uname);
            setURole(role);
            setToken(token);
            setUId(id);
            setLoginInfo(loginResponse);
            setBranch(branch);
            setUType(uType);
            setUserInfo(user)
        } catch (e) {
            console.log(e)
        }
    };

    const fetchPageRights = async () => {
        fetch(`${Endpoint}/api/pagerights?menuid=${13}&menutype=${2}&user=${await AsyncStorage.getItem('UserId')}`, {
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': await AsyncStorage.getItem('userToken'),
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setTaskApp(data?.data[0]?.Add_Rights === 1)
            })
    };

    const fetchAttendance = async () => {
        fetch(`${Endpoint}/api/attendance?id=${await AsyncStorage.getItem('UserId')}`, { headers: { 'Authorization': await AsyncStorage.getItem('userToken') } })
            .then(res => { return res.json() })
            .then(data => {
                // console.warn('attendance', data.message)
                setAttanance(data.status === 'Success' ? data.data : [])
                setIsEmp(!(data.message === 'Not An Employee'))
            })
    }

    const fetchCustomer = async () => {
        fetch(`${Endpoint}/api/isCustomer?UserId=${await AsyncStorage.getItem('UserId')}`, {
            headers: { 'Authorization': await AsyncStorage.getItem('userToken') }
        }).then(res => res.json())
            .then(data => {
                if (data?.IsCustomer === true) {
                    setIsCustomer(true)
                }
            }).catch(e => console.log(e))
    }

    const StartDay = async () => {
        const { latitude, longitude } = currentLocation;
        if (latitude && longitude) {
            fetch(`${apiAddress}/api/attendance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
                body: JSON.stringify({
                    UserId: uId,
                    Latitude: latitude,
                    Longitude: longitude,
                    Creater: 'Employee',
                }),
            })
                .then(response => response.json())
                .then(data => {
                    setRefresh(!refresh);
                    if (data.status === 'Success') {
                        Alert.alert(data.message);
                    } else {
                        Alert.alert(data.message);
                    }
                })
                .catch(error => {
                    console.error('Error posting geolocation data:', error);
                    // Handle error appropriately
                })
        } else {
            Alert.alert('Bad Network issue, Please try again later.');
        }
    };

    const postGeolocationData = () => {
        if (currentLocation.latitude && currentLocation.longitude) {
            const formattedLatitude = currentLocation.latitude.toString();
            const formattedLongitude = currentLocation.longitude.toString();

            fetch('https://apiweb.erpsmt.in/location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Emp_Id: uId,
                    Latitude: formattedLatitude,
                    Logitude: formattedLongitude,
                    Web_URL: `https://www.google.com/maps/search/?api=1&query=${formattedLatitude},${formattedLongitude}`
                })
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Geolocation data posted successfully:', data);
                    // You can handle the response here if needed
                })
                .catch(error => {
                    console.error('Error posting geolocation data:', error);
                    // Handle the error here
                });
        } else {
            // console.log('Latitude or longitude not available for posting geolocation data');
            // Handle the case when latitude or longitude is not available
        }
    };

    const logout = async () => {
        try {
            const session = JSON.parse(await AsyncStorage.getItem('loginResponse'));
            const userId = await AsyncStorage.getItem('UserId');
            const token = await AsyncStorage.getItem('userToken');
            console.log(`User= ${userId}, Token= ${token}, Session= ${{ ...session }}`);

            if (!userId || !session || !token) {
                console.warn('Missing required data for logout. User may already be logged out.');
                return;
            }

            const response = await fetch(`${Endpoint}/api/logout?userid=${userId}&sessionId=${session.SessionId}`, {
                method: 'PUT',
                headers: { 'Authorization': token }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.status === 'Success') {
                    AsyncStorage.clear();
                    navigation.replace("StartScreen")
                } else {
                    console.error('Logout failed:', data.message);
                }
            } else {
                console.error('Failed to logout:', response.statusText);
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };




    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Colors.primary} />
            <View style={styles.headerContainer}>
                {/* <CustomIcon name="account-circle" size={32} color={Colors.white} /> */}
                <View>
                    <Text style={styles.headerText}>Welcome, {uName}!</Text>
                    <Text style={styles.subtitleText}>{uRole}</Text>
                </View>
                <TouchableOpacity onPress={logout}>
                    <CustomIcon styles={styles.logoutButton} name="logout" color={Colors.white} size={20} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Dashboard

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: Colors.primary,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.white
    },
    subtitleText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.white
    },
    logoutButton: {
        backgroundColor: 'transparent', // Remove default button background
        padding: 0, // Remove default button padding
    },
});