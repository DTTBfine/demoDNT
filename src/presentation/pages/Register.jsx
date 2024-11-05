import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity } from 'react-native'
import React from 'react'
import { Picker } from '@react-native-picker/picker'
import { useNavigation } from '@react-navigation/native'

const RegisterScreen = () => {
    const navigate = useNavigation()
    return (
        <View style={styles.container}>
            <View style={styles.titleBox}>
                <Text style={styles.title1}>HUST</Text>
                <Text style={styles.title2}> Welcome to AIIHust</Text>
            </View>
            <View style={styles.inputBox}>
                <TextInput
                    style={styles.input}
                    placeholder='Họ'
                    placeholderTextColor="white"
                />
                <TextInput
                    style={styles.input}
                    placeholder='Tên'
                    placeholderTextColor="white"
                />
                <TextInput
                    style={styles.input}
                    placeholder='Email'
                    placeholderTextColor="white"
                />
                <TextInput
                    style={styles.input}
                    placeholder='Password'
                    placeholderTextColor="white"
                />
                <View style={styles.picker}>
                    <Picker
                        style={styles.picker}
                    >
                        <Picker.Item label="Role" value="" />
                        <Picker.Item label="Sinh viên" value="student" />
                        <Picker.Item label="Giảng viên" value="lecture" />
                    </Picker>
                </View>
                <View>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {

                        }}>
                        <Text style={{ color: "#AA0000", fontSize: 20, fontWeight: 'bold', alignSelf: 'center', }}>SIGN UP</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.titleBox}>
                    <Text style={{ color: "white" }}> Đăng nhập với <Text style={{ textDecorationLine: 'underline' }}
                        onPress={() => {
                            navigate.navigate("login")
                        }}>Username/ Password</Text> </Text>
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