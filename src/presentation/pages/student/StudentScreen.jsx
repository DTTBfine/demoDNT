import { View, Text, StyleSheet, Dimensions, ScrollView, Image } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import FuncBox from '../../components/func';
import { useState, useEffect } from 'react';
import { getValue } from '../../../utils/localStorage';
import { getUserInfoRequest } from '../../../data/api/user';
import { responseCodes } from '../../../utils/constants/responseCodes';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';


const windowDimensions = Dimensions.get('window'); // Lấy kích thước của màn hình
const { width, height } = windowDimensions; // Đảm bảo rằng chúng ta truy cập đúng thuộc tính   


const getUserInfo = async () => {
    const [token, user_id] = await Promise.all([
        getValue('token'),
        getValue('userId')
    ]);
    const payload = {
        token: token,
        user_id: user_id
    }


    const response = await getUserInfoRequest(payload);
    const code = response.data.code;
    if (!code) {
        return console.error('failed to get user info with status code: ' + response.status);
    }

    if (code !== responseCodes.statusOK) {
        return console.error("failed to get user info: " + response.data.message);
    }

    return response.data.data;

}

const StudentScreen = () => {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const data = await getUserInfo();
                setUserInfo(data);
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        fetchUserInfo();
    }, []);
    if (!userInfo) {
        return <Text>Loading...</Text>;
    }

    return (
        <ScrollView>
            <View style={styles.infoBox}>
                <View style={{ flex: 1 }}>
                    <Image
                        source={require('../../../../assets/default-avatar.jpg')}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                        }}
                    />
                </View>
                <View style={{ flex: 4 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{`${userInfo.ho} ${userInfo.ten}`}</Text>
                    <Text style={{ fontSize: 13 }}>CNTT: Khoa học máy tính</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Icon name='calendar' size={18} color="#BB0000" />
                </View>
            </View>
            <View style={styles.scheduleBox}>
                <Text> Thời khóa biểu</Text>
            </View>
            <View style={styles.funcList}>
                <FuncBox
                    iconName='user-plus'
                    name='Đăng ký'
                    infor='Đăng ký lớp học'
                    routeName='registerClass'
                />
                <FuncBox
                    iconName='group'
                    name='Lớp học'
                    infor='Thông tin các lớp của sinh viên'
                    routeName='classNavigationForStudent'
                />
                <FuncBox
                    iconName='flask'
                    name='Bài tập'
                    infor='Thông tin về các bài tập'
                    routeName='assignment'
                />
                <FuncBox
                    iconName='newspaper-o'
                    name='Thông báo tin tức'
                    infor='Các thông báo quan trọng'
                    routeName='classNavigationForStudent'
                />
                <FuncBox
                    iconName='bar-chart'
                    name='Khảo sát'
                    infor='Khảo sát và form'
                    routeName='classNavigationForStudent'
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    infoBox: {
        width: '100%',
        marginHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    scheduleBox: {
        backgroundColor: "white",
        borderRadius: 15,
        height: 100,
        margin: 20,
        padding: 15
    },
    funcList: {
        flex: 2,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
});

export default StudentScreen