import { View, Text, TextInput, StyleSheet, TouchableOpacity, Linking } from 'react-native'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import * as DocumentPicker from 'expo-document-picker';
import { convertVNDate } from '../../../utils/format';

const SubmitSurvey = ({ route }) => {
    const { id, title, description, file_url, deadline } = route.params
    console.log({ id, title, description, file_url, deadline })
    const { token } = useSelector(state => state.auth)
    const [invalidFields, setInvalidFields] = useState([])
    const [payload, setPayload] = useState({
        file: {},
        token: token,
        assignmentId: id, //lấy luôn ở route.params
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
            assignmentId: id,
            textResponse: ''
        })
    }

    return (
        <View style={styles.container}>
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
                    onFocus={() => {
                        setInvalidFields([])
                    }}
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