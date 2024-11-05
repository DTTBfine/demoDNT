import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useNavigation } from '@react-navigation/native';

const windowDimensions = Dimensions.get('window'); // Lấy kích thước của màn hình
const { width, height } = windowDimensions; // Đảm bảo rằng chúng ta truy cập đúng thuộc tính

const FuncBox = ({ iconName, name, infor, routeName }) => {
    const navigate = useNavigation()

    return (
        <View style={styles.container}>
            <View style={styles.iconBox}>
                <Icon name={iconName} size={50} color="#BB0000"
                    onPress={() => {
                        navigate.navigate(routeName)
                    }} />
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20, gap: 6 }}>
                <Text style={{ fontWeight: 'bold' }} > {name} </Text>
                <Text style={{ textAlign: 'center', fontWeight: '500', color: '#444444' }}> {infor} </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: width / 2,
        height: 200,
        alignItems: "center",
        gap: 4
    },
    iconBox: {
        borderWidth: 1,
        borderRadius: 15,
        padding: 20,
        borderColor: '#DDDDDD',
        backgroundColor: 'white'
    }
});

export default FuncBox