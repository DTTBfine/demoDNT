import { View, Text, StyleSheet, TextInput, Button, Image, TouchableOpacity, Dimensions, Keyboard } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import PulsatingIcon from '../components/PulsatingIcon';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../redux/actions';
import { validateEmail } from '../../utils/validate';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';

const windowDimensions = Dimensions.get('window');
const { width, height } = windowDimensions;

const LoginScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigation();
    const [fcm_token, setFcmToken] = useState(null);
    const [visible, setVisible] = useState(false);
    const [invalidFields, setInvalidFields] = useState([]);
    const { isLoggedIn, msg, update, token, role, userId } = useSelector(state => state.auth);
    const [payload, setPayload] = useState({
        email: '',
        password: '',
        fcm_token: '',  
    });
    const [focusField, setFocusField] = useState('');

    useEffect(() => {
        const getFcmToken = async () => {
            try {
                const token = await AsyncStorage.getItem('fcm_token');
                if (token) {
                    setFcmToken(token); 
                }
            } catch (error) {
                console.error('Error retrieving FCM token:', error);
            }
        };

        getFcmToken();
    }, []);

    useEffect(() => {
        if (fcm_token) {
            setPayload(prev => ({ ...prev, fcm_token })); 
        }
    }, [fcm_token]);

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(actions.getUserInfo({ token, userId }));
            dispatch(actions.getUnreadNotificationCount({ token }));
            dispatch(actions.getClassList({ token, role, account_id: userId }));
    
            // Điều hướng ngay và truyền tham số showCongrats
            if (role === 'STUDENT') navigate.navigate("student", { showCongrats: true });
            else navigate.navigate("teacher", { showCongrats: true });
        }
    }, [isLoggedIn]);
    

    useEffect(() => {
        if (msg === 'password is incorrect') {
            setInvalidFields(prev => [...prev, { name: 'password', message: msg }]);
        }
        if (msg === 'email not existed') {
            setInvalidFields(prev => [...prev, { name: 'email', message: msg }]);
        }
    }, [msg, update]);

    const handleSubmit = async () => {
        let invalids = validate(payload);
        if (invalids !== 0) {
            console.log(invalids);
            return;
        }
        console.log("payload login:", payload);
        dispatch(actions.login(payload));
        Keyboard.dismiss();
    };

    const validate = (payload) => {
        let invalids = 0;
        let fields = Object.entries(payload);

        fields.forEach(item => {
            if (item[1] === '') {
                setInvalidFields(prev => [...prev, { name: item[0], message: 'Không được bỏ trống !' }]);
                invalids++;
            }
        });

        fields.forEach(item => {
            switch (item[0]) {
                case 'password':
                    if (item[1].length < 6) {
                        setInvalidFields(prev => [...prev, { name: item[0], message: 'Mật khẩu phải có tối thiểu 6 ký tự !' }]);
                        invalids++;
                    }
                    break;
                case 'email':
                    if (!validateEmail(item[1])) {
                        setInvalidFields(prev => [...prev, { name: item[0], message: 'Email không hợp lệ !' }]);
                        invalids++;
                    }
                    break;
                default:
                    break;
            }
        });

        return invalids;
    };

    return (

        <View style={styles.container}>
            <View style={{
                position: 'absolute', // Đặt Lottie ở trên cùng
                top: 0,
                left: 0,
                right: 0,
                alignItems: 'center', // Căn giữa ngang
                zIndex: 10, // Đảm bảo nằm trên các phần khác
            }}>
                <LottieView
                    source={require('../../../assets/ChristmasReindeer.json')}
                    autoPlay
                    loop={false}
                    resizeMode="cover"
                    style={{
                        width: '100%',
                        height: 350,
                    }}
                />
                {/* <LottieView
                    source={require('../../../assets/Christmaslights.json')}
                    autoPlay
                    loop={true}
                    style={{
                        width: '100%',
                        height: 200,
                        marginTop:50
                    }}
                /> */}
            </View>
            <View style={{marginTop:300}}>
            <View style={styles.titleBox}>
                <Image resizeMode="cover" source={require('../../../assets/logoRed.png')} style={{ width: 237.5, height: 50 }} />
                <Text style={styles.title2}> Đăng nhập với tài khoản QLĐT</Text>
            </View>
            <View style={styles.inputBox}>
                <TextInput
                    style={[styles.input, { borderColor: focusField === 'email' ? '#aa0000' : '#CCCCCC' }]}
                    placeholder='Email hoặc mã số SV/CB'
                    placeholderTextColor="gray"
                    value={payload.email}
                    onChangeText={(text) => setPayload(prev => ({ ...prev, email: text }))}
                    onFocus={() => {
                        setFocusField('email');
                        setInvalidFields([]);
                    }}
                />
                {invalidFields.length > 0 && invalidFields.some(i => i.name === 'email') && (
                    <Text style={{ paddingHorizontal: 15, color: 'red', fontSize: 12 }}>
                        {invalidFields.find(i => i.name === 'email')?.message}
                    </Text>
                )}
                <TextInput
                    secureTextEntry={true}
                    style={[styles.input, { borderColor: focusField === 'password' ? '#aa0000' : '#CCCCCC' }]}
                    placeholder='Mật khẩu'
                    placeholderTextColor="gray"
                    value={payload.password}
                    onChangeText={(text) => setPayload(prev => ({ ...prev, password: text }))}
                    onFocus={() => {
                        setFocusField('password');
                        setInvalidFields([]);
                    }}
                />
                {invalidFields.length > 0 && invalidFields.some(i => i.name === 'password') && (
                    <Text style={{ paddingHorizontal: 15, color: 'red', fontSize: 12 }}>
                        {invalidFields.find(i => i.name === 'password')?.message}
                    </Text>
                )}

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <View style={{
                        position: 'absolute', // Đặt Lottie ở trên cùng
                        bottom: 15,
                        left: 220,
                        right: 0,
                        alignItems: 'center', // Căn giữa ngang
                        zIndex: 10, 
                    }}>
                        <LottieView
                            source={require('../../../assets/Main Scene.json')}
                            autoPlay
                            loop={false}
                            style={{
                                width: '100%',
                                height: 70,
                            }}
                        />
                    </View>
                    <Text style={{ color: "white", fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>ĐĂNG NHẬP</Text>
                </TouchableOpacity>
                <View style={styles.titleBox}>
                    <Text style={styles.title2} onPress={() => navigate.navigate("register")}>Bạn chưa có tài khoản? <Text style={{textDecorationLine:'underline', color:'#0745b2',fontWeight:'600'}}>Đăng ký</Text></Text>
                </View>
            </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        gap: 20,
        width:windowDimensions.width
    },
    titleBox: {
        alignItems: 'center',
        gap: 20
    },
    title1: {
        color: 'white',
        fontSize: 40,
        fontWeight: 'bold'
    },
    title2: {
        color: '#AA0000',
        fontSize: 16,
    },
    inputBox: {
        padding: 20,
        gap: 15,
    },
    input: {
        borderWidth: 1,
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    button: {
        backgroundColor: '#AA0000',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 40,
        marginTop:20
    }
});

export default LoginScreen;
