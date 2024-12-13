import { View, Text, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard, TextInput, Modal, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'react-native-vector-icons/AntDesign'
import * as DocumentPicker from 'expo-document-picker';
import * as apis from '../../data/api/index'
import { responseCodes } from '../../utils/constants/responseCodes';
import * as actions from '../redux/actions'
import Spinner from 'react-native-loading-spinner-overlay';


const ProfileScreen = () => {
    const dispatch = useDispatch()
    const { userInfo } = useSelector(state => state.user)
    let originalAvatar = ""
    if (userInfo.avatar?.length > 0 && userInfo.avatar.startsWith("https://drive.google.com")) {
        const fileId = userInfo.avatar.split('/d/')[1].split('/')[0];
        originalAvatar = `https://drive.google.com/uc?export=view&id=${fileId}`
    }
    const { isLoggedIn, msg, update, token, role, userId, password } = useSelector(state => state.auth)
    const originalName = `${userInfo.ho} ${userInfo.ten}`
    const [file, setFile] = useState(null)
    const [newPassword, setNewPassword] = useState('')
    const [name, setName] = useState(originalName)
    const [isEditable, setIsEditable] = useState(false);
    const [invalidFields, setInvalidFields] = useState(new Map())
    const invalidFieldName = 'name'
    const invalidFieldFile = 'file'
    const invalidFieldsSubmit = 'submit'
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [submitInfo, setSubmitInfo] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleIconPress = () => {
        setIsEditable(true); // Enable editing
    };

    const handleOutsidePress = () => {
        if (isEditable) {
            setIsEditable(false); // Disable editing
            Keyboard.dismiss(); // Close the keyboard
        }
    };

    const handleCancelChanges = () => {
        setInvalidFields(new Map())
        setSubmitInfo('')
        setName(originalName)
        setFile(null)
        Keyboard.dismiss()
    }

    const validateInput = (name, file) => {
        let check = true

        if (name.length === 0) {
            setInvalidFields(prev => {
                const newFields = new Map(prev)
                newFields.set(invalidFieldName, "Tên không được bỏ trống")

                return newFields
            })
            check = false
        }

        if (!file) {
            setInvalidFields(prev => {
                const newFields = new Map(prev)
                newFields.set(invalidFieldFile, "Cần phải chọn 1 file")

                return newFields
            })
            check = false
        }
        return check
    }


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

        setSubmitInfo('Đang chờ thay đổi từ server...')
        setIsLoading(true)
        const response = await apis.apiChangeInfoAfterSignUp({
            token: token,
            name: name,
            file: file
        })
        setIsLoading(false)

        if (response?.data.code !== responseCodes.statusOK) {
            // setInvalidFields(prev => {
            //     const newFields = new Map(prev)
            //     newFields.set(invalidFieldsSubmit, "Không thể lưu thay đổi: " + response.data.message)

            //     return newFields
            // })
            console.log("error change info: " + JSON.stringify(response?.data))
            return Alert.alert("Error", "Lưu thay đổi không thành công")
        }

        Alert.alert("Success", "Lưu thay đổi thành công")
        dispatch(actions.getUserInfo({
            token,
            userId
        }))

        // setSubmitInfo('Lưu thay đổi thành công')

    }
    const handleChangePassword = async () => {
        setIsModalVisible(true)
    }

    const handleConfirmChangePassword = async () => {
        if (!newPassword) {
            setPasswordError("Mật khẩu không được để trống")
            return
        }
        console.log(token, password, newPassword)
        setPasswordError('')
        const response = await apis.apiChangePassword({
            token: token,
            old_password: password,
            new_password: newPassword
        })

        console.log(response)
        if (response?.data.code != 1000) {
            setPasswordError("Không thể đổi mật khẩu: " + response.data.message)
            return
        }

        setSubmitInfo('Đổi mật khẩu thành công')
        setIsModalVisible(false)
    }

    return (
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
            <ScrollView style={styles.container}>
                <Spinner
                    visible={isLoading}
                    textContent={''}
                    textStyle={{
                        color: '#FFF'
                    }}
                />
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
                    gap: 15,
                    marginVertical: 20,
                    paddingHorizontal: 10
                }}>
                    <TouchableOpacity
                        style={{
                            flex: 5,
                            backgroundColor: "#BB0000",
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 20,
                            paddingVertical: 10
                        }}
                        onPress={handleCancelChanges}>
                        <Text style={{
                            color: 'white',
                            fontWeight: 'bold',
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
                            borderRadius: 20,
                            paddingVertical: 10
                        }}
                        onPress={async () => {
                            await handleSaveChanges()
                        }}>
                        <Text style={{
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: 16
                        }}>
                            Lưu thay đổi
                        </Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.changePasswordButton} onPress={handleChangePassword}>
                    <Text style={styles.changePasswordText}>Đổi mật khẩu</Text>
                </TouchableOpacity>
                <Modal visible={isModalVisible} transparent={true} animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Đổi mật khẩu</Text>
                            <TextInput
                                placeholder="Nhập mật khẩu mới"
                                style={styles.modalInput}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry={true}
                            />
                            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity style={styles.modalButtonAccept} onPress={handleConfirmChangePassword}>
                                    <Text style={styles.modalButtonText}>Xác nhận</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalButtonReject} onPress={() => setIsModalVisible(false)}>
                                    <Text style={styles.modalButtonText}>Hủy</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                {submitInfo && <Text style={{
                    paddingHorizontal: 15,
                    fontStyle: 'italic',
                    color: 'green',
                    fontSize: 12
                }}> {submitInfo}</Text>}
            </ScrollView>
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
        fontSize: 14,
        fontWeight: '400',
        flex: 2
    },
    ItemValue: {
        paddingHorizontal: 10,
        paddingVertical: 15,
        fontSize: 16,
        fontWeight: '600',
        flex: 3
    },
    changePasswordButton: {
        backgroundColor: "#BB0000",
        alignItems: 'center',
        borderRadius: 20,
        paddingVertical: 10,
        maxWidth: 250,
        marginStart: 60,
        marginBottom: 15
    },
    changePasswordText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    },
    modalButtonContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    modalButtonReject: {
        backgroundColor: '#BB0000',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 5,
        minWidth: 150,
        alignItems: 'center'
    },
    modalButtonAccept: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 5,
        minWidth: 160,
        alignItems: 'center'
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center'
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    modalInput: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        width: '100%',
        marginTop: 10,
        borderRadius: 5
    },
})

export default ProfileScreen