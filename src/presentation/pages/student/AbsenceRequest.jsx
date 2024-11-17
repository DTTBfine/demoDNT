import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker'
import { formatSQLDate } from '../../../utils/format';
import Icon from 'react-native-vector-icons/FontAwesome'

const AbsenceRequest = ({ route }) => {
    //Đã xử lý payload đúng định dạng rồi, chỉ cần gửi api thôi, thêm cái Submit
    const { class_id } = route.params
    const { isLoggedIn, msg, update, token, role, userId } = useSelector(state => state.auth)

    const [invalidFields, setInvalidFields] = useState([])
    const [date, setDate] = useState(new Date())
    const [payload, setPayload] = useState({
        token: token,
        class_id: class_id,
        date: formatSQLDate(date), //vd: 2024-11-13,
        reason: '',
        title: '',
        file: {}
    })
    const [focusField, setFocusField] = useState('')
    const [showDatePicker, setShowDatePicker] = useState(false)

    console.log('payload: ' + JSON.stringify(payload))

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
    console.log('formatSQLDate: ' + formatSQLDate(date))

    return (
        <View style={styles.container}>
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
                {invalidFields.length > 0 && invalidFields.some(i => i.name === 'title') && <Text style={{
                    paddingHorizontal: 15,
                    fontStyle: 'italic',
                    color: 'red',
                    fontSize: 12
                }}> {invalidFields.find(i => i.name === 'title')?.message}
                </Text>}
                <TextInput
                    style={[styles.textArea, { borderColor: focusField === 'reason' ? '#00CCFF' : '#AA0000' }]}
                    placeholder="Lý do"
                    placeholderTextColor="#888"
                    multiline={true} // Cho phép nhiều dòng
                    numberOfLines={4} // Số dòng mặc định
                    value={payload.description}
                    onChangeText={(text) => setPayload(prev => ({ ...prev, 'reason': text }))}
                    onFocus={() => {
                        setFocusField('reason')
                        setInvalidFields([])
                    }}
                />
                {invalidFields.length > 0 && invalidFields.some(i => i.name === 'reason') && <Text style={{
                    paddingHorizontal: 15,
                    fontStyle: 'italic',
                    color: 'red',
                    fontSize: 12
                }}> {invalidFields.find(i => i.name === 'reason')?.message}
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
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity
                    style={[styles.button, { width: 150, borderRadius: 10 }]}
                    onPress={() => { }}>
                    <Text style={{ color: "white", fontSize: 17, fontStyle: 'italic', fontWeight: 'bold', alignSelf: 'center', }}>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        gap: 10
    },
    input: {
        borderWidth: 2,
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
        borderWidth: 2,
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