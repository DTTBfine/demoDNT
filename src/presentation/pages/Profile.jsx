import { View, Text, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard, TextInput } from 'react-native'
import { View, Text, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard, TextInput } from 'react-native'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'react-native-vector-icons/AntDesign'
import * as DocumentPicker from 'expo-document-picker';
import * as apis from '../../data/api/index'
import { responseCodes } from '../../utils/constants/responseCodes';
import * as actions from '../redux/actions'


const ProfileScreen = () => {
    const dispatch = useDispatch()
    const { userInfo } = useSelector(state => state.user)
    const [file, setFile] = useState({})
    console.log('userInfo', userInfo)
    console.log(file)

    const handleImageSelection = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'image/*',
                copyToCacheDirectory: true,
            });

            // Kiểm tra nếu người dùng hủy chọn file
            if (result.canceled) {
                console.log('User canceled image selection.');
                return; // Không tiếp tục nếu bị hủy
            }
            console.log('result ' + JSON.stringify(result))
            if (result?.assets?.length > 0) {
                const { mimeType, uri, name } = result.assets[0]
                setFile({
                    uri: uri,
                    name: name,
                    type: mimeType
                })
            }
        } catch (err) {
            setInvalidFields(prev => {
                const newFields = new Map(prev)
                newFields.set(invalidFieldFile, "Lỗi chọn file: " + err)

                return newFields
            })
        }
    }

    const handleSaveChanges = async () => {
        setInvalidFields(new Map())
        setSubmitInfo('')
        if (!validateInput(name, file)) {
            return
        }


        const response = await apis.apiChangeInfoAfterSignUp({
            token: token,
            name: name,
            file: file
        })

        if (response?.data.code !== responseCodes.statusOK) {
            setInvalidFields(prev => {
                const newFields = new Map(prev)
                newFields.set(invalidFieldsSubmit, "Không thể lưu thay đổi: " + response.data.message)

                return newFields
            })
            return
        }

        dispatch(actions.getUserInfo({
            token,
            userId
        }))

        setSubmitInfo('Lưu thay đổi thành công')

    }

    return (
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
            <View style={styles.container}>
                <View style={{ alignItems: 'center' }}>
                    <View style={{}}>
                        <Image
                            source={file
                                ? { uri: file.uri }
                                : originalAvatar?.length > 0
                                    ? { uri: originalAvatar }
                                    : require('../../../assets/default-avatar.jpg')
                            }
                            style={{
                                width: 200,
                                height: 200,
                                borderRadius: 15,
                                borderColor: 'white',
                                borderWidth: 3
                            }}
                        />
                        <TouchableOpacity onPress={handleImageSelection} style={{
                            position: 'absolute',
                            bottom: 3,
                            right: 3,
                            width: 30,
                            height: 30,
                            borderBottomRightRadius: 14,
                        }}>
                            <Icon name='edit' size={25} color='#BB0000' />
                        </TouchableOpacity>
                        {invalidFields.size > 0 && invalidFields.has(invalidFieldFile) && <Text style={{
                            paddingHorizontal: 15,
                            fontStyle: 'italic',
                            color: 'red',
                            fontSize: 12
                        }}> {invalidFields.get(invalidFieldFile)} </Text>}
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        gap: 5,
                        marginVertical: 10
                    }}>
                        <View style={{ padding: 15 }}>
                            {isEditable ? (
                                <TextInput
                                    style={{
                                        textAlign: 'center',
                                        fontSize: 24,
                                        fontWeight: '600',
                                        borderBottomWidth: 1,
                                        borderBottomColor: '#BB0000',
                                    }}
                                    value={name}
                                    onChangeText={setName}
                                    autoFocus={true} // Focus automatically when editing
                                    onSubmitEditing={handleOutsidePress} // Disable editing on "Enter"
                                />
                            ) : (
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        fontSize: 24,
                                        fontWeight: '600',
                                    }}
                                >
                                    {name}
                                </Text>
                            )}
                        </View>
                        <Icon
                            style={{ padding: 15 }}
                            name='edit'
                            size={25}
                            color='#BB0000'
                            onPress={handleIconPress}
                        />
                    </View>
                    {invalidFields.size > 0 && invalidFields.has(invalidFieldName) && <Text style={{
                        paddingHorizontal: 15,
                        fontStyle: 'italic',
                        color: 'red',
                        fontSize: 12
                    }}> {invalidFields.get(invalidFieldName)} </Text>}

                </View>
                <View style={styles.infoItem}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.ItemName}>Tên đăng nhập: </Text>
                        <Text style={styles.ItemValue}>{userInfo.name} </Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.ItemName}>Email: </Text>
                        <Text style={styles.ItemValue}>{userInfo.email} </Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.ItemName}>Vai trò: </Text>
                        <Text style={styles.ItemValue}>{userInfo.role === 'LECTURER' ? 'Giảng viên' : 'Sinh viên'} </Text>
                    </View>
                </View>
                <View style={{
                    flexDirection: 'row',
                    gap: 5,
                    marginVertical: 10
                }}>
                    <TouchableOpacity
                        style={{
                            flex: 5,
                            backgroundColor: "#BB0000",
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 15,
                            paddingVertical: 10
                        }}
                        onPress={handleCancelChanges}>
                        <Text style={{
                            color: 'white',
                            fontWeight: 'bold',
                            fontStyle: 'italic',
                            fontSize: 16
                        }}
                        >
                            Hủy bỏ
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            flex: 5,
                            backgroundColor: "#BB0000",
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 15,
                            paddingVertical: 10
                        }}
                        onPress={async () => {
                            await handleSaveChanges()
                        }}>
                        <Text style={{
                            color: 'white',
                            fontWeight: 'bold',
                            fontStyle: 'italic',
                            fontSize: 16
                        }}>
                            Lưu thay đổi
                        </Text>
                    </TouchableOpacity>
                </View>
                {submitInfo && <Text style={{
                    paddingHorizontal: 15,
                    fontStyle: 'italic',
                    color: 'green',
                    fontSize: 12
                }}> {submitInfo}</Text>}
            </View>
        </TouchableWithoutFeedback>

    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    infoItem: {
        paddingHorizontal: 5,
        borderBottomWidth: 1,
        borderColor: '#CCCCCC',
        elevation: 5,
        backgroundColor: 'white',
        borderRadius: 10
    },
    ItemName: {
        paddingHorizontal: 10,
        paddingVertical: 15,
        fontSize: 16,
        fontWeight: '600',
        flex: 2
    },
    ItemValue: {
        paddingHorizontal: 10,
        paddingVertical: 15,
        fontSize: 14,
        fontWeight: '500',
        fontStyle: 'italic',
        color: 'gray',
        flex: 3
    }
})

export default ProfileScreen