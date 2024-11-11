import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Octicons'
import { useNavigation } from '@react-navigation/native'

const CustomHeader = () => {
    const navigate = useNavigation()

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