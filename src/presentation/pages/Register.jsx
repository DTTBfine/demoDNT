import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity } from 'react-native'
import React from 'react'
import { Picker } from '@react-native-picker/picker'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import axios from '../../../axiosConfig'
import { useRef } from 'react'
import uuid from 'react-native-uuid'
// import DeviceInfo from 'react-native-device-info'
import DropdownAlert, {
    DropdownAlertData,
    DropdownAlertType,
} from 'react-native-dropdownalert';

const signUpEndpoint = '/it4788/signup';
const checkVerifyCodeEndpoint = '/it4788/check_verify_code';

const checkVerifyCode = async (email, code) => {
    try {
        const response = await axios.post(checkVerifyCodeEndpoint, {
            email: email,
            verify_code: code
        });
        return response.data.code === 1000
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const signUp = async (payload) => {
    try {
        const response = await axios.post(signUpEndpoint, {
            "ho": payload.ho,
            "ten": payload.ten,
            "email": payload.email,
            "password": payload.password,
            "role": payload.role,
            "uuid": uuid.v4()
        });
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const RegisterScreen = () => {
    const navigate = useNavigation();
    const [invalidFields, setInvalidFields] = useState([]);
    const dropdownAlertRef = useRef(null);
    const [payload, setPayload] = useState({
        'ho': '',
        'ten': '',
        'email': '',
        'password': '',
        'role': ''
    });

    const [focusField, setFocusField] = useState('')

    const handleRoleChange = (value) => {
        setPayload((prevPayload) => ({
            ...prevPayload,
            'role': value
        }));
    };

    const validateHustEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@hust\.edu\.vn$/;
        return regex.test(email);
    }

    const validate = (payload) => {
        let invalids = 0 //đếm số trường không hợp lệ
        let fields = Object.entries(payload) //hàm chuyển 1 object thành mảng

        const pattern = /^\d{10}$/;

        fields.forEach(item => {
            if (item[1] === '') {
                setInvalidFields(prev => [...prev, {
                    name: item[0],
                    message: 'Không được bỏ trống !'
                }])
                invalids++
            }
        })
        fields.forEach(item => {
            switch (item[0]) {
                case 'password':
                    if (item[1].length < 6) {
                        setInvalidFields(prev => [...prev, {
                            name: item[0],
                            message: 'Mật khẩu phải có tối thiểu 6 ký tự !'
                        }])
                        invalids++
                    }
                    break
                case 'email':
                    if (!validateHustEmail(item[1])) {
                        setInvalidFields(prev => [...prev, {
                            name: item[0],
                            message: 'Email không đúng định dạng @hust.edu.vn !'
                        }])
                        invalids++
                    }
                    break
                default:
                    break
            }
        })

        return invalids
    }

    const handleSubmit = async () => {
        let invalids = validate(payload)
        if (invalids !== 0) {
            console.log(invalids);
            return;
        }
        console.log(payload)
        try {
            const response = await signUp(payload);
            console.log(response.data);
            // const data = JSON.parse(response.data);
            if (response.data.status_code !== 1000) {
                console.error("register failed: " + response.data.message)

                dropdownAlertRef.current.alertWithType(
                    DropdownAlertType.Error,
                    'Register Failed',
                    data.message
                );
                return;
            }
            console.log("register successfully");
            const isAuthenticated = await checkVerifyCode(payload.email, response.data.verify_code);
            if (!isAuthenticated) {
                console.log("verify account failed");
                return;
            }
            navigate.replace('login');
        } catch (error) {
            console.error(error);
            throw error;
        }

    }
    return (
        <View style={styles.container}>
            <View style={styles.titleBox}>
                <Text style={styles.title1}>HUST</Text>
                <Text style={styles.title2}> Welcome to AIIHust</Text>
            </View>
            <View style={styles.inputBox}>
                <View style={{
                    flexDirection: "row",
                    gap: 10
                }}>
                    <View style={{ flex: 1 }}>
                        <TextInput
                            style={[styles.input, { borderColor: focusField === 'ho' ? '#00CCFF' : '#CCCCCC' }]}
                            placeholder='Họ'
                            placeholderTextColor="white"
                            value={payload.ho}
                            onChangeText={(text) => setPayload(prev => ({ ...prev, 'ho': text }))}
                            onFocus={() => {
                                setFocusField('ho')
                                setInvalidFields([])
                            }}
                        />
                        {invalidFields.length > 0 && invalidFields.some(i => i.name === 'ho') && <Text style={{
                            paddingHorizontal: 15,
                            fontStyle: 'italic',
                            color: 'red',
                            fontSize: 12
                        }}> {invalidFields.find(i => i.name === 'ho')?.message}
                        </Text>}
                    </View>
                    <View style={{ flex: 1 }}>
                        <TextInput
                            style={[styles.input, { borderColor: focusField === 'ten' ? '#00CCFF' : '#CCCCCC' }]}
                            placeholder='Tên'
                            placeholderTextColor="white"
                            value={payload.ten}
                            onChangeText={(text) => setPayload(prev => ({ ...prev, 'ten': text }))}
                            onFocus={() => {
                                setFocusField('ten')
                                setInvalidFields([])
                            }}
                        />
                        {invalidFields.length > 0 && invalidFields.some(i => i.name === 'ten') && <Text style={{
                            paddingHorizontal: 15,
                            fontStyle: 'italic',
                            color: 'red',
                            fontSize: 12
                        }}> {invalidFields.find(i => i.name === 'ten')?.message}
                        </Text>}
                    </View>
                </View>
                <TextInput
                    style={[styles.input, { borderColor: focusField === 'email' ? '#00CCFF' : '#CCCCCC' }]}
                    placeholder='Email'
                    placeholderTextColor="white"
                    value={payload.email}
                    onChangeText={(text) => setPayload(prev => ({ ...prev, 'email': text }))}
                    onFocus={() => {
                        setFocusField('email')
                        setInvalidFields([])
                    }}
                />
                {invalidFields.length > 0 && invalidFields.some(i => i.name === 'email') && <Text style={{
                    paddingHorizontal: 15,
                    fontStyle: 'italic',
                    color: 'red',
                    fontSize: 12
                }}> {invalidFields.find(i => i.name === 'email')?.message}
                </Text>}
                <TextInput
                    style={[styles.input, { borderColor: focusField === 'password' ? '#00CCFF' : '#CCCCCC' }]}
                    placeholder='Password'
                    placeholderTextColor="white"
                    value={payload.password}
                    onChangeText={(text) => setPayload(prev => ({ ...prev, 'password': text }))}
                    onFocus={() => {
                        setFocusField('password')
                        setInvalidFields([])
                    }}
                />
                {invalidFields.length > 0 && invalidFields.some(i => i.name === 'password') && <Text style={{
                    paddingHorizontal: 15,
                    fontStyle: 'italic',
                    color: 'red',
                    fontSize: 12
                }}> {invalidFields.find(i => i.name === 'password')?.message}
                </Text>}
                <View style={[styles.picker, { borderColor: focusField === 'role' ? '#00CCFF' : '#CCCCCC' }]}>
                    <Picker
                        style={styles.picker}
                        onValueChange={handleRoleChange}
                        onFocus={() => {
                            setFocusField('role')
                            setInvalidFields([])
                        }}
                    >
                        <Picker.Item label="Role" value="" />
                        <Picker.Item label="Sinh viên" value="STUDENT" />
                        <Picker.Item label="Giảng viên" value="LECTURE" />
                    </Picker>
                </View>
                {invalidFields.length > 0 && invalidFields.some(i => i.name === 'role') && <Text style={{
                    paddingHorizontal: 15,
                    fontStyle: 'italic',
                    color: 'red',
                    fontSize: 12
                }}> {invalidFields.find(i => i.name === 'role')?.message}
                </Text>}
                <View>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={async () => {
                            await handleSubmit();
                        }}>
                        <Text style={{ color: "#AA0000", fontSize: 20, fontWeight: 'bold', alignSelf: 'center', }} onPress={handleSubmit}>
                            SIGN UP
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.titleBox}>
                    <Text style={{ color: "white" }}> Đăng nhập với <Text style={{ textDecorationLine: 'underline' }}
                        onPress={() => {
                            navigate.navigate("login")
                        }}>Username/ Password</Text> </Text>
                </View>
            </View>

            {/* <DropdownAlert ref={dropdownAlertRef} /> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#AA0000',
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        padding: 20,
        gap: 30
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
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold'
    },
    inputBox: {
        padding: 20,
        gap: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        color: 'white'
    },
    picker: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 20,
        color: 'white'
    },
    button: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 40,
    }
})
export default RegisterScreen

//todo: verify input data before requesting to server