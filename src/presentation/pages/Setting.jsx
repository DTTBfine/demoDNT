import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as actions from '../redux/actions'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/FontAwesome'

const SettingScreen = () => {
    const dispatch = useDispatch()
    const { userInfo } = useSelector(state => state.user)
    const { isLoggedIn, msg, update, token, role, userId } = useSelector(state => state.auth)
    const navigate = useNavigation()
    return (
        <View style={styles.cotainer}>
            <TouchableOpacity style={{ flexDirection: 'row', gap: 10, borderColor: '#CCCCCC', borderWidth: 1, padding: 10, borderRadius: 8, elevation: 5, backgroundColor: 'white', alignItems: 'center' }}>
                <Image
                    source={require('../../../assets/default-avatar.jpg')}
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
                    <TouchableOpacity style={{ flexDirection: 'row', borderTopWidth: 1, padding: 10, borderColor: 'gray', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <Icon name='gear' size={24} />
                            <Text style={{ fontSize: 16, fontWeight: '500', textAlign: 'center' }}>Cài đặt & quyền riêng tư</Text>
                        </View>
                        <Icon name='chevron-down' />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', borderTopWidth: 1, padding: 10, borderColor: 'gray', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <Icon name='th-large' size={24} />
                            <Text style={{ fontSize: 16, fontWeight: '500', textAlign: 'center' }}>Quyền truy cập chuyên nghiệp</Text>
                        </View>
                        <Icon name='chevron-down' />
                    </TouchableOpacity>
                </View>
                <View style={{ gap: 5 }}>
                    <TouchableOpacity style={{ flexDirection: 'row', gap: 10, borderColor: '#CCCCCC', borderWidth: 1, padding: 10, borderRadius: 8, elevation: 5, backgroundColor: 'white' }}>
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
                <TouchableOpacity style={{ borderColor: '#CCCCCC', borderWidth: 1, padding: 10, borderRadius: 8, elevation: 5, backgroundColor: 'white' }}
                    onPress={() => {
                        dispatch(actions.logout())
                        navigate.navigate('auth')
                    }} >
                    <Text style={{ textAlign: 'center', fontWeight: '600', fontSize: 15, color: 'darked' }}>Đăng xuất</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cotainer: {
        flex: 1,
        padding: 15,
        justifyContent: 'space-between',
        gap: 15
    }
})

export default SettingScreen