import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Octicons'
import { useNavigation } from '@react-navigation/native'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import * as apis from '../../data/api'


const CustomHeader = () => {
    const navigate = useNavigation()
    const { token } = useSelector(state => state.auth)
    const [unreadNotificationCount, setUnreadNotificationCount] = useState(0) 
    const payload = { token: token }

    useEffect(() => {
        const fetchUnreadNotifications = async () => {
            try {
                const response = await apis.apiGetUnreadNotificationCount(payload)
                setUnreadNotificationCount(response.data.data) 
            } catch (error) {
                console.error('Lỗi khi lấy số lượng thông báo chưa đọc:', error)
            }
        }
    
        fetchUnreadNotifications();
    
        const intervalId = setInterval(() => {
            fetchUnreadNotifications();
        }, 10000); 
    
        return () => clearInterval(intervalId);
    }, [token])
    

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}> AIIHust </Text>
            </View>
            <Image
                source={require('../../../assets/logo-hust.png')}
                style={{
                    width: 30,
                    position: 'absolute',
                    top: -65,
                    left: 20
                }}
                resizeMode="contain"
            />
            <Icon name='bell-fill' size={20} color="white"
                style={{
                    position: "absolute",
                    right: 20,
                    top: 45
                }}
                onPress={() => {
                    navigate.navigate("notification")
                    
                }}
            />
            <View style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: 'red',
                position: 'absolute',
                top: 37,
                right: 10,
                justifyContent: 'center'
            }}>
                <Text style={{ color: 'white', fontWeight: '400', fontSize: 12, textAlign: 'center' }}>{unreadNotificationCount}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 110
    },
    header: {
        backgroundColor: "#BB0000",
        height: 80,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 10
    },
    title: {
        color: 'white',
        fontSize: 24,
        fontWeight: '600'
    }
})

export default CustomHeader