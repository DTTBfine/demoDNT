import { View, Text, TextInput, StyleSheet, TouchableOpacity, Linking, Keyboard, Alert, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import * as DocumentPicker from 'expo-document-picker';
import { convertVNDate } from '../../../utils/format';
import Spinner from 'react-native-loading-spinner-overlay';
import * as apis from '../../../data/api'
import { responseCodes } from '../../../utils/constants/responseCodes';


const SubmitSurvey = ({ route }) => {
    const { id, title, description, file_url, deadline } = route.params
    const [isLoading, setIsLoading] = useState(false)
    const { token } = useSelector(state => state.auth)
    const [invalidFields, setInvalidFields] = useState({
        'submit': ''
    })
    const [payload, setPayload] = useState({
        file: null,
        token: token,
        assignmentId: id, //lấy luôn ở route.params
        textResponse: ''
    })

    const validateInput = (file, textResponse) => {
        const currentDate = new Date()
        const deadlineDate = new Date(deadline)

        if (currentDate > deadlineDate) {
            setInvalidFields((prev) => ({
                ...prev,
                submit: "Đã quá hạn nộp bài tập"
            }))
            return false
        }

        if (file || textResponse.length > 0) {
            return true
        }
        console.log("input failed")
        setInvalidFields((prev) => ({
            ...prev,
            submit: "Cần phải điền mô tả hoặc tải lên tài liệu"
        }))
        return false
    }

    const resetInput = () => {
        setPayload({
            file: null,
            token: token,
            assignmentId: id,
            textResponse: ''
        })
        Keyboard.dismiss()
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
        if (!validateInput(payload.file, payload.textResponse)) {
            return
        }
        setIsLoading(true)
        const response = await apis.apiSubmitSurvey(payload)
        console.log("submit survey response: " + JSON.stringify(response?.data))
        setIsLoading(false)
        if (response.data?.meta?.code !== responseCodes.statusOK) {
            Alert.alert("Error", response.data?.meta?.message || "Nộp bài tập không thành công")
        } else {
            Alert.alert("Success", response.data?.meta?.message || "Nộp bài tập thành công")
        }

        resetInput()

    }

    return (
        <ScrollView style={styles.container}>
            <Spinner
                visible={isLoading}
                textContent={'Chờ xử lý...'}
                textStyle={{
                    color: '#FFF'
                }}
            />
            <View style={{
                gap: 15,
                paddingVertical: 10,
            }}>
                <View style={{ backgroundColor: 'white', padding: 15, gap: 15, borderBottomWidth: 1, borderRightWidth: 1, borderColor: '#CCCCCC', borderRadius: 15, elevation: 5 }}>
                    <Text style={{
                        fontSize: 24,
                        fontWeight: '500',
                        marginBottom: 10,
                    }}>{title}</Text>
                    <Text style={{ textAlign: 'right', fontStyle: 'italic', color: 'gray', fontSize: 13 }}>Hạn nộp: {convertVNDate(deadline)}</Text>

                    <View>
                        <Text style={{ fontWeight: '500', fontSize: 16 }}>Mô tả yêu cầu:</Text>
                        {description && <Text style={{ padding: 5 }}>{description}</Text>}
                    </View>
                    <View>
                        <Text style={{ fontWeight: '500', fontSize: 16 }}>File mô tả: </Text>
                        {file_url && <TouchableOpacity onPress={() => {
                            Linking.openURL(file_url).catch(err => console.error("Failed to open URL: ", err))
                        }}
                            style={{ padding: 5 }}
                        >
                            <Text style={{
                                zIndex: 100,
                                color: 'dodgerblue',
                                textDecorationLine: 'underline'
                            }}
                            >{file_url}
                            </Text>
                        </TouchableOpacity>
                        }
                    </View>
                </View>
                <Text style={{ textAlign: 'center', fontWeight: '500', fontSize: 16 }}>Bài làm</Text>
                <TextInput
                    style={[styles.textArea, { borderColor: '#AA0000' }]}
                    placeholder="Mô tả bài làm"
                    placeholderTextColor="#888"
                    multiline={true} // Cho phép nhiều dòng
                    numberOfLines={4} // Số dòng mặc định
                    value={payload.textResponse}
                    onChangeText={(text) => setPayload(prev => ({ ...prev, 'textResponse': text }))}
                    // onFocus={() => {
                    //     setInvalidFields({
                    //         'submit': ''
                    //     })
                    // }}
                />
            </View>
            <View style={{ gap: 10 }}>
                <Text style={{
                    marginTop: 5,
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
                }}>{payload.file.name} </Text>}
            </View>
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity
                    style={[styles.button, { width: 150, borderRadius: 10, backgroundColor: (payload.file || payload.textResponse) ? '#AA0000' : '#CCCCCC' }]}
                    onPress={async () => { 
                        await handleSubmit() 
                    }}>
                    <Text style={{ color: "white", fontSize: 17, fontStyle: 'italic', fontWeight: 'bold', alignSelf: 'center', }}>Submit</Text>
                </TouchableOpacity>
            </View>
            {invalidFields?.submit.length > 0 && <Text style={{
                paddingHorizontal: 15,
                fontStyle: 'italic',
                color: 'red',
                fontSize: 12,
                textAlign: 'center'
            }}> {invalidFields.submit}
            </Text>}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        gap: 10
    },
    textArea: {
        width: '100%',
        height: 150,
        borderColor: '#AA0000',
        borderWidth: 1,
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
    }
})

export default SubmitSurvey