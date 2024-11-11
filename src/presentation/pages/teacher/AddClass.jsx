import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { Picker } from '@react-native-picker/picker'

const AddClass = () => {
    return (
        <View style={styles.container}>
            <View style={styles.inputBox}>
                <TextInput
                    style={styles.input}
                    placeholder='Mã lớp *'
                />
                <TextInput
                    style={styles.input}
                    placeholder='Mã lớp kèm *'
                />
                <TextInput
                    style={styles.input}
                    placeholder='Tên lớp *'
                />
                <TextInput
                    style={styles.input}
                    placeholder='Mã học phần *'
                />
                <TextInput
                    style={styles.input}
                    placeholder='Loại lớp *'
                />
                <View style={styles.picker}>
                    <Picker
                        style={styles.pickerItem}
                    >
                        <Picker.Item label="Bắt đầu" value="" />
                        <Picker.Item label="Sinh viên" value="student" />
                        <Picker.Item label="Giảng viên" value="lecture" />
                    </Picker>
                    <Picker
                        style={styles.pickerItem}
                    >
                        <Picker.Item label="Kết thúc" value="" />
                        <Picker.Item label="Sinh viên" value="student" />
                        <Picker.Item label="Giảng viên" value="lecture" />
                    </Picker>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder='Số lượng sinh viên tối đa'
                />
                <View>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {

                        }}>
                        <Text style={{
                            color: "white",
                            fontSize: 18,
                            fontStyle: 'italic',
                            fontWeight: 'bold',
                            alignSelf: 'center'
                        }}>Tạo lớp học</Text>
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
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'center',
        paddingTop: 20
    },
    inputBox: {
        padding: 20,
        gap: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#BB0000',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        color: 'white'
    },
    picker: {
        flexDirection: 'row',
        gap: 10,
        borderWidth: 1,
        borderColor: '#BB0000',
        borderRadius: 20,
        color: 'white'
    },
    pickerItem: {
        color: 'gray',
        fontSize: 13,
        flex: 1,
        borderWidth: 1,
        borderColor: '#BB0000',
        borderRadius: 20,
    },
    button: {
        backgroundColor: '#BB0000',
        paddingVertical: 10,
        borderRadius: 20
    }
})

export default AddClass