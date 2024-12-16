import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { apiEditClass, apiDeleteClass } from '../../../data/api/class';

const EditClass = ({ route }) => {
    const { isChoosed } = route.params;
    const { token, role } = useSelector((state) => state.auth);
    const { userInfo } = useSelector((state) => state.user);

    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [showEditConfirmModal, setShowEditConfirmModal] = useState(false);

    const [classId, setClassId] = useState(isChoosed?.class_id || '');
    const [subClassId, setSubClassId] = useState('');
    const [className, setClassName] = useState(isChoosed?.class_name || '');
    const [courseId, setCourseId] = useState('');
    const [classType, setClassType] = useState(isChoosed?.class_type || '');
    const [startDate, setStartDate] = useState(new Date(isChoosed?.start_date));
    const [endDate, setEndDate] = useState(new Date(isChoosed?.end_date));
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [loadingEdit, setLoadingEdit] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [errors, setErrors] = useState({});

    const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const validateFields = () => {
        const newErrors = {};

        if (!classId) {
            newErrors.classId = '❗️Mã lớp không được rỗng.';
        } else if (!/^[0-9]{6}$/.test(classId)) {
            newErrors.classId = '❗️Mã lớp phải gồm 6 ký tự.';
        }
        if (!className) newErrors.className = '❗️Tên lớp không được rỗng.';
        if (!classType){
            newErrors.classType = '❗️Loại lớp không được rỗng.';
        }
        else if(classType!=='LT'&&classType!=='BT'&&classType!=='LT_BT'){
            newErrors.classType = '❗️Loại lớp không phù hợp (LT, BT, LT_BT).';
        }
        if (!startDate) newErrors.startDate = '❗️';
        if (!endDate) newErrors.endDate = '❗️';
        if (startDate && endDate && startDate >= endDate) {
            newErrors.dateRange = 'Ngày bắt đầu phải trước ngày kết thúc.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleEditClass = async () => {
        if (!validateFields()) {
            setShowEditConfirmModal(false);
            return;
        }

        try {
            setShowEditConfirmModal(false);
            setLoadingEdit(true);
            const payload = {
                token,
                class_id: classId,
                class_name: className,
                status: isChoosed?.status,
                start_date: startDate.toISOString().split('T')[0],
                end_date: endDate.toISOString().split('T')[0],
            };
            console.log('payload-edit-class', payload);
            const response = await apiEditClass(payload);
            if (response.status === 200) {
                Alert.alert('Thành công', 'Chỉnh sửa lớp học thành công!');
            } else {
                Alert.alert('Lỗi', response.data.message || 'Không thể chỉnh sửa lớp học.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi', error.response?.data?.message || 'Không thể chỉnh sửa lớp học!');
        } finally {
            setLoadingEdit(false);
        }
    };

    const handleDeleteClass = async () => {
        try {
            setShowDeleteConfirmModal(false);
            setLoadingDelete(true);
            const payload = {
                token,
                role,
                account_id: userInfo.id.toString(),
                class_id: classId,
            };
            console.log('payload-delete-class', payload);
            const response = await apiDeleteClass(payload);
            if (response.status === 200) {
                Alert.alert('Thành công', 'Xoá lớp học thành công!');
            } else {
                Alert.alert('Lỗi', response.data.message || 'Không thể xoá lớp học.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi', error.response?.data?.message || 'Không thể xoá lớp học!');
        } finally {
            setLoadingDelete(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputBox}>
                <TextInput
                    style={styles.input}
                    placeholder="Mã lớp *"
                    value={classId}
                    onChangeText={setClassId}
                />
                {errors.classId && <Text style={styles.errorText}>{errors.classId}</Text>}
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
                {errors.className && <Text style={styles.errorText}>{errors.className}</Text>}
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
                {errors.classType && <Text style={styles.errorText}>{errors.classType}</Text>}
                <View style={styles.dateRow}>
                    <TouchableOpacity
                        style={styles.dateInput}
                        onPress={() => setShowStartPicker(true)}
                    >
                        <View style={styles.row}>
                            <Text style={styles.dateText}>
                            {startDate ? formatDate(startDate) : (errors?.startDate ? `${errors.startDate} Bắt đầu` : 'Bắt đầu')}
                            </Text>
                            <Icon name="chevron-down" color="#AA0000" size={18} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.dateInput}
                        onPress={() => setShowEndPicker(true)}
                    >
                        <View style={styles.row}>
                            <Text style={styles.dateText}>
                            {endDate ? formatDate(endDate) : (errors?.endDate ? `${errors.endDate} Kết thúc` : 'Kết thúc')}
                            </Text>
                            <Icon name="chevron-down" color="#AA0000" size={18} />
                        </View>
                    </TouchableOpacity>
                </View>
                {errors.dateRange && <Text style={styles.errorText}>{errors.dateRange}</Text>}
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
                <Modal
                    visible={showEditConfirmModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowEditConfirmModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>
                                Bạn chắc chắn muốn chỉnh sửa lớp này?
                            </Text>
                            <View style={styles.row}>
                                <TouchableOpacity
                                    style={styles.modalbutton}
                                    onPress={() => setShowEditConfirmModal(false)}
                                >
                                    <Text style={styles.buttonText}>Huỷ</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.modalbutton}
                                    onPress={handleEditClass}
                                >
                                    <Text style={styles.buttonText}>Xác nhận</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal
                    visible={showDeleteConfirmModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowDeleteConfirmModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>
                                Bạn chắc chắn muốn xoá lớp này?
                            </Text>
                            <View style={styles.row}>
                                <TouchableOpacity
                                    style={styles.modalbutton}
                                    onPress={() => setShowDeleteConfirmModal(false)}
                                >
                                    <Text style={styles.buttonText}>Huỷ</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.modalbutton}
                                    onPress={handleDeleteClass}
                                >
                                    <Text style={styles.buttonText}>Xác nhận</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <View style={styles.row}>
                    <TouchableOpacity
                        style={[styles.button, loadingDelete && { backgroundColor: 'gray' }]}
                        onPress={() => setShowDeleteConfirmModal(true)}
                        disabled={loadingDelete}
                    >
                        <Text style={styles.buttonText}>
                            {loadingDelete ? 'Đang xử lý...' : 'Xoá lớp này'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, loadingEdit && { backgroundColor: 'gray' }]}
                        onPress={() => setShowEditConfirmModal(true)}
                        disabled={loadingEdit}
                    >
                        <Text style={styles.buttonText}>
                            {loadingEdit ? 'Đang xử lý...' : 'Xác nhận'}
                        </Text>
                    </TouchableOpacity>
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
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalText: {
        marginBottom: 20,
        fontSize: 16,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#AA0000',
        width:170,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginHorizontal:5,
        marginVertical:20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        textAlign: 'center',
    },
    modalbutton:{
        backgroundColor: '#AA0000',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginHorizontal:10,
        width:110,
    },
    errorText :{
        fontSize: 14,
        color: 'red',
        marginTop: -10,
        marginStart:10
    }
});

export default EditClass;
