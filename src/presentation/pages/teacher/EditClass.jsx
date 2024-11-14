import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal } from 'react-native'
import React, { useState } from 'react'
import { Picker } from '@react-native-picker/picker'
import { useSelector } from 'react-redux'

const EditClass = ({ route }) => {
    const { isChoosed } = route.params
    const { token } = useSelector(state => state.auth)

    const [showConfirmBox, setShowConfirmBox] = useState(false)

    const [payload, setPayLoad] = useState({
        token: token,
        class_id: isChoosed?.class_id,
        class_name: isChoosed?.class_name,
        status: isChoosed?.status, //ACTIVE, COMPLETED, UPCOMING
        start_date: isChoosed?.start_date,
        end_date: isChoosed?.end_date
    })
    return (
        <View style={styles.container}>
            {showConfirmBox && <Modal
                animationType="fade" // Kiểu hiệu ứng chuyển động (slide, fade, none)
                transparent={true} // Cho phép modal hiển thị bán trong suốt
                visible={showConfirmBox}
                onRequestClose={() => setShowConfirmBox(false)} // Đóng modal khi bấm nút back trên Android
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text>Bạn xác nhận xóa/chỉnh sửa lớp?</Text>
                        <Text>Làm gì đó để phân biệt modal 2 nút đi</Text>
                        <View style={{ flexDirection: 'row', gap: 20, paddingHorizontal: 15, paddingVertical: 10 }}>
                            <TouchableOpacity
                                style={[styles.closeButton, { flex: 1 }]}
                                onPress={() => setShowConfirmBox(false)}
                            >
                                <Text style={styles.closeButtonText}>HỦY</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.closeButton, { flex: 1 }]}
                                onPress={() => setShowConfirmBox(false)}
                            >
                                <Text style={styles.closeButtonText}>XÁC NHẬN</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>}
            <View style={styles.inputBox}>
                <Text style={styles.input} >{isChoosed?.class_id} </Text>
                <TextInput
                    style={styles.input}
                    placeholder='Mã lớp kèm *'
                    value={isChoosed?.attached_code}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Tên lớp *'
                    value={isChoosed?.class_name}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Mã học phần (cái này cũng không thấy) *'
                />
                <TextInput
                    style={styles.input}
                    placeholder='Loại lớp *'
                    value={isChoosed?.class_type}
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
                    value='Ủa cái này không thấy'
                />
                <View style={{
                    flexDirection: 'row',
                    padding: 10,
                    gap: 10,
                }}>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                setShowConfirmBox(true)
                            }}>
                            <Text style={{
                                color: "white",
                                fontSize: 18,
                                fontStyle: 'italic',
                                fontWeight: 'bold',
                                alignSelf: 'center'
                            }}>Xóa lớp này</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                setShowConfirmBox(true)
                            }}>
                            <Text style={{
                                color: "white",
                                fontSize: 18,
                                fontStyle: 'italic',
                                fontWeight: 'bold',
                                alignSelf: 'center'
                            }}>Xác nhận</Text>
                        </TouchableOpacity>
                    </View>
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
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // Màu nền bán trong suốt
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#AA0000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 5, // Bóng đổ cho Android
    },
    closeButton: {
        marginTop: 15,
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#AA0000',
        borderRadius: 15,
    },
    closeButtonText: {
        color: 'white',
        textAlign: 'center'
    },
})

export default EditClass