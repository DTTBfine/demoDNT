import { View, Text, ScrollView, StyleSheet, Dimensions, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import AssignmentItem from '../components/assignmentItem'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon5 from 'react-native-vector-icons/FontAwesome5'
import { useNavigation } from '@react-navigation/native'
import * as actions from '../redux/actions'
import { getIconForFileType } from '../../utils/format'

const windowDimensions = Dimensions.get('window'); // Lấy kích thước của màn hình
const { width, height } = windowDimensions; // Đảm bảo rằng chúng ta truy cập đúng thuộc tính

const ClassScreen = ({ route }) => {
    const { id, name, type, tabName } = route.params
    const [currentTab, setCurrentTab] = useState(tabName)
    const { token, userId, role } = useSelector(state => state.auth)
    const { currentClass } = useSelector(state => state.learning)
    const dispatch = useDispatch()
    const [loadData, setLoadData] = useState(true)

    console.log(JSON.stringify(currentClass))
    console.log('token, id: ' + token + ' ' + userId)

    useEffect(() => {
        if (loadData) {
            dispatch(actions.getClassInfo({
                token: token,
                role: role,
                account_id: userId,
                class_id: id
            }))
            dispatch(actions.getMaterialList({
                token: token,
                class_id: id
            }))
            dispatch(actions.getAllSurveys({
                token: token,
                class_id: id
            }))
            setLoadData(false)
        }
    }, [])

    return (
        <View style={styles.cotainer}>
            <View style={{
                flexDirection: 'row',
                borderBottomWidth: 1,
                borderColor: '#DDDDDD'
            }}>
                <View style={[styles.tabItem, currentTab === "Chung" && styles.tabActive]}>
                    <Text onPress={() => setCurrentTab('Chung')}
                        style={[styles.tabName, currentTab === "Chung" && styles.tabNameActive]}>Chung</Text>
                    {currentTab === "Chung" && <Icon name='circle' color="#BB0000" size={8} style={styles.circleActive} />}
                </View>
                <View style={[styles.tabItem, currentTab === "Bài tập" && styles.tabActive]}>
                    <Text onPress={() => setCurrentTab('Bài tập')}
                        style={[styles.tabName, currentTab === "Bài tập" && styles.tabNameActive]}>Bài tập</Text>
                    {currentTab === "Bài tập" && <Icon name='circle' color="#BB0000" size={8} style={styles.circleActive} />}
                </View>
                <View style={[styles.tabItem, currentTab === "Tài liệu" && styles.tabActive]}>
                    <Text onPress={() => setCurrentTab('Tài liệu')}
                        style={[styles.tabName, currentTab === "Tài liệu" && styles.tabNameActive]}>Tài liệu</Text>
                    {currentTab === "Tài liệu" && <Icon name='circle' color="#BB0000" size={8} style={styles.circleActive} />}
                </View>
            </View>
            <View style={{ height: height - 80, paddingVertical: 10 }}>
                {currentTab === 'Chung' && <About class_id={id} class_type={type} />}
                {currentTab === 'Bài tập' && <UpcomingSurvey class_id={id} />}
                {currentTab === 'Tài liệu' && <MaterialList />}
            </View>
        </View>
    )
}

const About = ({ class_id, class_type }) => {
    const { role } = useSelector(state => state.user)
    const { currentClass } = useSelector(state => state.learning)

    return (
        <ScrollView>
            <View style={{ padding: 10, alignItems: 'center' }}>
                <View style={{ paddingVertical: 10, paddingHorizontal: 15, width: width - 50, backgroundColor: 'white', borderWidth: 1, borderColor: '#BBBBBB', borderRadius: 15 }}>
                    <View style={{}}>
                        <Text style={{ fontSize: 16, fontWeight: '600', paddingVertical: 10 }}>{currentClass?.class_id} - {currentClass?.class_name}</Text>
                    </View>
                    <View style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#EEEEEE', paddingVertical: 10 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, paddingVertical: 5 }}>
                                <Text style={{ color: 'gray' }}>Mã lớp :</Text>
                            </View>
                            <View style={{ flex: 1, paddingVertical: 5 }}>
                                <Text style={{ color: 'gray' }}>{class_id} </Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, paddingVertical: 5 }}>
                                <Text style={{ color: 'gray' }}>Loại hình :</Text>
                            </View>
                            <View style={{ flex: 1, paddingVertical: 5 }}>
                                <Text style={{ color: 'gray' }}>{class_type} </Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, paddingVertical: 5 }}>
                                <Text style={{ color: 'gray' }}>GVHD :</Text>
                            </View>
                            <View style={{ flex: 1, paddingVertical: 5 }}>
                                <Text style={{ color: 'deepskyblue', textDecorationLine: 'underline' }}>{currentClass?.lecturer_name}</Text>
                            </View>
                        </View>
                        {role === 'STUDENT' && <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, paddingVertical: 5 }}>
                                <Text style={{ color: 'gray' }}>Số lần vắng :</Text>
                            </View>
                            <View style={{ flex: 1, paddingVertical: 5 }}>
                                <Text style={{ color: 'gray' }}>Gọi api lấy info </Text>
                            </View>
                        </View>}
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, paddingVertical: 5 }}>
                                <Text style={{ color: 'gray' }}>Số sinh viên :</Text>
                            </View>
                            <View style={{ flex: 1, paddingVertical: 5 }}>
                                <Text style={{ color: 'gray' }}>{currentClass?.student_count} </Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, paddingVertical: 5 }}>
                                <Text style={{ color: 'gray' }}>Hình thức :</Text>
                            </View>
                            <View style={{ flex: 1, paddingVertical: 5 }}>
                                <Text style={{ color: 'gray' }}>Offline </Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, paddingVertical: 5 }}>
                                <Text style={{ color: 'gray' }}>Trạng thái lớp :</Text>
                            </View>
                            <View style={{ flex: 1, paddingVertical: 5 }}>
                                <Text style={{ color: 'gray' }}>{currentClass?.status} </Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ paddingBottom: 10 }}>
                        <Text style={{ fontSize: 16, fontWeight: '600', paddingVertical: 10 }}>Thời khóa biểu</Text>
                        <Text>Bắt đầu từ {currentClass?.start_date} đến {currentClass?.end_date} </Text>
                    </View>
                </View>
            </View>

            <View style={{ paddingVertical: 15 }}>
                <View>
                    <Text style={{ fontSize: 16, fontWeight: '600', paddingVertical: 5, paddingHorizontal: 15 }}>Danh sách lớp ({currentClass?.student_count})</Text>
                </View>
                <View style={{}}>
                    {currentClass?.student_count === '0' && <Text style={{ textAlign: 'center', color: 'gray', paddingTop: 10 }}>Lớp hiện chưa có sinh viên đăng ký</Text>}
                    {currentClass?.student_count > 0 &&
                        <View>
                            {
                                currentClass.student_accounts.map((item, index) => {
                                    return (
                                        <View key={index}>
                                            <StudentInfo first_name={item.first_name} last_name={item.last_name} email={item.email} />

                                        </View>
                                    )
                                })
                            }
                        </View>}
                </View>
            </View>
        </ScrollView>
    )
}

