import { View, Text, TextInput, StyleSheet, TouchableOpacity, Keyboard, Alert } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as DocumentPicker from 'expo-document-picker';
import Icon from 'react-native-vector-icons/FontAwesome'
import DateTimePicker from '@react-native-community/datetimepicker';
import * as apis from '../../../data/api'
import * as actions from '../../redux/actions'
import { responseCodes } from '../../../utils/constants/responseCodes';
import Spinner from 'react-native-loading-spinner-overlay';

const defaultInvalidFields = {
    title: '',
    description: '',
    file: '',
    date: ''
}

const AddSurvey = ({ route }) => {
    const dispatch = useDispatch()
    const { class_id } = route.params
    const { token } = useSelector(state => state.auth)
    const [isLoading, setIsLoading] = useState(false)

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const [invalidFields, setInvalidFields] = useState(defaultInvalidFields)
    const [payload, setPayload] = useState({
        file: null,
        token: token,
        classId: class_id,
        title: '',
        deadline: {}, //định dạng: 2024-12-11T14:30:00
        description: ''
    })

    useEffect(() => {
        if (startDate) {
            //2 weeks from startDate
            let defaultDeadline = new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000)
            console.log("default deadline: " + defaultDeadline.toISOString())
            setEndDate(defaultDeadline)
            setPayload(prev => ({ ...prev, 'deadline': defaultDeadline.toISOString().split('.')[0] }))
        }
    }, [startDate])

    // console.log("payload: " + JSON.stringify(payload))


    const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    const [focusField, setFocusField] = useState('')


    const resetInput = () => {
        setStartDate(null)
        setEndDate(null)
        setPayload({
            file: null,
            token: token,
            classId: class_id,
            title: '',
            deadline: '', //định dạng: 2024-12-11T14:30:00
            description: ''
        })
        Keyboard.dismiss()
    }

    const validateInput = () => {
        return payload.title && endDate && payload.description && payload.file
    }

    const validateInputWithSet = () => {
        setInvalidFields(defaultInvalidFields)
        let check = true

        if (!payload.title) {
            setInvalidFields(prev => ({
                ...prev,
                title: "Tiêu đề không được bỏ trống"
            }))
            check = false
        }

        if (!payload.file) {
            setInvalidFields(prev => ({
                ...prev,
                file: "Tài liệu không được bỏ trống"
            }))
            check = false
        }

        if (!payload.description) {
            setInvalidFields(prev => ({
                ...prev,
                description: "Mô tả không được bỏ trống"
            }))
            check = false
        }

        if (!endDate) {
            setInvalidFields(prev => ({
                ...prev,
                date: "Ngày kết thúc không được bỏ trống"
            }))
            check = false
        } else {
            const start = new Date(startDate)
            const end = new Date(endDate)
            if (end < start) {
                setInvalidFields(prev => ({
                    ...prev,
                    date: "Ngày kết thúc không được phép trước ngày bắt đầu"
                }))
                check = false
            }
        }
        return check
    }

    const handleDocumentSelection = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*', // Allows all file types
                copyToCacheDirectory: true,
            });

            // Kiểm tra nếu người dùng hủy chọn file
            if (result.canceled) {
                console.log('User canceled document selection.');
                return; // Không tiếp tục nếu bị hủy
            }

            console.log('result ' + JSON.stringify(result))
            if (result?.assets?.length > 0) {
                const {mimeType, uri, name} = result.assets[0]
                setPayload(prev => ({ ...prev, 'file': {
                    type: mimeType,
                    uri: uri,
                    name: name
                }}))
            }
        } catch (err) {
            console.error('Error picking document:', err);
        }
    }

    const handleSubmit = async () => {
        if (!validateInputWithSet()) return;

        setIsLoading(true)
        const response = await apis.apiCreateSurvey(payload)
        setIsLoading(false)
        if (response.data?.meta?.code !== responseCodes.statusOK) {
            console.log("error adding survey: " + JSON.stringify(response?.data))
            Alert.alert("Error", "Tạo bài kiểm tra không thành công")
        } else {
            Alert.alert("Success", response.data?.meta?.message || "Tạo bài kiểm tra thành công")
            dispatch(actions.getAllSurveys({
                token: token,
                class_id: class_id
            }))
        }

        resetInput()
    }

    return (
        <View style={styles.container}>
            <Spinner
                visible={isLoading}
                textContent={'Chờ xử lý...'}
                textStyle={{
                    color: '#FFF'
                }}
            />
            <View style={{
                gap: 15,
                padding: 10,
                marginTop: 20
            }}>
                <TextInput
                    style={[styles.input, { borderColor: focusField === 'title' ? '#00CCFF' : '#AA0000' }]}
                    placeholder='Tên bài kiểm tra *'
                    placeholderTextColor="#888"
                    value={payload.title}
                    onChangeText={(text) => setPayload(prev => ({ ...prev, 'title': text }))}
                    onFocus={() => {
                        setFocusField('title')
                    }}
                />
                {invalidFields?.title && <Text style={{
                    paddingHorizontal: 15,
                    fontStyle: 'italic',
                    color: 'red',
                    fontSize: 12
                }}> {invalidFields.title}
                </Text>}
                <TextInput
                    style={[styles.textArea, { borderColor: focusField === 'description' ? '#00CCFF' : '#AA0000' }]}
                    placeholder="Mô tả"
                    placeholderTextColor="#888"
                    multiline={true} // Cho phép nhiều dòng
                    numberOfLines={4} // Số dòng mặc định
                    value={payload.description}
                    onChangeText={(text) => setPayload(prev => ({ ...prev, 'description': text }))}
                    onFocus={() => {
                        setFocusField('description')
                    }}
                />
                {invalidFields?.description && <Text style={{
                    paddingHorizontal: 15,
                    fontStyle: 'italic',
                    color: 'red',
                    fontSize: 12
                }}> {invalidFields.description}
                </Text>}
            </View>
            <View style={{ gap: 10 }}>
                <Text style={{
                    marginTop: 10,
                    textAlign: 'center',
                    color: '#AA0000',
                    fontSize: 17,
                    fontWeight: '700',
                    fontStyle: 'italic'
                }}>Hoặc</Text>
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleDocumentSelection}>
                        <Text style={{ color: "white", fontSize: 17, fontStyle: 'italic', fontWeight: 'bold', alignSelf: 'center', }}>Tải tài liệu lên</Text>
                    </TouchableOpacity>
                </View>
                {payload.file && <Text style={{
                    textAlign: 'center',
                    padding: 10,
                    fontStyle: 'italic'
                }}>{payload.file ? payload.file.name : ''} </Text>}
            </View>
            {invalidFields?.file && <Text style={{
                    paddingHorizontal: 15,
                    fontStyle: 'italic',
                    color: 'red',
                    fontSize: 12
                }}> {invalidFields.file}
            </Text>}
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
            {invalidFields?.date && <Text style={{
                    paddingHorizontal: 15,
                    fontStyle: 'italic',
                    color: 'red',
                    fontSize: 12
                }}> {invalidFields.date}
            </Text>}

            {showStartPicker && (
                <DateTimePicker
                    value={startDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={async (event, date) => {
                        setShowStartPicker(false);
                        if (date) {
                            setStartDate(date)
                        }
                        
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
                        if (date) {
                            setEndDate(date)
                            let newdate = new Date(date);
                            setPayload(prev => ({ ...prev, 'deadline': newdate.toISOString().split('.')[0] }))
                        };

                    }}
                />
            )}
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity
                    style={[styles.button, { width: 150, borderRadius: 10, backgroundColor: validateInput() ? '#AA0000' : '#CCCCCC' }]}
                    onPress={async () => { await handleSubmit() }}>
                    <Text style={{ color: "white", fontSize: 17, fontStyle: 'italic', fontWeight: 'bold', alignSelf: 'center', }}>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        gap: 10,
        backgroundColor: '#EEEEEE'
    },
    input: {
        borderWidth: 2,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderColor: '#AA0000',
        fontSize: 16,
        backgroundColor: 'white'
    },
    textArea: {
        width: '100%',
        height: 150,
        borderColor: '#AA0000',
        borderWidth: 2,
        borderRadius: 10,
        textAlignVertical: 'top', // Đảm bảo chữ bắt đầu từ đầu TextArea
        padding: 10,
        fontSize: 16,
        color: '#000',
        backgroundColor: 'white'
    },
    button: {
        backgroundColor: '#AA0000',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        width: 200
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        padding: 10
    },
    dateInput: {
        flex: 1,
        borderWidth: 2,
        borderColor: '#BB0000',
        borderRadius: 15,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: 'white',
    },
    dateText: {
        fontSize: 16,
        color: 'black',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginEnd: 1
    },
})

export default AddSurvey