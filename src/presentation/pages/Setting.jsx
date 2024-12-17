import { View, Text, TouchableOpacity, StyleSheet, Image, Modal,TextInput, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as actions from '../redux/actions'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { getDisplayedAvatar } from '../../utils/format'
import * as apis from '../../data/api/index'

const SettingScreen = () => {
    const dispatch = useDispatch()
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [newPassword, setNewPassword] = useState('')
    const [oldPassword, setOldPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const { userInfo } = useSelector(state => state.user)
    const avatarUri = getDisplayedAvatar(userInfo.avatar)
    const { isLoggedIn, msg, update, token, role, userId,password } = useSelector(state => state.auth)
    const [invalidFields, setInvalidFields] = useState([]);
    const [focusField, setFocusField] = useState('');
    const navigate = useNavigation()

    const handleChangePassword = async () => {
        setIsModalVisible(true)
        setNewPassword('');
        setOldPassword('')
        setInvalidFields([])
        setFocusField('')
    }
    
    const handleConfirmChangePassword = async () => {
        setInvalidFields([]);
        let invalids = validate({oldPassword,newPassword});
        if (invalids !== 0) {
            console.log(invalids);
            return;
        }
        if (!newPassword) {
            setPasswordError("Mật khẩu không được để trống")
            return
        }
        console.log(token, password, newPassword)
        setPasswordError('')
        const response = await apis.apiChangePassword({
            token: token,
            old_password: oldPassword,
            new_password: newPassword
        })

        console.log(response.data)
        if (response?.data.code !== '1000') {
            setPasswordError("Không thể đổi mật khẩu: " + response.data.message)
            return
        }
        setIsModalVisible(false)
        setShowSuccessMessage(true)
        setTimeout(() => {
            setShowSuccessMessage(false)
        }, 3000);

    }

    const rejectChangePassword = ()=>{
        setIsModalVisible(false)
        setPasswordError('')
    }
    const validate = ({oldPassword, newPassword}) => {
        let invalids = 0;
        // Tạo mảng lỗi mới (xóa lỗi cũ)
        let fields = Object.entries({oldPassword, newPassword});
        let newInvalidFields = [];
    
        fields.forEach(item => {
            if (item[1] === '') {
                newInvalidFields.push({ name: item[0], message: '❗️Không được bỏ trống !' });
                invalids++;
            }
        });
    
        fields.forEach(item => {
            switch (item[0]) {
                case 'oldPassword':
                    if (oldPassword !== password) {
                        newInvalidFields.push({ name: item[0], message: '❗️Mật khẩu cũ không chính xác !' });
                        invalids++;
                    }
                    break;
                case 'newPassword':
                    if (item[1].length < 6) {
                        newInvalidFields.push({ name: item[0], message: '❗️Mật khẩu phải có tối thiểu 6 ký tự !' });
                        invalids++;
                    }
                    break;
                default:
                    break;
            }
        });
    
        // Cập nhật lại mảng lỗi sau khi xác thực
        setInvalidFields(newInvalidFields);
        return invalids;
    };
    const [showHandleChangePassword, setShowHandleChangePassword] = useState(false)
    return (
        <ScrollView style={styles.cotainer}>
            {showSuccessMessage && (
                <View style={styles.toast}>
                    <Text style={styles.toastText}>Thay đổi mật khẩu thành công!</Text>
                </View>
            )}
            <TouchableOpacity style={{ flexDirection: 'row', gap: 10, borderColor: '#CCCCCC', borderWidth: 1, padding: 10, borderRadius: 8, elevation: 5, backgroundColor: 'white', alignItems: 'center' }}>
                <Image
                    source={avatarUri.length > 0 ? { uri: avatarUri } : require('../../../assets/default-avatar.jpg')}
                    style={{
                        width: 46,
                        height: 46,
                        borderRadius: 23,
                        borderWidth: 2,
                        borderColor: '#AA0000'
                    }}
                />
                <Text style={{ fontSize: 16, fontWeight: '500' }}>{userInfo.ho} {userInfo.ten}</Text>
            </TouchableOpacity>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image
                    source={require('../../../assets/logo-removebg-preview.png')}
                    style={{ width: 250, resizeMode: 'contain' }}
                />
            </View>
            <View style={{ gap: 10 }}>
                <View>
                    <TouchableOpacity style={{ flexDirection: 'row', borderTopWidth: 1, padding: 10, borderColor: 'gray', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <Icon name='question-circle' size={24} />
                            <Text style={{ fontSize: 16, fontWeight: '500', textAlign: 'center' }}>Trợ giúp & hỗ trợ</Text>
                        </View>
                        <Icon name='chevron-down' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setShowHandleChangePassword(!showHandleChangePassword) }}
                        style={{ flexDirection: 'row', borderTopWidth: 1, padding: 10, borderColor: 'gray', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <Icon name='gear' size={24} />
                            <Text style={{ fontSize: 16, fontWeight: '500', textAlign: 'center' }}>Cài đặt & quyền riêng tư</Text>
                        </View>
                        <Icon name='chevron-down' />
                    </TouchableOpacity>
                    {
                        showHandleChangePassword && <TouchableOpacity onPress={handleChangePassword}
                            style={{
                                paddingLeft: 40,
                                paddingBottom: 10,
                            }}>
                            <Text style={{ fontSize: 16, padding: 10, fontWeight: '500', backgroundColor: 'white', borderRadius: 8, elevation: 5 }}>Thay đổi mật khẩu của bạn</Text>
                        </TouchableOpacity>
                    }
                    <Modal visible={isModalVisible} transparent={true} animationType="slide">
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Đổi mật khẩu</Text>
                                <TextInput
                                    placeholder="Nhập mật khẩu cũ"
                                    style={[styles.modalInput, { borderColor: focusField === 'oldPassword' ? '#BB0000' : '#CCCCCC' }]}
                                    value={oldPassword}
                                    onChangeText={setOldPassword}
                                    onFocus={()=>{
                                        setFocusField('oldPassword');
                                        setInvalidFields([])
                                    }}
                                    secureTextEntry={true}
                                />
                                    {invalidFields.length > 0 && invalidFields.some(i => i.name === 'oldPassword') && (
                                        <Text style={{ paddingHorizontal: 15,color: 'red', fontSize: 12,marginTop:5 }}>
                                            {invalidFields.find(i => i.name === 'oldPassword')?.message}
                                        </Text>
                                    )}
                                <TextInput
                                    placeholder="Nhập mật khẩu mới"
                                    style={[styles.modalInput, { borderColor: focusField === 'newPassword' ? '#BB0000' : '#CCCCCC' }]}
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    onFocus={()=>{
                                        setInvalidFields([])
                                        setFocusField('newPassword');
                                    }}
                                    secureTextEntry={true}
                                />
                                    {invalidFields.length > 0 && invalidFields.some(i => i.name === 'newPassword') && (
                                        <Text style={{ paddingHorizontal: 15,color: 'red', fontSize: 12, marginTop:5 }}>
                                            {invalidFields.find(i => i.name === 'newPassword')?.message}
                                        </Text>
                                    )}
                                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                                <View style={styles.modalButtonContainer}>
                                    <TouchableOpacity style={styles.modalButtonAccept} onPress={handleConfirmChangePassword}>
                                        <Text style={styles.modalButtonText}>Xác nhận</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.modalButtonReject} onPress={rejectChangePassword}>
                                        <Text style={styles.modalButtonText}>Hủy</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <TouchableOpacity style={{ flexDirection: 'row', borderTopWidth: 1, padding: 10, borderColor: 'gray', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <Icon name='th-large' size={24} />
                            <Text style={{ fontSize: 16, fontWeight: '500', textAlign: 'center' }}>Quyền truy cập chuyên nghiệp</Text>
                        </View>
                        <Icon name='chevron-down' />
                    </TouchableOpacity>
                </View>
                <View style={{ gap: 5 }}>
                    <TouchableOpacity onPress={() => navigate.navigate('message')}
                        style={{ flexDirection: 'row', gap: 10, borderColor: '#CCCCCC', borderWidth: 1, padding: 10, borderRadius: 8, elevation: 5, backgroundColor: 'white' }}>
                        <Icon name='wechat' size={24} />
                        <Text style={{ fontSize: 16, fontWeight: '500', textAlign: 'center' }}>Trò chuyện</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', gap: 10, borderColor: '#CCCCCC', borderWidth: 1, padding: 10, borderRadius: 8, elevation: 5, backgroundColor: 'white' }}>
                        <Icon name='google' size={24} />
                        <Text style={{ fontSize: 16, fontWeight: '500', textAlign: 'center' }}>Google</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', gap: 10, borderColor: '#CCCCCC', borderWidth: 1, padding: 10, borderRadius: 8, elevation: 5, backgroundColor: 'white' }}>
                        <Icon name='yahoo' size={24} />
                        <Text style={{ fontSize: 16, fontWeight: '500', textAlign: 'center' }}>Yahoo</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{ borderColor: '#CCCCCC', borderWidth: 1, padding: 10, borderRadius: 8, elevation: 5, backgroundColor: 'gainsboro', marginTop:10 }}
                    onPress={() => {
                        dispatch(actions.logout())
                        navigate.navigate('auth')
                    }} >
                    <Text style={{ textAlign: 'center', fontWeight: '600', fontSize: 15, color: 'darked' }}>Đăng xuất</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    cotainer: {
        flex: 1,
        padding: 15,
        gap: 15,
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
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding:20,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        minHeight:300,
        flexDirection:'column',
        justifyContent:'space-around'
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    modalInput: {
        borderWidth: 1.5,
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        color: 'white',
        width:'100%',
        marginTop:20
    },
    errorText:{
        color:'red',
        fontSize:16
    },
    toast: {
        position: 'absolute',
        bottom: 15,
        left: 200,
        transform: [{ translateX: -150 }],
        width: 300,
        padding: 10,
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        alignItems: 'center',
        elevation: 10,
    },
    toastText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
})

export default SettingScreen