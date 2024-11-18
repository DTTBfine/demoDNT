import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { apiCreateClass } from '../../../data/api/class';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome'

const AddClass = () => {
    const [classId, setClassId] = useState('');
    const [subClassId, setSubClassId] = useState('');
    const [className, setClassName] = useState('');
    const [courseId, setCourseId] = useState('');
    const [classType, setClassType] = useState('');
    const [maxStudentAmount, setMaxStudentAmount] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [loading, setLoading] = useState(false);

    const { isLoggedIn, msg, update, token, role, userId } = useSelector(state => state.auth)

    const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, '0'); 
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
        const year = date.getFullYear(); 
        return `${day}/${month}/${year}`; 
    };

    const handleCreateClass = async () => {
        if (!classId || !className || !classType || !maxStudentAmount) {
            Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
            return;
        }

        try {
            setLoading(true);
            const payload = {
                token: token,
                class_id: classId,
                class_name: className,
                class_type: classType,
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                max_student_amount: parseInt(maxStudentAmount,10),
            };
            console.log('payload-create-class:',payload);
            const response = await apiCreateClass(payload);
            if (response.status === 200) {
                console.log(response.data.message)
                Alert.alert('Thành công', 'Tạo lớp học thành công!');
            } else {
                Alert.alert('Lỗi', response.data.message || 'Không thể tạo lớp học.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi', error.response?.data?.message || 'Không thể tạo lớp học.');
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

                <TextInput
                    style={styles.input}
                    placeholder="Số lượng sinh viên tối đa"
                    value={maxStudentAmount}
                    onChangeText={setMaxStudentAmount}
                    keyboardType="numeric"
                />

                <TouchableOpacity
                    style={[styles.button, loading && { backgroundColor: 'gray' }]}
                    onPress={handleCreateClass}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Đang xử lý...' : 'Tạo lớp học'}
                    </Text>
                </TouchableOpacity>
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
};

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

export default AddClass;