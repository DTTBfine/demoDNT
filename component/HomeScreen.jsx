import React, { useRef, useEffect, useState } from 'react';
import { Animated, View, Text, Button, StyleSheet, Dimensions, TouchableOpacity, } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import FadeInView from './FadeInView';
import PulsatingIcon from './PulsatingIcon';

const windowDimensions = Dimensions.get('window'); // Lấy kích thước của màn hình
const { width, height } = windowDimensions; // Đảm bảo rằng chúng ta truy cập đúng thuộc tính

function HomeScreen({ navigation }) {
    const userInfo = null

    useEffect(() => {
        // Kiểm tra thông tin người dùng
        if (!userInfo) {
            navigation.navigate('Login'); // Điều hướng tới trang Login nếu không có thông tin người dùng
        }
    }, [userInfo, navigation]);

    const [visible, setVisible] = useState(false)

    return (
        <SafeAreaView style={styles.container}>
            <Text style={{
                fontSize: 24
            }}> Đây là trang Home </Text>
            {
                visible && <PulsatingIcon style={{
                    backgroundColor: 'transparent',
                    position: 'absolute',
                    width: 150,
                    height: 150,
                    top: height / 2 - 75, // canh giữa theo chiều dọc
                    left: width / 2 - 75, // canh giữa theo chiều ngang,
                }} />
            }
            <TouchableOpacity style={styles.button}
                onPress={() =>
                    setVisible(!visible)
                }
            >
                <Text style={styles.buttonText}>Click Me</Text>
            </TouchableOpacity>
            <Button
                title="Go to profile"
                onPress={() =>
                    navigation.navigate('Profile', { name: 'HTA' })
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        gap: 4
    },
    box: {
        width: 100,
        height: 100,
        backgroundColor: 'red',
    },
    button: {
        backgroundColor: 'red', // Màu nền của nút
        paddingVertical: 10, // Khoảng cách trên và dưới
        paddingHorizontal: 15, // Khoảng cách bên trái và bên phải
        borderRadius: 5, // Bo góc cho nút
    },
    buttonText: {
        color: '#ffffff', // Màu chữ
        fontSize: 18, // Kích thước chữ
        textAlign: 'center', // Căn giữa chữ
    },
});

export default HomeScreen;