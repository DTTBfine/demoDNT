import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as DocumentPicker from 'expo-document-picker';
import * as apis from '../../../data/api'
import { responseCodes } from '../../../utils/constants/responseCodes';
import Spinner from 'react-native-loading-spinner-overlay';
import * as actions from '../../redux/actions'

const defaultInvalidFields = {
    title: '',
    description: '',
    file: ''
}

const EditMaterial = ({ route }) => {
    const dispatch = useDispatch()
    const { currentMaterial } = route.params
    // console.log("current material: " + JSON.stringify(currentMaterial))
    const { class_id } = route.params
    const { isLoggedIn, msg, update, token, role, userId } = useSelector(state => state.auth)
    const [isLoading, setIsLoading] = useState(false)

    const [invalidFields, setInvalidFields] = useState(defaultInvalidFields)
    const [payload, setPayload] = useState({
        file: null,
        materialId: currentMaterial.id,
        title: currentMaterial.material_name,
        description: currentMaterial.description,
        materialType: '',
        token: token
    })
    const [focusField, setFocusField] = useState('')
    const validateInput = () => {
        // setInvalidFields(defaultInvalidFields)
        let check = true
        if (!payload.file) {
            setInvalidFields(prev => ({
                ...prev,
                file: "Tài liệu không được bỏ trống"
            }))
            check = false
        }

        if (!payload.title) {
            setInvalidFields(prev => ({
                ...prev,
                title: "Tiêu đề không được bỏ trống"
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

    // useEffect(() => {
    //     console.log("invalid fields: " + JSON.stringify(invalidFields))
    // }, [invalidFields])

    // useEffect(() => {
    //     console.log("payload: " + JSON.stringify(payload))
    // }, [payload])

    const resetInput = () => {
        setPayload({
            file: null,
            materialId: currentMaterial.id,
            title: currentMaterial.material_name,
            description: currentMaterial.description,
            materialType: '',
            token: token
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
                setFocusField('')
            }
        } catch (err) {
            console.error('Error picking document:', err);
        }
    }

    const handleSubmit = async () => {
        if (!validateInput()) {
            return
        }
        setIsLoading(true)
        const response = await apis.apiEditMaterial(payload)
        setIsLoading(false)
        if (response.data?.code !== responseCodes.statusOK) {
            console.log("error editing material: " + JSON.stringify(response.data))
            Alert.alert("Error", "Chỉnh sửa tài liệu lên không thành công")
        } else {
            Alert.alert("Success", "Chỉnh sửa tài liệu thành công")
            dispatch(actions.getMaterialList({
                token: token,
                class_id: currentMaterial.class_id
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
                    <Text style={{ width: 85, fontWeight: '500', fontSize: 15 }}>Tên tài liệu: </Text>
                    <View style={{ flex: 1 }}>
                        <TextInput
                            style={[styles.input, {
                                backgroundColor: focusField === 'title' ? 'mistyrose' : 'snow',
                                borderColor: focusField === 'title' ? 'mediumpurple' : 'silver',
                                fontWeight: focusField === 'title' ? '600' : '400',
                                color: focusField === 'title' ? '#BB0000' : 'gray'
                            }]}
                            placeholder='Nhập tên'
                            placeholderTextColor="#888"
                            value={payload.title}
                            onChangeText={(text) => setPayload(prev => ({ ...prev, 'title': text }))}
                            onFocus={() => {
                                setFocusField('title')
                                setInvalidFields(defaultInvalidFields)
                            }}
                        />
                        {invalidFields.length > 0 && invalidFields.some(i => i.name === 'title') && <Text style={{
                            paddingHorizontal: 15,
                            fontStyle: 'italic',
                            color: 'red',
                            fontSize: 12
                        }}> {invalidFields.find(i => i.name === 'title')?.message}
                        </Text>}
                    </View>
                </View>
                {invalidFields?.title && <Text style={{
                        paddingHorizontal: 15,
                        fontStyle: 'italic',
                        color: 'red',
                        fontSize: 12,
                        textAlign: 'center'
                    }}> {invalidFields.title}
                </Text>}
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
                                setInvalidFields(defaultInvalidFields)
                            }}
                        />
                    </View>
                </View>
                {invalidFields?.description && <Text style={{
                        paddingHorizontal: 15,
                        fontStyle: 'italic',
                        color: 'red',
                        fontSize: 12,
                        textAlign: 'center'
                    }}> {invalidFields.description}
                </Text>}
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
                {invalidFields?.file && <Text style={{
                        paddingHorizontal: 15,
                        fontStyle: 'italic',
                        color: 'red',
                        fontSize: 12,
                        textAlign: 'center'
                    }}> {invalidFields.file}
                </Text>}
            </View>
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity
                    style={[styles.button, { width: 150, borderRadius: 10, backgroundColor: (payload.file && payload.title && payload.description && payload.materialType) ? '#AA0000' : '#CCCCCC' }]}
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
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 20,
        fontSize: 15,
    },
    textArea: {
        height: 150,
        borderWidth: 1,
        borderRadius: 10,
        textAlignVertical: 'top', // Đảm bảo chữ bắt đầu từ đầu TextArea
        padding: 8,
        fontSize: 15,
        color: '#000',
    },
    button: {
        backgroundColor: '#AA0000',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 10
    }
})

export default EditMaterial