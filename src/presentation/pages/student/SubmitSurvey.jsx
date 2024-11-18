import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import * as DocumentPicker from 'expo-document-picker';

const SubmitSurvey = () => {
    const { token } = useSelector(state => state.auth)
    const [payload, setPayload] = useState({
        file: {},
        token: token,
        assignmentId: '', //lấy luôn ở route.params
        textResponse: ''
    })
    console.log(payload)

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
                setPayload(prev => ({ ...prev, 'file': result.assets[0] }))
            }
        } catch (err) {
            console.error('Error picking document:', err);
        }
    }

    const handleSubmit = () => {
        setPayload({
            file: {},
            token: token,
            assignmentId: '', //lấy luôn ở route.params
            textResponse: ''
        })
    }

    return (
        <View style={styles.container}>
            <View style={{
                gap: 15,
                padding: 10,
                marginTop: 20
            }}>
                <View style={{ paddingVertical: 15, gap: 15 }}>
                    <Text style={styles.input}>Title của cái bài tập đó</Text>
                    <Text style={styles.input}>Mô tả của cái bài tập đó</Text>
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => { }}>
                            <Text style={{ color: "white", fontSize: 17, fontStyle: 'italic', fontWeight: 'bold', alignSelf: 'center', }}>Tên của cái file bài tập</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TextInput
                    style={[styles.textArea, { borderColor: '#AA0000' }]}
                    placeholder="Mô tả"
                    placeholderTextColor="#888"
                    multiline={true} // Cho phép nhiều dòng
                    numberOfLines={4} // Số dòng mặc định
                    value={payload.textResponse}
                    onChangeText={(text) => setPayload(prev => ({ ...prev, 'textResponse': text }))}
                    onFocus={() => {
                        setInvalidFields([])
                    }}
                />
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
                }}>{payload.file.name} </Text>}
            </View>
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity
                    style={[styles.button, { width: 150, borderRadius: 10 }]}
                    onPress={() => { handleSubmit }}>
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

export default SubmitSurvey