import { View, Text, StyleSheet, Dimensions, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import FuncBox from '../../components/func';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../redux/actions'
import { convertVNDate, days, getDaysOfWeek } from '../../../utils/format';
import { useNavigation } from '@react-navigation/native';

const windowDimensions = Dimensions.get('window'); // Lấy kích thước của màn hình
const { width, height } = windowDimensions; // Đảm bảo rằng chúng ta truy cập đúng thuộc tính   

const StudentScreen = () => {
    const dispatch = useDispatch()
    const navigate = useNavigation()
    const { userInfo } = useSelector(state => state.user)
    const avatarLink = userInfo.avatar
    let avatarUri = ''
    if (avatarLink?.length > 0 && avatarLink.startsWith("https://drive.google.com")) {
        const fileId = avatarLink.split('/d/')[1].split('/')[0];
        avatarUri = `https://drive.google.com/uc?export=view&id=${fileId}`
    }
    const { isLoggedIn, msg, update, token, role, userId } = useSelector(state => state.auth)

    if (!userInfo) {
        return <Text>Loading...</Text>;
    }
    const [currentDate, setCurrentDate] = useState(new Date())
    const [showSchedule, setShowSchedule] = useState(true)

    return (
        <ScrollView>
            <View style={styles.infoBox}>
                <View style={{ flex: 1 }}>
                    <Image
                        source={avatarUri.length > 0 ? {uri: avatarUri} : require('../../../../assets/default-avatar.jpg')}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                        }}
                    />
                </View>
                <View style={{ flex: 4 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{`${userInfo.ho} ${userInfo.ten}`}</Text>
                    <Text style={{ fontSize: 13 }}> Sinh viên </Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Icon name='calendar' size={18} color="#BB0000" onPress={() => setShowSchedule(!showSchedule)} />
                </View>
            </View>
            {showSchedule && <View style={styles.scheduleBox}>
                <Text style={{ fontSize: 13 }}> {convertVNDate(currentDate)}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 15 }}>
                    {getDaysOfWeek(currentDate).map((item, index) => {
                        return (
                            <View key={index}>
                                <DateItem name={item.day} date={item.date} currentDate={currentDate} setCurrentDate={setCurrentDate} />
                            </View>
                        )
                    })}
                </View>
                <View style={{ borderTopWidth: 1, borderColor: 'gray', paddingVertical: 20 }}>
                    <Text style={{ color: '#CCCCCC', textAlign: 'center', fontSize: 13 }}>Không có lịch</Text>
                </View>
            </View>}
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
                    routeName='testUI'
                />
            </View>
        </ScrollView>
    )
}

const DateItem = ({ name, date, currentDate, setCurrentDate }) => {
    const isSelected = currentDate.toDateString() === date.toDateString();
    return (
        <TouchableOpacity onPress={() => setCurrentDate(date)}
            style={{ alignItems: 'center', gap: 5 }}>
            <Text style={{ color: 'gray', fontSize: 13 }}>{name}</Text>
            <View style={{ width: 36, height: 36, backgroundColor: isSelected ? '#AA0000' : '#EEEEEE', alignItems: 'center', justifyContent: 'center', borderRadius: 18 }}>
                <Text style={{ textAlign: 'center', color: isSelected ? 'white' : 'black' }}>{date.getDate()}</Text>
            </View>
        </TouchableOpacity>
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
        alignItems: 'center',
        marginBottom: 15
    },
    scheduleBox: {
        backgroundColor: "white",
        borderRadius: 15,
        margin: 20,
        padding: 15,
        borderBottomWidth: 1,
        borderColor: '#CCCCCC',
        elevation: 5,
    },
    funcList: {
        flex: 2,
        marginTop: 10,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
});

export default StudentScreen