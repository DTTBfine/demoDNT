import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert,Modal } from 'react-native'
import React, { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import { apiEditClass,apiDeleteClass } from '../../../data/api/class';

const EditClass = ({ route }) => {
    const { isChoosed } = route.params
    const { token,role } = useSelector(state => state.auth)
    const { userInfo } = useSelector(state => state.user)

    const [showConfirmBox, setShowConfirmBox] = useState(false)

    const [classId, setClassId] = useState(isChoosed?.class_id);
    const [subClassId, setSubClassId] = useState('');
    const [className, setClassName] = useState(isChoosed?.class_name);
    const [courseId, setCourseId] = useState('');
    const [classType, setClassType] = useState(isChoosed?.class_type);
    const [startDate, setStartDate] = useState(new Date(isChoosed?.start_date));
    const [endDate, setEndDate] = useState(new Date(isChoosed?.end_date));
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [loading, setLoading] = useState(false);

    const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, '0'); 
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
        const year = date.getFullYear(); 
        return `${day}/${month}/${year}`; 
    };

    const handleEditClass = async () => {

        try {
            setLoading(true);
            const payload={
                token: token,
                class_id: classId,
                class_name: className,
                status: isChoosed?.status, 
                start_date: startDate.toISOString().split('T')[0],
                end_date: endDate.toISOString().split('T')[0]
            };
            console.log('payload-edit-class',payload);
            const response = await apiEditClass(payload);
            if (response.status === 200) {
                console.log(response.data.message)
                Alert.alert('Thành công', 'Chỉnh sửa lớp học thành công!');
            } else {
                Alert.alert('Lỗi', response.data.message || 'Không thể chỉnh sửa lớp học.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi', error.response?.data?.message || 'Không thể chỉnh sửa lớp học !');
        } finally {
            setLoading(false);
        }
    }
    const handleDeleteClass = async () => {

        try {
            setLoading(true);
            const payload={
                token: token,
                role:role,
                account_id: userInfo.id.toString(),
                class_id: classId,
            };
            console.log('payload-delete-class',payload);
            const response = await apiEditClass(payload);
            if (response.status === 200) {
                console.log(response.data.message)
                Alert.alert('Thành công', 'Xoá lớp học thành công!');
            } else {
                Alert.alert('Lỗi', response.data.message || 'Không thể xoá lớp học.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi', error.response?.data?.message || 'Không thể xoá lớp học !');
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.inputBox}>
                <TextInput
                    style={styles.input}
                    placeholder="Mã lớp *"
                    value={classId}
                    onChangeText={setClassId}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Mã lớp kèm *"
                    value={subClassId}
                    onChangeText={setSubClassId}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Tên lớp *"
                    value={className}
                    onChangeText={setClassName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Mã học phần *"
                    value={courseId}
                    onChangeText={setCourseId}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Loại lớp *"
                    value={classType}
                    onChangeText={setClassType}
                />

                {/* Ngày bắt đầu và kết thúc */}
                <View style={styles.dateRow}>
                    <TouchableOpacity
                        style={styles.dateInput}
                        onPress={() => setShowStartPicker(true)}
                    >
                        <View style={styles.row}>
                            <Text style={startDate ? styles.dateText : styles.placeholderText}>
                                {startDate ? formatDate(startDate) : 'Bắt đầu'}
                            </Text>
                            <Icon name="chevron-down" color="#AA0000" size={18} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.dateInput}
                        onPress={() => setShowEndPicker(true)}
                    >
                        <View style={styles.row}>
                            <Text style={endDate ? styles.dateText : styles.placeholderText}>
                                {endDate ? formatDate(endDate) : 'Kết thúc'}
                            </Text>
                            <Icon name="chevron-down" color="#AA0000" size={18} />
                        </View>
                    </TouchableOpacity>
                </View>

                {showStartPicker && (
                    <DateTimePicker
                        value={startDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, date) => {
                            setShowStartPicker(false);
                            if (date) setStartDate(date);
                        }}
                    />
                )}
                {showEndPicker && (
                    <DateTimePicker
                        value={endDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, date) => {
                            setShowEndPicker(false);
                            if (date) setEndDate(date);
                        }}
                    />
                )}
                <View style={styles.row}>
                    <TouchableOpacity
                        style={[styles.button, loading && { backgroundColor: 'gray' }]}
                        onPress={handleDeleteClass}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Đang xử lý...' : 'Xoá lớp này'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, loading && { backgroundColor: 'gray' }]}
                        onPress={handleEditClass}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Đang xử lý...' : 'Xác nhận'}
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

            </View>
        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'center',
        paddingTop: 20,
        backgroundColor: '#fff',
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
        fontSize: 16,
        color: 'black',
        backgroundColor: '#f9f9f9',
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    dateInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#BB0000',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#f9f9f9',
    },
    dateText: {
        fontSize: 16,
        color: 'black',
    },
    placeholderText: {
        fontSize: 16,
        color: 'gray',
    },
    button: {
        backgroundColor: '#BB0000',
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: 'center',
        minWidth:170,
        margin:5,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontStyle: 'italic',
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginEnd: 1
    },
});
export default EditClass