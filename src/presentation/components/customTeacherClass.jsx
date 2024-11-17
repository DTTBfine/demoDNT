import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { classNameCode, getColorForId } from '../../utils/format'
import { useSelector } from 'react-redux'
import * as DocumentPicker from 'expo-document-picker';

const CustomTeacherClass = ({ id, name, type, tabName }) => {
    const navigate = useNavigation()
    const { token } = useSelector(state => state.auth)
    const [payload, setPayload] = useState({
        file: {},
        token: token,
        classId: id,
        title: '',
        description: '',
        materialType: ''
    })
    console.log(payload)
    console.log('tabname: ' + tabName)
    const handleUploadMaterial = async () => {
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

    return (
        <View style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        }}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 8
            }}>
                <View style={{
                    width: 35,
                    height: 35,
                    borderRadius: 5,
                    backgroundColor: getColorForId(id),
                    justifyContent: 'center'
                }}>
                    <Text style={{
                        fontSize: 15,
                        fontWeight: '600',
                        textAlign: 'center',
                        color: 'white'
                    }}>{classNameCode(name)}</Text>
                </View>
                <View style={{
                    justifyContent: 'center'
                }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 500,
                        color: 'white'
                    }}> {name} </Text>
                    <Text style={{
                        fontSize: 12,
                        color: '#CCCCCC'
                    }}> {type}</Text>
                </View>
            </View>
            <View>
                <Text onPress={() => navigate.navigate('addMaterial', { class_id: id })}
                    style={{
                        fontSize: 38,
                        fontWeight: '300',
                        color: 'white'
                    }}>+</Text>
            </View>
        </View>
    )
}

export default CustomTeacherClass