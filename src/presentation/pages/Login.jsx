import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import PulsatingIcon from '../components/PulsatingIcon';
import { authEndpoints } from '../../utils/constants/endpoints';
import { responseCodes } from '../../utils/constants/responseCodes';
import { saveValue } from '../../utils/localStorage';
import { loginRequest } from '../../data/api/auth';
import { validateEmail } from '../../utils/validate';

const windowDimensions = Dimensions.get('window'); // Lấy kích thước của màn hình
const { width, height } = windowDimensions; // Đảm bảo rằng chúng ta truy cập đúng thuộc tính



const LoginScreen = () => {
    const [visible, setVisible] = useState(false)
    const [invalidFields, setInvalidFields] = useState([]) //mảng chứa những trường không hợp lệ
    const [payload, setPayload] = useState({
        email: '',
        password: ''
    })
    const [focusField, setFocusField] = useState('')

    const handleSubmit = async () => {
        //console.log(payload)
        let invalids = validate(payload)
        if (invalids !== 0) {
            console.log(invalids);
            return;
        }
        //setVisible(true);
        const response = await loginRequest(payload);
        const statusCode = response.data.status_code;
        if (!statusCode) {
            console.error("failed to login with status code: " + response.status);
            return;
        }
        //handle check data
        //lấy tạm cái này thử đã
        setTimeout(() => {

            if (statusCode === responseCodes.statusOK) {
                const data = response.data.data

                //save user token and id
                saveValue("token", data.token);
                saveValue("userId", String(data.id));

                if (data.role === 'STUDENT') {
                    navigation.replace('student');
                } else {
                    navigation.replace('teacher');
                }

            }
            // if (statusCode === responseCodes.userNotValidated) {
            //     setInvalidFields(prev => [...prev, {
            //         name: 'password',
            //         message: response.data.message
            //     }])
            //     invalids++
            // }
            else {
                console.error("failed to login: " + response.data.message)
            }
        }, 2000)
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
                    if (!validateEmail(item[1])) {
                        setInvalidFields(prev => [...prev, {
                            name: item[0],
                            message: 'Email không hợp lệ !'
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

    const navigation = useNavigation()
    return (
        <View style={styles.container}>
            {
                visible && <PulsatingIcon style={{
                    backgroundColor: 'transparent',
                    position: 'absolute',
                    width: 150,
                    height: 150,
                    top: height / 2 - 75, // canh giữa theo chiều dọc
                    left: width / 2 - 75, // canh giữa theo chiều ngang,
                    zIndex: 100
                }} />
            }
            <View style={styles.titleBox}>
                <Text style={styles.title1}>HUST</Text>
                <Text style={styles.title2}> Đăng nhập với tài khoản QLĐT</Text>
            </View>
            <View style={styles.inputBox}>
                <TextInput
                    style={[styles.input, { borderColor: focusField === 'email' ? '#00CCFF' : '#CCCCCC' }]}
                    placeholder='Email hoặc mã số SV/CB'
                    placeholderTextColor="#CCCCCC"
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
                    secureTextEntry={true}
                    style={[styles.input, { borderColor: focusField === 'password' ? '#00CCFF' : '#CCCCCC' }]}
                    placeholder='Mật khẩu'
                    placeholderTextColor="#CCCCCC"
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
                <View>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={async () => {
                            await handleSubmit();
                        }}>
                        <Text style={{ color: "#AA0000", fontSize: 20, fontWeight: 'bold', alignSelf: 'center', }}>ĐĂNG NHẬP</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.titleBox}>
                    <Text style={styles.title2}
                        onPress={() => {
                            navigation.navigate("register")
                        }}>Register</Text>
                </View>
            </View>
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
        gap: 20
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
export default LoginScreen