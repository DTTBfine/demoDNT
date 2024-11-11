import { View, Text, ScrollView, TextInput, StyleSheet, Button, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const ClassManage = () => {
    const navigate = useNavigation()

    return (
        <ScrollView style={styles.container}>
            <View style={{
                flexDirection: 'row',
                gap: 10,
                marginBottom: 15
            }}>
                <TextInput
                    style={{
                        flex: 7,
                        borderWidth: 1,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderColor: '#CC0000'
                    }}
                    placeholder='Mã lớp'
                    placeholderTextColor="gray"
                />
                <TouchableOpacity
                    style={{
                        flex: 5,
                        backgroundColor: "#BB0000",
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 15
                    }}
                    onPress={() => {

                    }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontStyle: 'italic', fontSize: 16 }}> Tìm kiếm</Text>
                </TouchableOpacity>
            </View>

            <View style={{
                borderWidth: 1,
                borderColor: '#BB0000',
                height: 300
            }}>
                <Text>Mã lớp - Mã lớp kèm - Tên lớp</Text>
                <Text>Cái này chắc là bảng các lớp của giảng viên, giảng viên không nhìn rõ nên chế ra nút tìm kiếm tìm cho dễ</Text>
            </View>

            <View style={{
                flexDirection: 'row',
                gap: 5,
                marginVertical: 10
            }}>
                <TouchableOpacity
                    style={{
                        flex: 5,
                        backgroundColor: "#BB0000",
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 15,
                        paddingVertical: 10
                    }}
                    onPress={() => {

                    }}>
                    <Text style={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontStyle: 'italic',
                        fontSize: 16
                    }}
                        onPress={() => {
                            navigate.navigate('AddClass')
                        }}
                    >
                        Tạo lớp học
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        flex: 5,
                        backgroundColor: "#BB0000",
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 15,
                        paddingVertical: 10
                    }}
                    onPress={() => {

                    }}>
                    <Text style={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontStyle: 'italic',
                        fontSize: 16
                    }}>
                        Chỉnh sửa
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={{
                marginTop: 20
            }}>
                <Text style={{
                    color: '#BB0000',
                    textDecorationLine: 'underline',
                    fontStyle: 'italic',
                    fontWeight: 'bold',
                    textAlign: 'center'
                }}>Thông tin danh sách các lớp mở</Text>
            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    }
})

export default ClassManage