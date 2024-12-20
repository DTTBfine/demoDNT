import { View, Text, ScrollView, StyleSheet, Dimensions, Image, TouchableOpacity, Modal, Pressable, Linking, Alert, FlatList, RefreshControl, TextInput } from 'react-native'
import React, { act, createContext, useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon5 from 'react-native-vector-icons/FontAwesome5'
import IconA from 'react-native-vector-icons/AntDesign'
import IconFe from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native'
import * as actions from '../redux/actions'
import { convertVNDate, getColorForId, getIconForFileType } from '../../utils/format'
import ConfirmModal from '../components/ConfirmModal'
import * as apis from '../../data/api'
import { responseCodes } from '../../utils/constants/responseCodes'
import Spinner from 'react-native-loading-spinner-overlay'
import AddStudentModal from '../components/AddStudentModal'
import { assignmentStatus } from '../../utils/constants'

const windowDimensions = Dimensions.get('window'); // Lấy kích thước của màn hình
const { width, height } = windowDimensions; // Đảm bảo rằng chúng ta truy cập đúng thuộc tính

const GlobalContext = createContext()

const ClassScreen = ({ route }) => {
    const { id, name, type, tabName } = route.params
    const [currentTab, setCurrentTab] = useState(tabName)
    const { token, userId, role } = useSelector(state => state.auth)
    const { classInfo } = useSelector(state => state.learning)
    const dispatch = useDispatch()
    const navigate = useNavigation()
    const [loadData, setLoadData] = useState(true)

    const [isLoading, setIsLoading] = useState(false)
    const [loadingText, setLoadingText] = useState('Loading...')

    const [showAddStudent, setShowAddStudent] = useState(false)
    // console.log("show add student " + showAddStudent)

    const [currentSurvey, setCurrentSurvey] = useState(null)
    const [showSurveyInfo, setShowSurveyInfo] = useState(false)

    const [currentMaterial, setCurrentMaterial] = useState(null)
    const [showMaterialHandle, setShowMaterialHandle] = useState(false)

    useEffect(() => {
        if (loadData) {
            if (role === 'LECTURER') {
                dispatch(actions.getAllSurveys({
                    token: token,
                    class_id: id
                }))
            } else {
                dispatch(actions.getBasicClassInfo({
                    token: token,
                    class_id: id
                }))
                dispatch(actions.getUpcomingAssigments({
                    token: token,
                    type: assignmentStatus.upcoming,
                    class_id: id
                }))
                dispatch(actions.getAttendanceRecord({
                    token: token,
                    class_id: id
                }))
            }

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

            setLoadData(false)
        }
    }, [])

    const [showConfirmModal, setShowConfirmModal] = useState(false)

    const handleDeleteSurvey = async () => {
        //Xử lý ở đây
        setShowConfirmModal(false)
        const response = await apis.apiDeleteSurvey({
            token: token,
            survey_id: currentSurvey.id
        })

        if (response?.data?.meta?.code !== responseCodes.statusOK) {
            Alert.alert("Error", response?.data?.data || "Không thể xóa bài tập")
        } else {
            Alert.alert("Success", response?.data?.meta?.message || "Xóa bài tập thành công")
            setCurrentSurvey(null)
            dispatch(actions.getAllSurveys({
                token: token,
                class_id: id
            }))
        }
    }

    const handleDeleteMateria = async () => {
        setShowConfirmModal(false)
        const response = await apis.apiDeleteMaterial({
            token: token,
            material_id: currentMaterial.id
        })


        if (response?.data?.code !== responseCodes.statusOK) {
            Alert.alert("Error", response?.data?.data || "Không thể xóa tài liệu")
        } else {
            Alert.alert("Success", "Xóa tài liệu thành công")
            setCurrentMaterial(null)
            dispatch(actions.getMaterialList({
                token: token,
                class_id: id
            }))
        }


    }

    return (
        <View style={styles.cotainer}>
            <Spinner
                visible={isLoading}
                textContent={loadingText}
                textStyle={{
                    color: '#FFF'
                }}
            />
            <GlobalContext.Provider value={{ showAddStudent, setShowAddStudent, currentSurvey, setCurrentSurvey, showSurveyInfo, setShowSurveyInfo, currentMaterial, setCurrentMaterial, showMaterialHandle, setShowMaterialHandle }} >
                {
                    showAddStudent && (
                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={showAddStudent}
                            onRequestClose={() => setShowSurveyInfo(false)}
                        >
                            <Pressable style={styles.modalBackground} onPress={() => { }}>
                                <View style={[styles.modalContainer, { padding: 10 }]}>
                                    <TouchableOpacity onPress={() => {
                                        setShowAddStudent(false)
                                    }}
                                        style={{ flexDirection: 'row', gap: 5, marginBottom: 10, paddingBottom: 5, borderBottomWidth: 1, borderColor: '#CCCCCC' }}>
                                        <Icon5 name='angle-left' color='gray' size={18} />
                                        <Text style={{ color: 'gray', fontWeight: '500' }}>Trở lại</Text>
                                    </TouchableOpacity>
                                    <AddStudentModal showAddStudent={showAddStudent} setShowAddStudent={setShowAddStudent} class_id={id} />
                                </View>
                            </Pressable>
                        </Modal>
                    )
                }
                {
                    currentSurvey && (
                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={showSurveyInfo}
                            onRequestClose={() => setShowSurveyInfo(false)}
                        >
                            <Pressable style={styles.modalBackground} onPress={() => { }}>
                                <View style={styles.modalContainer} >
                                    <TouchableOpacity onPress={() => {
                                        setShowSurveyInfo(false)
                                        setCurrentSurvey(null)
                                    }}
                                        style={{ flexDirection: 'row', gap: 5, marginBottom: 10, paddingBottom: 5, borderBottomWidth: 1, borderColor: '#CCCCCC' }}>
                                        <Icon5 name='angle-left' color='gray' size={18} />
                                        <Text style={{ color: 'gray', fontWeight: '500' }}>Trở lại</Text>
                                    </TouchableOpacity>
                                    <Text style={{
                                        fontSize: 24,
                                        fontWeight: '500',
                                        marginBottom: 10,
                                    }}>{currentSurvey.title}</Text>
                                    <Text style={{ textAlign: 'right', fontStyle: 'italic', color: 'gray', fontSize: 13 }}>Hạn nộp: {convertVNDate(currentSurvey.deadline)}</Text>
                                    <View style={{ paddingVertical: 15, gap: 15 }}>
                                        <Text>
                                            <Text style={{ fontWeight: '500' }}>Mô tả: </Text>
                                            {currentSurvey.description && <Text style={{ padding: 5 }}>{currentSurvey.description}</Text>}
                                        </Text>
                                        <Text numberOfLines={1} ellipsizeMode="tail">
                                            <Text style={{ fontWeight: '500' }}>File mô tả: </Text>
                                            {currentSurvey.file_url &&
                                                <Text onPress={() => {
                                                    setShowSurveyInfo(false)
                                                    console.log("open file in drive")
                                                    Linking.openURL(currentSurvey.file_url).catch(err => console.error("Failed to open URL: ", err))
                                                }}
                                                    style={{
                                                        zIndex: 100,
                                                        color: 'dodgerblue',
                                                        textDecorationLine: 'underline'
                                                    }}
                                                >{currentSurvey.file_url}
                                                </Text>
                                            }
                                        </Text>
                                    </View>
                                    {
                                        role === 'LECTURER' && <View style={styles.row}>
                                            <TouchableOpacity onPress={() => setShowConfirmModal(true)}
                                                style={styles.button}
                                            >
                                                <Text style={styles.buttonText}>Xóa</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => {
                                                setShowSurveyInfo(false)
                                                navigate.navigate("editSurvey", { currentSurvey })
                                            }}
                                                style={styles.button}
                                            >
                                                <Text style={styles.buttonText}>Chỉnh sửa</Text>
                                            </TouchableOpacity>
                                        </View>
                                    }
                                    {
                                        role === 'STUDENT' && <TouchableOpacity onPress={() => {
                                            setShowSurveyInfo(false)
                                            console.log('navigate to submit survey')
                                            const { id, title, description, file_url, deadline } = currentSurvey
                                            navigate.navigate("submitSurvey", { id, title, description, file_url, deadline })
                                        }}
                                            style={{
                                                backgroundColor: '#CC0000',
                                                paddingVertical: 8,
                                                borderRadius: 15,
                                                alignItems: 'center',
                                                margin: 10,
                                            }}>
                                            <Text style={styles.buttonText}>Nộp bài</Text>
                                        </TouchableOpacity>
                                    }
                                    {
                                        role === 'LECTURER' && <TouchableOpacity
                                            onPress={() => {
                                                setShowSurveyInfo(false)
                                                navigate.navigate("surveyResponse", { currentSurvey })
                                            }}
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'flex-end',
                                                gap: 10,
                                                alignItems: 'center',
                                                marginTop: 10,
                                                padding: 10
                                            }}
                                        >
                                            <Text style={{ color: 'gray' }}>Đi tới danh sách trả lời</Text>
                                            <Icon5 name='angle-right' color='gray' size={24} />
                                        </TouchableOpacity>
                                    }
                                </View>
                            </Pressable>
                        </Modal>
                    )
                }
                {
                    currentMaterial && (
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={showMaterialHandle}
                            onRequestClose={() => setShowMaterialHandle(false)}
                        >
                            <Pressable style={{
                                flex: 1,
                                justifyContent: 'flex-end',
                                backgroundColor: 'rgba(0, 0, 0, 0.3)'

                            }}>
                                <View style={{
                                    zIndex: 1,
                                    backgroundColor: '#fff',
                                    paddingHorizontal: 20,
                                    paddingVertical: 15,
                                    borderTopLeftRadius: 15,
                                    borderTopRightRadius: 15
                                }}>
                                    <Text style={{
                                        textAlign: 'center',
                                        fontWeight: '500',
                                        fontSize: 20
                                    }}>{currentMaterial.material_name}
                                    </Text>

                                    <TouchableOpacity onPress={() => {
                                        Linking.openURL(currentMaterial.material_link).catch(err => console.error("Failed to open URL: ", err))
                                    }}
                                        style={{ flexDirection: 'row', gap: 15, padding: 10, alignItems: 'center' }}>
                                        <IconFe name='external-link' size={20} color='gray' />
                                        <Text style={{ fontSize: 16, fontWeight: '400' }}>Mở</Text>
                                    </TouchableOpacity>
                                    {role === 'LECTURER' && <TouchableOpacity onPress={() => {
                                        setShowMaterialHandle(false)
                                        navigate.navigate('editMaterial', { currentMaterial })
                                    }}
                                        style={{ flexDirection: 'row', gap: 15, padding: 10, alignItems: 'center' }}>
                                        <IconFe name='edit-3' size={20} color='gray' />
                                        <Text style={{ fontSize: 16, fontWeight: '400' }}>Chỉnh sửa</Text>
                                    </TouchableOpacity>}
                                    {role === 'LECTURER' && <TouchableOpacity onPress={() => { setShowConfirmModal(true) }}
                                        style={{ flexDirection: 'row', gap: 15, padding: 10, alignItems: 'center' }}>
                                        <IconFe name='trash-2' size={20} color='gray' />
                                        <Text style={{ fontSize: 16, fontWeight: '400' }}>Xóa</Text>
                                    </TouchableOpacity>}
                                    <TouchableOpacity onPress={() => {
                                        setShowMaterialHandle(false)
                                        setCurrentMaterial(null)
                                    }}
                                        style={{ flexDirection: 'row', gap: 15, padding: 10, alignItems: 'center' }}>
                                        <IconA name='close' size={20} color='gray' />
                                        <Text style={{ fontSize: 16, fontWeight: '400' }}>Đóng</Text>
                                    </TouchableOpacity>
                                </View>
                            </Pressable>
                        </Modal>
                    )
                }
                {
                    currentSurvey && showConfirmModal && <ConfirmModal handleName={"Xóa"} handleFunction={handleDeleteSurvey} showConfirmModal={showConfirmModal} setShowConfirmModal={setShowConfirmModal} />
                }
                {
                    currentMaterial && showConfirmModal && <ConfirmModal handleName={"Xóa"} handleFunction={handleDeleteMateria} showConfirmModal={showConfirmModal} setShowConfirmModal={setShowConfirmModal} />
                }
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
                    {currentTab === 'Bài tập' && <UpcomingSurvey class_id={id} setIsLoading={setIsLoading} dispatch={dispatch} />}
                    {currentTab === 'Tài liệu' && <MaterialList setIsLoading={setIsLoading} dispatch={dispatch} class_id={id} />}
                </View>
            </GlobalContext.Provider>
        </View>
    )
}

