import { View, Text, StyleSheet, Dimensions, ScrollView, Image, TouchableOpacity, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import FuncBox from '../../components/func';
import { useDispatch, useSelector } from 'react-redux';
import { convertVNDate, days, getDaysOfWeek, getDisplayedAvatar } from '../../../utils/format';
import * as actions from '../../redux/actions'

const windowDimensions = Dimensions.get('window'); // Lấy kích thước của màn hình
const { width, height } = windowDimensions; // Đảm bảo rằng chúng ta truy cập đúng thuộc tính   

const TeacherScreen = () => {
    const dispatch = useDispatch()
    const { token } = useSelector(state => state.auth)
    const { userInfo } = useSelector(state => state.user)
    const [currentDate, setCurrentDate] = useState(new Date())
    const [showSchedule, setShowSchedule] = useState(true)
    const [avatarUri, setAvatarUri] = useState('')
    const [refreshing, setRefreshing] = useState(false)

    useEffect(() => {
        uri = getDisplayedAvatar(userInfo.avatar)
        setAvatarUri(uri)
    }, [userInfo])

    const handleRefresh = () => {
        setRefreshing(true)
        dispatch(actions.getUserInfo({
            token: token,
            userId: userInfo.id
        }))
        setTimeout(() => {
            setRefreshing(false)
        }, 500);
    }

    // console.log("user info: " + JSON.stringify(userInfo))

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />
            }
        >
            <View style={styles.infoBox}>
                <View style={{ flex: 1 }}>
                    <Image
                        source={avatarUri.length > 0 ? { uri: avatarUri } : require('../../../../assets/default-avatar.jpg')}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                        }}
                    />
                </View>
                <View style={{}}>
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
                    iconName='group'
                    name='Lớp học'
                    infor='Tạo và chỉnh sửa lớp học'
                    routeName='classNavigationForTeacher'
                />
                <FuncBox
                    iconName='flask'
                    name='Lớp học'
                    infor='Quản lý giảng dạy lớp học'
                    routeName='teacherClassList'
                />
                <FuncBox
                    iconName='newspaper-o'
                    name='Thông báo tin tức'
                    infor='Các thông báo quan trọng'
                    routeName='teacherClassList'
                />
                <FuncBox
                    iconName='bar-chart'
                    name='Khảo sát'
                    infor='Khảo sát và form'
                    routeName='openClasses'
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
        marginHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        justifyContent: 'space-between'
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

export default TeacherScreen