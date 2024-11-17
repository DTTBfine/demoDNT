import { View, Text, StyleSheet, Dimensions, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import FuncBox from '../../components/func';
import { useSelector } from 'react-redux';
import { convertVNDate, days } from '../../../utils/format';

const windowDimensions = Dimensions.get('window'); // Lấy kích thước của màn hình
const { width, height } = windowDimensions; // Đảm bảo rằng chúng ta truy cập đúng thuộc tính   

const TeacherScreen = () => {
    const { userInfo } = useSelector(state => state.user)
    const [date, setDate] = useState(new Date())
    const [showSchedule, setShowSchedule] = useState(true)

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
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{`${userInfo.ho} ${userInfo.ten}`} </Text>
                    <Text style={{ fontSize: 13 }}>Giảng viên</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Icon name='calendar' size={18} color="#BB0000" onPress={() => setShowSchedule(!showSchedule)} />
                </View>
            </View>
            {showSchedule && <View style={styles.scheduleBox}>
                <Text style={{ fontSize: 13 }}> {convertVNDate(date)}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 15 }}>
                    {days.map((item) => {
                        return (
                            <View key={item.id}>
                                <DateItem name={item.engName} date={'16'} />
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
                    routeName='teacherClassList'
                />
            </View>
        </ScrollView>
    )
}

const DateItem = ({ name, date }) => {
    return (
        <View style={{ alignItems: 'center', gap: 5 }}>
            <Text style={{ color: 'gray', fontSize: 13 }}>{name}</Text>
            <View style={{ width: 36, height: 36, backgroundColor: '#DDDDDD', alignItems: 'center', justifyContent: 'center', borderRadius: 18 }}>
                <Text style={{ textAlign: 'center' }}>{date}</Text>
            </View>
        </View>
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

export default TeacherScreen