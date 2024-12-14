import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import * as DocumentPicker from 'expo-document-picker';
import * as apis from '../../../data/api/index'
import DateTimePicker from '@react-native-community/datetimepicker'
import { formatSQLDate } from '../../../utils/format';
import Icon from 'react-native-vector-icons/FontAwesome'
import { responseCodes } from '../../../utils/constants/responseCodes';
import { useNavigation } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';

const AbsenceRequest = ({ route }) => {
    //Đã xử lý payload đúng định dạng rồi, chỉ cần gửi api thôi, thêm cái Submit
    const { class_id } = route.params
    const navigate = useNavigation()
    const { isLoggedIn, msg, update, token, role, userId } = useSelector(state => state.auth)
    const [requestAbsenceInfo, setRequestAbsenceInfo] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const [invalidFields, setInvalidFields] = useState(new Map())
    //invalid fields
    const invalidFieldTitle = 'title'
    const invalidFieldReason = 'reason'
    const invalidFieldFile = 'file'
    const invalidFieldSubmit = 'submit'
    const invalidFieldDate = 'date'

    const validateInput = async (title, reason, file, date) => {
        let check = true

        if (title?.length === 0) {
            setInvalidFields(prev => {
                const newFields = new Map(prev)
                newFields.set(invalidFieldTitle, "Tiêu đề không được bỏ trống")

                return newFields
            })
            check = false
        }

        if (reason?.length === 0) {
            setInvalidFields(prev => {
                const newFields = new Map(prev)
                newFields.set(invalidFieldReason, "Lý do không được bỏ trống")

                return newFields
            })
            check = false
        }

        if (!file) {
            setInvalidFields(prev => {
                const newFields = new Map(prev)
                newFields.set(invalidFieldFile, "Bạn cần phải tải file minh chứng")

                return newFields
            })
            check = false
        }

        if (!date) {
            setInvalidFields(prev => {
                const newFields = new Map(prev)
                newFields.set(invalidFieldDate, "Bạn cần phải chọn ngày xin nghỉ")

                return newFields
            })
            check = false
        } else {
            setIsLoading(true)
            const response = await apis.apiGetStudentAbsenceRequests({
                token: token,
                class_id: class_id,
                date: date,
                pageable_request: {
                    page: 0,
                    page_size: 2
                }
            })
            setIsLoading(false)
            // console.log("get student absence requests: " + JSON.stringify(response?.data))
            if (response?.data?.data?.page_content?.length > 0) {
                setInvalidFields(prev => {
                    const newFields = new Map(prev)
                    newFields.set(invalidFieldDate, "Đã xin nghỉ vào ngày này")

                    return newFields
                })
                check = false
            }
        }
        return check
    }



    const [date, setDate] = useState(new Date())
    const [payload, setPayload] = useState({
        token: token,
        class_id: class_id,
        date: formatSQLDate(date), //vd: 2024-11-13,
        reason: '',
        title: '',
        file: null
    })
    const [focusField, setFocusField] = useState('')
    const [showDatePicker, setShowDatePicker] = useState(false)

    const resetInput = () => {
        setPayload(prev => ({
            ...prev,
            reason: '',
            title: '',
            file: null
        }));
    }


    const handleDocumentSelection = async () => {
        setInvalidFields(new Map())
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
                copyToCacheDirectory: true,
            });

            // Kiểm tra nếu người dùng hủy chọn file
            if (result.canceled) {
                console.log('User canceled document selection.');
                return; // Không tiếp tục nếu bị hủy
            }

            // console.log('result ' + JSON.stringify(result))
            if (result?.assets?.length > 0) {
                const { mimeType, uri, name } = result.assets[0]
                setPayload(prev => ({
                    ...prev, 'file': {
                        uri: uri,
                        name: name,
                        type: mimeType
                    }
                }))
            }
        } catch (err) {
            console.error('Error picking document:', err);
        }
    }

    const handleSubmit = async () => {
        setInvalidFields(new Map())
        check = await validateInput(payload.title, payload.reason, payload.file, payload.date)
        if (!check) {
            return
        }
        setRequestAbsenceInfo('Đang gửi đơn xin nghỉ học...')
        setIsLoading(true)
        const response = await apis.apiRequestAbsence(payload)
        setIsLoading(false)
        console.log("absence response: " + JSON.stringify(response.data))
        if (response?.data.meta.code !== responseCodes.statusOK) {
            Alert.alert("Error", "Gửi đơn xin nghỉ không thành công")
            return setInvalidFields(prev => {
                const newFields = new Map(prev)
                newFields.set(invalidFieldSubmit, response?.data.data)

                return newFields
            })
        }
        Alert.alert("Success", "Gửi đơn xin nghỉ thành công")
        resetInput()


    }
    const onChange = (event, selectedDate) => {
        if (event.type === "set") { // Kiểm tra nếu người dùng chọn ngày (type: set)
            const currentDate = selectedDate || date;
            setDate(currentDate); // Cập nhật ngày mới
            setPayload(prev => ({ ...prev, 'date': formatSQLDate(currentDate) }))
            setShowDatePicker(false); // Đóng DateTimePicker sau khi chọn ngày
        } else {
            setShowDatePicker(false); // Đóng DateTimePicker nếu người dùng nhấn hủy (type: dismissed)
        }
    };

    return (
        <View style={styles.container}>
            <Spinner
                visible={isLoading}
                textContent={''}
                textStyle={{
                    color: '#000'
                }}
            />
            <View style={{
                gap: 15,
                padding: 10,
                marginTop: 20
            }}>
                <TextInput
                    style={[styles.input, { borderColor: focusField === 'title' ? '#00CCFF' : '#AA0000' }]}
                    placeholder='Tiêu đề'
                    placeholderTextColor="#888"
                    value={payload.title}
                    onChangeText={(text) => setPayload(prev => ({ ...prev, 'title': text }))}
                    onFocus={() => {
                        setFocusField('title')
                        setInvalidFields([])
                    }}
                />
                {invalidFields.size > 0 && invalidFields.has(invalidFieldTitle) && <Text style={{
                    paddingHorizontal: 15,
                    fontStyle: 'italic',
                    color: 'red',
                    fontSize: 12,
                    textAlign: 'center'
                }}> {invalidFields.get(invalidFieldTitle)}
                </Text>}
                <TextInput
                    style={[styles.textArea, { borderColor: focusField === 'reason' ? '#00CCFF' : '#AA0000' }]}
                    placeholder="Lý do"
                    placeholderTextColor="#888"
                    multiline={true} // Cho phép nhiều dòng
                    numberOfLines={4} // Số dòng mặc định
                    value={payload.reason}
                    onChangeText={(text) => setPayload(prev => ({ ...prev, 'reason': text }))}
                    onFocus={() => {
                        setFocusField('reason')
                        setInvalidFields([])
                    }}
                />
                {invalidFields.size > 0 && invalidFields.has(invalidFieldReason) && <Text style={{
                    paddingHorizontal: 15,
                    fontStyle: 'italic',
                    color: 'red',
                    fontSize: 12,
                    textAlign: 'center'
                }}> {invalidFields.get(invalidFieldReason)}
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
                }}>Và</Text>
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleDocumentSelection}>
                        <Text style={{ color: "white", fontSize: 17, fontStyle: 'italic', fontWeight: 'bold', alignSelf: 'center', }}>Tải minh chứng</Text>
                    </TouchableOpacity>
                </View>
                {invalidFields.size > 0 && invalidFields.has(invalidFieldFile) && <Text style={{
                    paddingHorizontal: 15,
                    fontStyle: 'italic',
                    color: 'red',
                    fontSize: 12,
                    textAlign: 'center'
                }}> {invalidFields.get(invalidFieldFile)}
                </Text>}
                {payload.file && <Text style={{
                    textAlign: 'center',
                    padding: 10,
                    fontStyle: 'italic'
                }}>{payload.file.name} </Text>}
            </View>
            <View style={[styles.input, { flexDirection: 'row', marginHorizontal: 20, justifyContent: 'space-between', alignItems: 'center' }]}>
                <Text style={{ fontSize: 16, paddingHorizontal: 10 }}>{formatSQLDate(date)}</Text>
                <TouchableOpacity
                    style={{ borderRadius: 10 }}
                    onPress={() => { setShowDatePicker(true) }}>
                    <Icon name='chevron-down' color='#AA0000' size={18} />
                </TouchableOpacity>
                {
                    showDatePicker && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode="date"
                            is24Hour={true}
                            display="default"
                            onChange={onChange}
                        />
                    )
                }

            </View>
            {invalidFields.size > 0 && invalidFields.has(invalidFieldDate) && <Text style={{
                    paddingHorizontal: 15,
                    fontStyle: 'italic',
                    color: 'red',
                    fontSize: 12,
                    textAlign: 'center'
                }}> {invalidFields.get(invalidFieldDate)}
            </Text>}
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: (payload.file && payload.reason && payload.title) ? '#AA0000' : '#CCCCCC', width: 150, borderRadius: 10 }]}
                    onPress={async () => {
                        await handleSubmit()
                    }}>
                    <Text
                        style={{
                            color: (payload.file && payload.reason && payload.title) ? 'white' : 'gray',
                            fontSize: 17,
                            fontStyle: 'italic',
                            fontWeight: 'bold',
                            alignSelf: 'center',
                        }}>
                        Submit
                    </Text>
                </TouchableOpacity>
            </View>

            {
                invalidFields.size > 0 && invalidFields.has(invalidFieldSubmit) && <Text style={{
                    paddingHorizontal: 15,
                    fontStyle: 'italic',
                    color: 'red',
                    fontSize: 12,
                    textAlign: 'center'
                }}> {invalidFields.get(invalidFieldSubmit)}
                </Text>
            }
            {
                requestAbsenceInfo && <Text style={{
                    paddingHorizontal: 15,
                    fontStyle: 'italic',
                    color: 'green',
                    fontSize: 12,
                    textAlign: 'center'
                }}> {requestAbsenceInfo}
                </Text>
            }
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        gap: 10
    },
    input: {
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        elevation: 5,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderColor: '#AA0000',
        fontSize: 16,
    },
    textArea: {
        width: '100%',
        height: 150,
        borderColor: '#AA0000',
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        elevation: 5,
        borderRadius: 10,
        textAlignVertical: 'top', // Đảm bảo chữ bắt đầu từ đầu TextArea
        padding: 10,
        fontSize: 16,
        color: '#000',
    },
    button: {
        backgroundColor: '#AA0000',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        width: 200
    }
})

export default AbsenceRequest