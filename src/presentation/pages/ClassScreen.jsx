import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useNavigation } from '@react-navigation/native'

const ClassScreen = () => {
    const navigate = useNavigation()

    return (
        <View style={styles.container}>
            <View style={{
                borderWidth: 1,
                padding: 10,
                borderRadius: 15,
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
                <Text onPress={() => {
                    navigate.navigate('ClassRegister')
                }}>Đăng ký lớp học</Text>
            </View>
            <View style={{
                borderWidth: 1,
                padding: 10,
                borderRadius: 15,
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
                <Text onPress={() => {
                    navigate.navigate('ClassManage')
                }}>Quản lý lớp học</Text>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        padding: 20,
        gap: 10
    },

})

export default ClassScreen