const StudentInfo = ({ first_name, last_name, email }) => {
    return (
        <View style={{ flexDirection: 'row', gap: 10, padding: 15, borderBottomWidth: 1, borderColor: '#DDDDDD' }}>
            <Image
                source={require('../../../assets/default-avatar.jpg')}
                style={{
                    width: 38,
                    height: 38,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: '#AA0000'
                }}
            />
            <View>
                <Text style={{ fontSize: 16, fontWeight: '400' }}> {first_name} {last_name} </Text>
                <Text style={{ fontSize: 14, color: 'gray' }}> {email} </Text>
            </View>
        </View>
    )
}

const UpcomingSurvey = ({ class_id }) => {
    const navigate = useNavigation()
    const { role } = useSelector(state => state.auth)
    const { surveyOfCurrentClass } = useSelector(state => state.learning)
    return (
        <View style={{ marginBottom: 35 }}>
            {surveyOfCurrentClass.length === 0 && <Text style={{ textAlign: 'center', color: 'gray', paddingTop: 10 }}>Lớp hiện chưa có bài kiểm tra!</Text>}
            <ScrollView>
                {
                    surveyOfCurrentClass.length > 0 && surveyOfCurrentClass.map((item, index) => {
                        return (
                            <View key={index} >
                                <AssignmentItem item={item} />
                            </View>
                        )
                    })
                }
            </ScrollView>
            {role === 'LECTURER' && <View style={{
                position: 'absolute',
                top: 600,
                right: 30,
                backgroundColor: '#AA0000',
                width: 50,
                height: 50,
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Icon name="plus" color='white' size={40}
                    onPress={() => {
                        navigate.navigate("addSurvey", { class_id: class_id })
                    }}
                />
            </View>}
        </View>
    )
}

const MaterialList = () => {
    const { classMaterial } = useSelector(state => state.learning)

    return (
        <View style={{
            marginBottom: 20
        }}>
            {classMaterial.length === 0 && <Text style={{ textAlign: 'center', color: 'gray', paddingTop: 10 }}>Tài liệu lớp trống !</Text>}
            <ScrollView >
                {
                    classMaterial?.length > 0 && classMaterial.map((item, index) => {
                        return (
                            <View key={index}>
                                <MaterialBox material_name={item.material_name} description={item.description} material_link={item.material_link} material_type={item.material_type} />
                            </View>
                        )
                    })
                }
            </ScrollView>
        </View>
    )
}

const MaterialBox = ({ material_name, description, material_link, material_type }) => {
    return (
        <View style={{
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderColor: '#CCCCCC',
            backgroundColor: 'white',
            elevation: 5,
            padding: 15,
            borderRadius: 15,
            alignItems: 'center',
            justifyContent: 'space-between',
            marginVertical: 10,
            marginHorizontal: 20
        }}>
            <View style={{
                flexDirection: 'row',
                gap: 15,
                alignItems: 'center',
            }}>
                <View>
                    <Icon name={getIconForFileType(material_type)} color='#BB0000' size={30} />
                </View>
                <View>
                    <Text style={{ fontSize: 16, fontWeight: '500' }}>{material_name}</Text>
                    <Text style={{ color: 'gray' }}>{description}</Text>
                </View>
            </View>
            <View>
                <Icon5 name='ellipsis-h' color='#BB0000' size={22} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cotainer: {
        flexDirection: 'column'
    },
    tabItem: {
        flex: 1,
        backgroundColor: '#EEEEEE',
    },
    tabActive: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderTopWidth: 3,
        borderColor: 'cornflowerblue',
    },
    tabName: {
        fontWeight: '500',
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
        padding: 10,
        fontWeight: 14,
        paddingBottom: 15
    },
    tabNameActive: {
        color: 'black',
        fontWeight: '700',
    },
    circleActive: {
        textAlign: 'center',
        position: 'absolute',
        top: 35
    }
})

export default ClassScreen