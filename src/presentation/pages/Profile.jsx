import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Icon from 'react-native-vector-icons/AntDesign'
import * as DocumentPicker from 'expo-document-picker';

const ProfileScreen = () => {
    const { userInfo } = useSelector(state => state.user)
    const [file, setFile] = useState({})
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
                setFile(result.assets[0])
            }
        } catch (err) {
            console.error('Error picking iamge:', err);
        }
    }

    return (
        <View style={styles.container}>
            <View style={{ alignItems: 'center' }}>
                <View style={{}}>
                    <Image
                        source={file ? { uri: file.uri } : require('../../../assets/default-avatar.jpg')}
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
                </View>
                <View style={{ padding: 15 }}>
                    <Text style={{ textAlign: 'center', fontSize: 24, fontWeight: '600' }}>{userInfo.ho} {userInfo.ten} </Text>
                </View>
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
        </View>
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