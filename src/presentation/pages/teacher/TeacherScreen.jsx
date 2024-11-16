import { View, Text, StyleSheet, Dimensions, ScrollView, Image } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import FuncBox from '../../components/func';
import { useSelector } from 'react-redux';

const windowDimensions = Dimensions.get('window'); // Lấy kích thước của màn hình
const { width, height } = windowDimensions; // Đảm bảo rằng chúng ta truy cập đúng thuộc tính   

const TeacherScreen = () => {
    const { userInfo } = useSelector(state => state.user)

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
                    <Icon name='calendar' size={18} color="#BB0000" />
                </View>
            </View>
            <View style={styles.scheduleBox}>
                <Text> Thời khóa biểu</Text>
            </View>
            <View style={styles.funcList}>
                <FuncBox
                    iconName='group'
                    name='Lớp học'
                    infor='Quản lý lớp học, tạo và chỉnh sửa lớp học'
                    routeName='classNavigationForTeacher'
                />
                <FuncBox
                    iconName='flask'
                    name='Bài tập'
                    infor='Tạo và quản lý bài tập'
                    routeName='survey'
                />
                <FuncBox
                    iconName='bell-o'
                    name='Điểm danh'
                    infor='Điểm danh sinh viên'
                    routeName='survey'
                />
                <FuncBox
                    iconName='folder-open-o'
                    name='Tài liệu'
                    infor='Tài liệu học tập'
                    routeName='survey'
                />
                <FuncBox
                    iconName='newspaper-o'
                    name='Thông báo tin tức'
                    infor='Các thông báo quan trọng'
                    routeName='survey'
                />
                <FuncBox
                    iconName='bar-chart'
                    name='Khảo sát'
                    infor='Khảo sát và form'
                    routeName='survey'
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

export default TeacherScreen