const About = ({ class_id, class_type }) => {
    const { showAddStudent, setShowAddStudent } = useContext(GlobalContext)
    const dispatch = useDispatch()
    const [initData, setInitData] = useState(true)
    const [classInfo, setClassInfo] = useState({})
    const [loadingTrigger, setLoadingTrigger] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { role, token } = useSelector(state => state.auth)
    // console.log("role: " + role)
    const { currentClass, attendanceRecord, currentClassBasic } = useSelector(state => state.learning)
    const [refreshing, setRefreshing] = useState(false)
    const handleRefresh = () => {
        setRefreshing(true)
        setLoadingTrigger(prev => !prev)
        setTimeout(() => {
            setRefreshing(false)
        }, 500);
    }

    useEffect(() => {
        setIsLoading(true)
        if (role === 'LECTURER') {
            dispatch(actions.getClassInfo({
                token: token,
                class_id: class_id
            }))

        } else {
            dispatch(actions.getBasicClassInfo({
                token: token,
                class_id: class_id
            }))
            dispatch(actions.getAttendanceRecord({
                token: token,
                class_id: class_id
            }))
        }
        setIsLoading(false)
    }, [loadingTrigger])

    useEffect(() => {
        if (role === 'LECTURER') {
            setClassInfo(currentClass)
        } else {
            setClassInfo(currentClassBasic)
        }
    }, [currentClass, attendanceRecord, currentClassBasic])


    useEffect(() => {
        if (initData) {
            console.log("iniiiiit data")
            setLoadingTrigger(prev => !prev)
            setInitData(false)
        }
    }, [])
    // console.log("class info: " + JSON.stringify(classInfo))
    console.log("attendance record: " + JSON.stringify(attendanceRecord))

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />
            }
        >
            <Spinner
                visible={isLoading}
                textContent=''
                textStyle={{
                    color: '#FFF'
                }}

            />
            <View style={{ padding: 10, alignItems: 'center' }}>
                <View style={{ paddingVertical: 10, paddingHorizontal: 15, width: width - 50, backgroundColor: 'white', borderWidth: 1, borderColor: '#BBBBBB', borderRadius: 15 }}>
                    <View style={{}}>
                        <Text style={{ fontSize: 16, fontWeight: '600', paddingVertical: 10 }}>{classInfo?.class_id} - {classInfo?.class_name}</Text>
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
                                <Text style={{ color: 'gray' }}>{classInfo?.class_type} </Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, paddingVertical: 5 }}>
                                <Text style={{ color: 'gray' }}>GVHD :</Text>
                            </View>
                            <View style={{ flex: 1, paddingVertical: 5 }}>
                                <Text style={{ color: 'deepskyblue', textDecorationLine: 'underline' }}>{classInfo?.lecturer_name}</Text>
                            </View>
                        </View>
                        {role === 'STUDENT' && <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, paddingVertical: 5 }}>
                                <Text style={{ color: 'gray' }}>Số lần vắng :</Text>
                            </View>
                            <View style={{ flex: 1, paddingVertical: 5 }}>
                                <Text style={{ color: 'gray' }}>{attendanceRecord?.absent_dates?.length || 0} </Text>
                            </View>
                        </View>}
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, paddingVertical: 5 }}>
                                <Text style={{ color: 'gray' }}>Số sinh viên :</Text>
                            </View>
                            <View style={{ flex: 1, paddingVertical: 5 }}>
                                <Text style={{ color: 'gray' }}>{classInfo?.student_count} </Text>
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
                                <Text style={{ color: 'gray' }}>{classInfo?.status} </Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ paddingBottom: 10 }}>
                        <Text style={{ fontSize: 16, fontWeight: '600', paddingVertical: 10 }}>Thời khóa biểu</Text>
                        <Text>Bắt đầu từ {classInfo?.start_date} đến {classInfo?.end_date} </Text>
                    </View>
                </View>
            </View>

            <View style={{ paddingVertical: 15 }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', paddingVertical: 5, paddingHorizontal: 15 }}>Danh sách lớp ({classInfo?.student_count})</Text>
                    {role === 'LECTURER' && <TouchableOpacity onPress={() => { setShowAddStudent(true) }}
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <IconFe name='plus' color='gray' size={16} />
                        <Text style={{ padding: 10, color: 'gray' }}>Thêm sinh viên</Text>
                    </TouchableOpacity>}
                </View>
                <View style={{}}>
                    {role === 'STUDENT' && <Text style={{ textAlign: 'center', color: 'gray', paddingTop: 10 }}>Sinh viên không có quyền xem danh sách lớp</Text>}
                    {role === 'LECTURER' && classInfo?.student_count === '0' && <Text style={{ textAlign: 'center', color: 'gray', paddingTop: 10 }}>Lớp hiện chưa có sinh viên đăng ký</Text>}
                    {classInfo?.student_count > 0 &&
                        <View>
                            {
                                classInfo.student_accounts.map((item, index) => {
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

const UpcomingSurvey = ({ class_id, setIsLoading, dispatch }) => {
    const navigate = useNavigation()
    const { role, token } = useSelector(state => state.auth)
    const { surveyOfCurrentClass, upcomingAssignments } = useSelector(state => state.learning)
    const [refreshing, setRefreshing] = useState(false)

    const renderAssignment = ({ item, index }) => {
        return (
            <View key={index} >
                <AssignmentItem item={item} />
            </View>
        )
    }

    return (
        <View style={{ marginBottom: 35, flex: 1 }}>
            {surveyOfCurrentClass.length === 0 && upcomingAssignments.length === 0 && <Text style={{ textAlign: 'center', color: 'gray', paddingTop: 10 }}>Lớp hiện chưa có bài kiểm tra!</Text>}
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            setRefreshing(true)
                            if (role === 'LECTURER') {
                                dispatch(actions.getAllSurveys({
                                    token: token,
                                    class_id: class_id
                                }))
                            } else {
                                dispatch(actions.getUpcomingAssigments({
                                    token: token,
                                    class_id: class_id,
                                    type: assignmentStatus.upcoming
                                }))
                            }
                            setTimeout(() => {
                                setRefreshing(false)
                            }, 500);
                        }}
                    />
                }
            >
                {
                    surveyOfCurrentClass.length > 0 && [...surveyOfCurrentClass].reverse().map((item, index) => {
                        return (
                            <View key={index} >
                                <AssignmentItem item={item} />
                            </View>
                        )
                    })
                }
                {
                    upcomingAssignments.length > 0 && [...upcomingAssignments].reverse().map((item, index) => {
                        return (
                            <View key={index} >
                                <AssignmentItem item={item} />
                            </View>
                        )
                    })
                }
            </ScrollView>

            {/* {surveyOfCurrentClass?.length > 0 && (
                <FlatList
                    data={[...surveyOfCurrentClass].reverse()}
                    keyExtractor={(item) => item.id}
                    renderItem={renderAssignment}
                    contentContainerStyle={{ 
                        paddingBottom: 40,
                        flexGrow: 1, // Makes FlatList take up all available space
                    }}
                    showsVerticalScrollIndicator={false}
                    onScrollBeginDrag={(event) => {
                        setIsLoading(true)
                    }}
                    onScrollEndDrag={(event) => {
                        if (event.nativeEvent.contentOfsfset.y <= 0) {
                            dispatch(actions.getAllSurveys({
                                token: token,
                                class_id: class_id
                            }))
                            setTimeout(() => {
                                setIsLoading(false)
                            }, 500);
                        } else {
                            setIsLoading(false)
                        }
                    }}
                />
            )} */}

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

const AssignmentItem = ({ item }) => {
    const { role } = useSelector(state => state.auth)
    const { currentSurvey, setCurrentSurvey, showSurveyInfo, setShowSurveyInfo } = useContext(GlobalContext)
    return (
        <TouchableOpacity onPress={() => {
            setCurrentSurvey(item)
            setShowSurveyInfo(true)
        }}
            style={{
                backgroundColor: 'white',
                flexDirection: 'row',
                borderBottomWidth: 1,
                borderRightWidth: 1,
                borderColor: '#CCCCCC',
                elevation: 5,
                borderRadius: 15,
                padding: 15,
                justifyContent: 'space-between',
                marginVertical: 10,
                marginHorizontal: 20
            }}>
            <View style={{ flexDirection: 'row', gap: 15, alignItems: 'flex-start' }}>
                <View style={{}}>
                    <View style={{
                        marginTop: 5,
                        width: 30,
                        height: 30,
                        backgroundColor: getColorForId(item?.class_id),
                        borderRadius: 6,
                        justifyContent: 'center'
                    }}>
                        <Text style={{
                            color: 'white',
                            textAlign: 'center',
                        }}>BT</Text>
                    </View>
                </View>
                <View style={{}}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 500
                    }}>{item?.title}</Text>
                    <Text style={{
                        color: 'gray'
                    }}>Deadline: {convertVNDate(item?.deadline)} </Text>
                </View>
            </View>
            {role === 'STUDENT' && <View style={{}}>
                <Text style={{
                    fontSize: 12,
                    fontWeight: 500
                }}>Chưa có điểm</Text>
            </View>}
        </TouchableOpacity>
    )
}

const MaterialList = ({ setIsLoading, dispatch, class_id }) => {
    const { classMaterial } = useSelector(state => state.learning)
    const { token } = useSelector(state => state.auth)
    const [refreshing, setRefreshing] = useState(false)
    const renderMaterial = ({ item, index }) => {
        return (
            <View key={index}>
                <MaterialBox item={item} />
            </View>
        )
    }
    return (
        <View style={{
            marginBottom: 20
        }}>
            {classMaterial.length === 0 &&
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            setRefreshing(false)
                            dispatch(actions.getMaterialList({
                                token: token,
                                class_id: class_id
                            }))
                            setTimeout(() => {
                                setRefreshing(false)
                            }, 500)
                        }}
                    />
                }
            >
                <Text style={{ textAlign: 'center', color: 'gray', paddingTop: 10 }}>Tài liệu lớp trống !</Text>
            </ScrollView>}

            {classMaterial?.length > 0 && (
                <FlatList
                    data={[...classMaterial].reverse()}
                    keyExtractor={(item) => item.id}
                    renderItem={renderMaterial}
                    contentContainerStyle={{ paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => {
                                setRefreshing(false)
                                dispatch(actions.getMaterialList({
                                    token: token,
                                    class_id: class_id
                                }))
                                setTimeout(() => {
                                    setRefreshing(false)
                                }, 500)
                            }}
                        />
                    }
                // onScrollBeginDrag={(event) => {
                //     setIsLoading(true)
                // }}
                // onScrollEndDrag={(event) => {
                //     if (event.nativeEvent.contentOffset.y <= 0) {
                //         dispatch(actions.getMaterialList({
                //             token: token,
                //             class_id: class_id
                //         }))
                //         setTimeout(() => {
                //             setIsLoading(false)
                //         }, 500);
                //     } else {
                //         setIsLoading(false)
                //     }
                // }}
                />
            )}


        </View>
    )
}

const MaterialBox = ({ item }) => {
    const { currentMaterial, setCurrentMaterial, showMaterialHandle, setShowMaterialHandle } = useContext(GlobalContext)

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
                    <Icon name={getIconForFileType(item?.material_type)} color='#BB0000' size={30} />
                </View>
                <View>
                    <Text style={{ fontSize: 16, fontWeight: '500' }}>{item?.material_name}</Text>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{ color: 'gray', width: 200 }}
                    >{item?.description}</Text>
                </View>
            </View>
            <View>
                <Icon5 name='ellipsis-h' color='#BB0000' size={22} onPress={() => {
                    setCurrentMaterial(item)
                    setShowMaterialHandle(true)
                }} />
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
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    modalContainer: {
        zIndex: 1,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    button: {
        zIndex: 2,
        flex: 1,
        backgroundColor: '#CC0000',
        paddingVertical: 8,
        borderRadius: 15,
        alignItems: 'center',
        margin: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 17,
        fontStyle: 'italic',
        fontWeight: '600',
    },
    row: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        gap: 5
    },
})

export default ClassScreen