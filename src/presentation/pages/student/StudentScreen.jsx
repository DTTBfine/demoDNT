import { View, Text, StyleSheet, Dimensions, ScrollView, Image } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import FuncBox from '../../components/func';

const windowDimensions = Dimensions.get('window'); // Lấy kích thước của màn hình
const { width, height } = windowDimensions; // Đảm bảo rằng chúng ta truy cập đúng thuộc tính   

const StudentScreen = () => {
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
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}> Nguyễn Văn A </Text>
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
                    routeName='class'
                />
                <FuncBox
                    iconName='bar-chart'
                    name='Khảo sát'
                    infor='Khảo sát và form'
                    routeName='class'
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