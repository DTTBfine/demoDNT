import { View, Text, TextInput, StyleSheet, TouchableOpacity, Keyboard, Alert } from 'react-native'
import React, { useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as DocumentPicker from 'expo-document-picker';
import * as apis from '../../../data/api'
import { responseCodes } from '../../../utils/constants/responseCodes';
import Spinner from 'react-native-loading-spinner-overlay';
import * as actions from '../../redux/actions'

const defaultInvalidFields = {
    title: '',
    description: '',
    file: '',
}

const AddMaterial = ({ route }) => {
    const dispatch = useDispatch()
    const { class_id } = route.params
    const { isLoggedIn, msg, update, token, role, userId } = useSelector(state => state.auth)
    const [isLoading, setIsLoading] = useState(false)

    const [invalidFields, setInvalidFields] = useState(defaultInvalidFields)
    const [payload, setPayload] = useState({
        file: null,
        token: token,
        classId: class_id,
        title: '',
        description: '',
        materialType: ''
    })
    const [focusField, setFocusField] = useState('')


    const validateInput = () => {
        if (!payload) {
            return false
        }
        return payload.file && payload.title && payload.description && payload.materialType
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

        return check
    }

    const resetInput = () => {
        setPayload({
            file: null,
            token: token,
            classId: class_id,
            title: '',
            description: '',
            materialType: ''
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

            console.log('result ' + JSON.stringify(result))
            if (result?.assets?.length > 0) {
                const { mimeType, uri, name } = result.assets[0]
                setPayload(prev => ({
                    ...prev,
                    'file': {
                        type: mimeType,
                        uri: uri,
                        name: name
                    },
                    'materialType': mimeType
                }))
            }
        } catch (err) {
            console.error('Error picking document:', err);
        }
    }

    const handleSubmit = async () => {
        if (!validateInputWithSet()) {
            return
        }
        setIsLoading(true)
        // console.log("payload: " + JSON.stringify(payload))
        const response = await apis.apiUploadMaterial(payload)
        setIsLoading(false)
        if (response.data?.code !== responseCodes.statusOK) {
            console.log("error adding material: " + response?.data?.meta.message)
            Alert.alert("Error", "Tải tài liệu lên không thành công")
        } else {
            Alert.alert("Success", "Tải tài liệu thành công")
            dispatch(actions.getMaterialList({
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
                textStyle={styles.spinnerTextStyle}
            />
            <View style={{
                gap: 15,
                padding: 10,
                marginTop: 20
            }}>
                <TextInput
                    style={[styles.input, { borderColor: focusField === 'title' ? '#00CCFF' : '#AA0000' }]}
                    placeholder='Tên tài liệu*'
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
            {invalidFields?.file && <Text style={{
                    paddingHorizontal: 15,
                    fontStyle: 'italic',
                    color: 'red',
                    fontSize: 12
                }}> {invalidFields.file}
            </Text>}
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity
                    style={[styles.button, { width: 150, borderRadius: 10, backgroundColor: validateInput() ? '#AA0000' : '#CCCCCC' }]}
                    onPress={async () => {
                        await handleSubmit()
                    }}>
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
    spinnerTextStyle: {
        color: '#FFF'
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

export default AddMaterial