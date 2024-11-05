import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const LoginScreen = () => {
    const navigation = useNavigation()
    return (
        <View style={styles.container}>
            <View style={styles.titleBox}>
                <Text style={styles.title1}>HUST</Text>
                <Text style={styles.title2}> Đăng nhập với tài khoản QLĐT</Text>
            </View>
            <View style={styles.inputBox}>
                <TextInput
                    style={styles.input}
                    placeholder='Email hoặc mã số SV/CB'
                    placeholderTextColor="#CCCCCC"
                />
                <TextInput
                    style={styles.input}
                    placeholder='Mật khẩu'
                    placeholderTextColor="#CCCCCC"
                />
                <View>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            navigation.replace("inapp")
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
        borderColor: '#CCCCCC',
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