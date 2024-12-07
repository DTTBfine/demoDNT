import { View, Text, TextInput, StyleSheet, TouchableOpacity, Keyboard, Alert } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import * as DocumentPicker from 'expo-document-picker';
import Icon from 'react-native-vector-icons/FontAwesome'
import DateTimePicker from '@react-native-community/datetimepicker';
import * as apis from '../../../data/api'
import { responseCodes } from '../../../utils/constants/responseCodes';
import Spinner from 'react-native-loading-spinner-overlay';

const EditSurvey = ({ route }) => {
    const { currentSurvey } = route.params
    const { token } = useSelector(state => state.auth)
    const [isLoading, setIsLoading] = useState(false)

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const [invalidFields, setInvalidFields] = useState([])
    const [payload, setPayload] = useState({
        file: null,
        token: token,
        assignmentId: currentSurvey.id,
        deadline: currentSurvey.deadline, //định dạng: 2024-12-11T14:30:00
        description: currentSurvey.description
    })
    console.log(payload)

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
            assignmentId: currentSurvey.id,
            deadline: currentSurvey.deadline, //định dạng: 2024-12-11T14:30:00
            description: currentSurvey.description
        })
        Keyboard.dismiss()
    }

    const validateInput = () => {
        return payload.title && endDate
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
                const { mimeType, uri, name } = result.assets[0]
                setPayload(prev => ({
                    ...prev, 'file': {
                        type: mimeType,
                        uri: uri,
                        name: name
                    }
                }))
            }
        } catch (err) {
            console.error('Error picking document:', err);
        }
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        // const response = await apis.apiCreateSurvey(payload)
        // setIsLoading(false)
        // if (response.data?.meta?.code !== responseCodes.statusOK) {
        //     Alert.alert("Error", response.data?.meta?.message || "Tạo bài kiểm tra không thành công")
        // } else {
        //     Alert.alert("Success", response.data?.meta?.message || "Tạo bài kiểm tra thành công")
        // }

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
                backgroundColor: 'white',
                gap: 15,
                paddingHorizontal: 10,
                paddingVertical: 30,
                marginVertical: 20,
                borderRadius: 10,
                elevation: 5,
                minHeight: 450
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', margin: 5 }}>
                    <Text style={{ width: 85, fontWeight: '500', fontSize: 15 }}>Tên bài: </Text>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: '600' }}>{currentSurvey.title}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', margin: 5 }}>
                    <Text style={{ width: 85, fontWeight: '500', fontSize: 15 }}>Mô tả: </Text>
                    <View style={{ flex: 1 }}>
                        <TextInput
                            style={[styles.textArea, {
                                backgroundColor: focusField === 'description' ? 'mistyrose' : 'snow',
                                borderColor: focusField === 'description' ? 'mediumpurple' : 'silver',
                                fontWeight: focusField === 'description' ? '600' : '400',
                                color: focusField === 'description' ? '#BB0000' : 'gray'
                            }]}
                            placeholder="Mô tả"
                            placeholderTextColor="#888"
                            multiline={true} // Cho phép nhiều dòng
                            numberOfLines={4} // Số dòng mặc định
                            value={payload.description}
                            onChangeText={(text) => setPayload(prev => ({ ...prev, 'description': text }))}
                            onFocus={() => {
                                setFocusField('description')
                                setInvalidFields([])
                            }}
                        />
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', margin: 5 }}>
                    <Text style={{ width: 85, fontWeight: '500', fontSize: 15 }}>File upload: </Text>
                    <View style={{ flex: 1, gap: 20 }}>
                        <View style={{ minHeight: 20 }}>
                            {payload.file && <Text style={{
                                color: 'deepskyblue',
                                textDecorationLine: 'underline',
                                fontSize: 15
                            }}> {payload.file.name}</Text>}
                        </View>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleDocumentSelection}>
                            <Text style={{ height: 20, color: "white", fontSize: 15, fontWeight: 'bold', alignSelf: 'center', }}>Tải tài liệu lên</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
            </View>


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
        height: 150,
        borderWidth: 1,
        borderRadius: 10,
        textAlignVertical: 'top', // Đảm bảo chữ bắt đầu từ đầu TextArea
        padding: 10,
    },
    button: {
        backgroundColor: '#BB0000',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 10
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        padding: 10
    },
    dateInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#BB0000',
        borderRadius: 15,
        paddingVertical: 8,
        paddingHorizontal: 15,
        backgroundColor: 'snow',
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

export default EditSurvey