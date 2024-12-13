import React,{useState} from 'react'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome'
import IconI from 'react-native-vector-icons/Ionicons'
import { Image, Text, View, RefreshControl, ScrollView } from 'react-native';

import CustomHeader from '../components/customHeader';
import LoginScreen from '../pages/Login';
import RegisterScreen from '../pages/Register';
import ProfileScreen from '../pages/Profile';
import SettingScreen from '../pages/Setting';
import Notification from '../pages/Notification';
import ClassScreen from '../pages/ClassScreen';

import TeacherScreen from '../pages/teacher/TeacherScreen';
import ClassManage from '../pages/teacher/ClassManage';
import AddClass from '../pages/teacher/AddClass';
import AddSurvey from '../pages/teacher/AddSurvey';
import EditClass from '../pages/teacher/EditClass';
import TeacherClasses from '../pages/teacher/TeacherClasses';
import AddMaterial from '../pages/teacher/AddMaterial';
import Attendance from '../pages/teacher/Attendance';

import StudentScreen from '../pages/student/StudentScreen';
import ClassRegister from '../pages/student/ClassRegister';
import AssignmentList from '../pages/student/AssignmentList';
import AbsenceRequest from '../pages/student/AbsenceRequest';
import StudentClasses from '../pages/student/StudentClasses';
import SubmitSurvey from '../pages/student/SubmitSurvey';

import { classNameCode, getColorForId } from '../../utils/format';
import CustomTeacherClass from '../components/customTeacherClass';
import Message from '../pages/Message';
import Conversation from '../pages/Conversation';
import AbsenceRequests from '../pages/teacher/AbsenceRequests';
import EditMaterial from '../pages/teacher/EditMaterial';
import EditSurvey from '../pages/teacher/EditSurvey';
import SurveyResponse from '../pages/teacher/SurveyResponse';
import SearchAccount from '../pages/SearchAccount';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator()

const AppNavigation = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [refreshTrigger,setRefreshTrigger] = useState(0)

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="auth">{(props) => <AuthNavigation {...props} refreshTrigger={refreshTrigger} />}</Stack.Screen>
                <Stack.Screen name="student">{(props) => <StudentRoute  {...props} refreshTrigger={refreshTrigger} />}</Stack.Screen>
                <Stack.Screen name="teacher">{(props) => <TeacherRoute  {...props} refreshTrigger={refreshTrigger} />}</Stack.Screen>
                <Stack.Screen name="notification">{(props) => <Note  {...props} refreshTrigger={refreshTrigger} />}</Stack.Screen>
                <Stack.Screen name="message">{(props) => <MessageRoute  {...props} refreshTrigger={refreshTrigger} />}</Stack.Screen>
                <Stack.Screen name="testUI">{(props) => <TestUI  {...props} refreshTrigger={refreshTrigger} />}</Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

const MessageRoute = ({ refreshTrigger }) => {
    const convertAvtLink = (avatarLink) => {
        let avatarUri = ''
        if (avatarLink?.length > 0 && avatarLink.startsWith("https://drive.google.com")) {
            const fileId = avatarLink.split('/d/')[1].split('/')[0];
            avatarUri = `https://drive.google.com/uc?export=view&id=${fileId}`
        }
        return avatarUri
    }
    return (
        <Stack.Navigator
            screenOptions={({ route }) => ({
                headerShown: !(route.name === 'conversationList'),
                headerTitle: route.name === 'conversation' ? () => {
                    return <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flex: 9, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <Image
                                source={route.params.avatar ? { uri: convertAvtLink(route.params.avatar) } : require('../../../assets/default-avatar.jpg')}
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 25,
                                }}
                            />
                            <Text style={{ fontSize: 18, fontWeight: '500' }}>{route.params.name}</Text>
                        </View>
                        {/* View phông bạt */}
                        <View style={{ flex: 3, flexDirection: 'row', gap: 20 }}>
                            <IconI name='call' color='mediumpurple' size={22} />
                            <IconI name='videocam' color='mediumpurple' size={22} />
                        </View>
                    </View>
                } : route.name === 'searchAccount' ? () => {
                    return <View>
                        <Text style={{ fontSize: 20, fontWeight: '500' }}>Tin nhắn mới</Text>
                    </View>
                } : undefined,
            })}>
            <Stack.Screen name="conversationList">{(props) => <Message key={refreshTrigger}  {...props} refreshTrigger={refreshTrigger} />}</Stack.Screen>
            <Stack.Screen name="conversation">{(props) => <Conversation key={refreshTrigger} {...props} refreshTrigger={refreshTrigger} />}</Stack.Screen>
            <Stack.Screen name="searchAccount">{(props) => <SearchAccount key={refreshTrigger} {...props} refreshTrigger={refreshTrigger} />}</Stack.Screen>
        </Stack.Navigator >
    )
}

const TestUI = ({ refreshTrigger }) => {
    return (
        <Stack.Navigator
            screenOptions={({ route }) => ({
                headerTitle: () => {
                    return <Text style={{ fontSize: 18, fontWeight: '500', color: 'white' }}>Test thử giao diện </Text>
                },
                headerStyle: {
                    backgroundColor: '#BB0000',
                    height: 80,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: '500',
                    fontSize: 18,
                },
                headerTitleAlign: 'center',
                headerTitleAlign: !(route.name === 'teacherClassScreen') && 'center'
            }
            )}>
            <Stack.Screen name="submitSurvey">{(props) => <SubmitSurvey key={refreshTrigger} {...props} refreshTrigger={refreshTrigger} />}</Stack.Screen>
        </Stack.Navigator>
    )
}

const AuthNavigation = ({ refreshTrigger }) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login">{(props) => <LoginScreen {...props} refreshTrigger={refreshTrigger} />}</Stack.Screen>
            <Stack.Screen name="register">{(props) => <RegisterScreen {...props} refreshTrigger={refreshTrigger} />}</Stack.Screen>
        </Stack.Navigator>
    )
}

const Note = ({ refreshTrigger }) => {
    return (
        <Stack.Navigator screenOptions={{
            headerTitle: () => {
                return <Text style={{ fontSize: 18, fontWeight: '500', color: 'white' }}>Thông báo</Text>
            },
            headerStyle: {
                backgroundColor: '#BB0000',
                height: 80,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: '500',
                fontSize: 18,
            },
            headerTitleAlign: 'center'
        }}>
            <Stack.Screen name="note">{(props) => <Notification key={refreshTrigger} {...props} refreshTrigger={refreshTrigger} />}</Stack.Screen>
        </Stack.Navigator>
    )
}

const TeacherRoute = ({ refreshTrigger }) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="homepage">{(props) => <TeacherHomepage  {...props} refreshTrigger={refreshTrigger} />}</Stack.Screen>
            <Stack.Screen name="classNavigationForTeacher">{(props) => <ClassNavigationForTeacher  {...props} refreshTrigger={refreshTrigger} />}</Stack.Screen>
            <Stack.Screen name="teacherClassList">{(props) => <TeacherClassList  {...props} refreshTrigger={refreshTrigger} />}</Stack.Screen>
        </Stack.Navigator>
    )
}

const TeacherHomepage = ({ refreshTrigger }) => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName
                    if (route.name === 'Home') {
                        iconName = 'home'
                    } else if (route.name === 'Profile') {
                        iconName = 'user'
                    } else {
                        iconName = 'gear'
                    }
                    return <Icon name={iconName} color={color} size={20} />
                },
                tabBarActiveTintColor: '#AA0000',
                tabBarInactiveTintColor: 'gray',
                header: (props) => (<CustomHeader {...props} />),
                tabBarStyle: {
                    borderRadius: 40,
                    marginBottom: 10,
                    marginHorizontal: 10,
                    borderWidth: 1,
                    height: 70,
                    borderColor: '#ccc'
                },
                tabBarLabelStyle: {
                    fontSize: 13,
                    textAlign: 'center',
                    fontWeight: '500',
                    marginBottom: 10
                },
                tabBarIconStyle: {
                    marginBottom: -4, // Giúp căn chỉnh icon với tên tab
                },
            })}
        >
            <Tab.Screen name="Home">{(props) => <TeacherScreen  {...props} refreshTrigger={refreshTrigger} />}</Tab.Screen>
            <Tab.Screen name="Profile">{(props) => <ProfileScreen  {...props} refreshTrigger={refreshTrigger} />}</Tab.Screen>
            <Tab.Screen name="Setting">{(props) => <SettingScreen  {...props} refreshTrigger={refreshTrigger} />}</Tab.Screen>
        </Tab.Navigator>
    )
}

const TeacherClassList = ({ refreshTrigger }) => {
    return (
        <Stack.Navigator
            screenOptions={({ route }) => ({
                headerTitle: () => {
                    if (route.name === 'teacherClassScreen') {
                        const { name, id, type, tabName } = route.params
                        return <CustomTeacherClass id={id} name={name} type={type} tabName={tabName} />
                    }

                    let titleName
                    if (route.name === "addSurvey") titleName = 'Tạo bài kiểm tra'
                    else if (route.name === "editSurvey") titleName = 'Chỉnh sửa bài kiểm tra'
                    else if (route.name === "surveyResponse") titleName = 'Danh sách bài nộp'
                    else if (route.name === "addMaterial") titleName = 'Tải lên tài liệu'
                    else if (route.name === "editMaterial") titleName = 'Chỉnh sửa tài liệu'
                    else if (route.name === 'attendance') titleName = 'Điểm danh sinh viên'
                    else if (route.name === 'absenceRequests') titleName = 'Yêu cầu xin nghỉ'
                    else titleName = 'Lớp của bạn'
                    return <Text style={{ fontSize: 18, fontWeight: '500', color: 'white' }}>{titleName} </Text>
                },
                headerStyle: {
                    backgroundColor: '#BB0000',
                    height: 80,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: '500',
                    fontSize: 18,
                },
                headerTitleAlign: 'center',
                headerTitleAlign: !(route.name === 'teacherClassScreen') && 'center'
            }
            )}>
            <Stack.Screen name="teacherClasses">{(props) => <TeacherClasses key={refreshTrigger} {...props} refreshTrigger={refreshTrigger} />}</Stack.Screen>
            <Stack.Screen name="teacherClassScreen">{(props) => <ClassScreen  {...props} refreshTrigger={refreshTrigger} />}</Stack.Screen>
            <Stack.Screen name="addSurvey">{(props) => <AddSurvey key={refreshTrigger} {...props} refreshTrigger={refreshTrigger} />}</Stack.Screen>
            <Stack.Screen name="editSurvey">{(props) => <EditSurvey key={refreshTrigger} {...props} refreshTrigger={refreshTrigger} />}</Stack.Screen>
            <Stack.Screen name="surveyResponse">{(props) => <SurveyResponse key={refreshTrigger} {...props} refreshTrigger={refreshTrigger} />}</Stack.Screen>
            <Stack.Screen name="addMaterial">{(props) => <AddMaterial key={refreshTrigger} {...props} refreshTrigger={refreshTrigger} />}</Stack.Screen>
            <Stack.Screen name="editMaterial">{(props) => <EditMaterial key={refreshTrigger} {...props} refreshTrigger={refreshTrigger} />}</Stack.Screen>
            <Stack.Screen name="attendance">{(props) => <Attendance key={refreshTrigger} {...props} refreshTrigger={refreshTrigger} />}</Stack.Screen>
            <Stack.Screen name="absenceRequests">{(props) => <AbsenceRequests key={refreshTrigger} {...props} refreshTrigger={refreshTrigger} />}</Stack.Screen>
        </Stack.Navigator>
    )
}
const ClassNavigationForTeacher = ({ refreshTrigger }) => {
    return (
        <Stack.Navigator
            screenOptions={({ route }) => ({
                headerTitle: () => {
                    let titleName
                    if (route.name === "classManage") titleName = 'Quản lý lớp học'
                    else if (route.name === "EditClass") titleName = 'Chỉnh sửa thông tin lớp'
                    else titleName = 'Tạo lớp'
                    return <Text style={{ fontSize: 18, fontWeight: '500', color: 'white' }}>{titleName} </Text>
                },
                headerStyle: {
                    backgroundColor: '#BB0000',
                    height: 80,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: '500',
                    fontSize: 18,
                },
                headerTitleAlign: 'center',
            }
            )}>
            <Stack.Screen name="classManage">{(props) => <ClassManage key={refreshTrigger} {...props} refreshTrigger={refreshTrigger} />}</Stack.Screen>
            <Stack.Screen name="AddClass">{(props) => <AddClass key={refreshTrigger} {...props} refreshTrigger={refreshTrigger} />}</Stack.Screen>
            <Stack.Screen name="EditClass">{(props) => <EditClass key={refreshTrigger} {...props} refreshTrigger={refreshTrigger} />}</Stack.Screen>
        </Stack.Navigator>
    )
}

const StudentRoute = ({ refreshTrigger }) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="homepage">{(props) => <StudentHomepage  {...props} refreshTrigger={refreshTrigger} />}</Stack.Screen>
            <Stack.Screen name="registerClass">{(props) => <RegisterClass {...props} refreshTrigger={refreshTrigger} />}</Stack.Screen>
            <Stack.Screen name="classNavigationForStudent">{(props) => <ClassNavigationForStudent key={refreshTrigger} {...props} refreshTrigger={refreshTrigger} />}</Stack.Screen>
            <Stack.Screen name="assignment">{(props) => <AssignmentList  {...props} refreshTrigger={refreshTrigger} />}</Stack.Screen>
        </Stack.Navigator>
    )
}

const StudentHomepage = ({ refreshTrigger }) => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName
                    if (route.name === 'Home') {
                        iconName = 'home'
                    } else if (route.name === 'Profile') {
                        iconName = 'user'
                    } else {
                        iconName = 'gear'
                    }
                    return <Icon name={iconName} color={color} size={20} />
                },
                tabBarActiveTintColor: '#AA0000',
                tabBarInactiveTintColor: 'gray',
                header: (props) => (<CustomHeader {...props} />),
                tabBarStyle: {
                    borderRadius: 40,
                    marginBottom: 10,
                    marginHorizontal: 10,
                    borderWidth: 1,
                    height: 70,
                    borderColor: '#ccc'
                },
                tabBarLabelStyle: {
                    fontSize: 13,
                    textAlign: 'center',
                    fontWeight: '500',
                    marginBottom: 10
                },
                tabBarIconStyle: {
                    marginBottom: -4, // Giúp căn chỉnh icon với tên tab
                },
            })}
        >
            <Tab.Screen name="Home">{(props) => <StudentScreen  {...props} refreshTrigger={refreshTrigger} />}</Tab.Screen>
            <Tab.Screen name="Profile">{(props) => <ProfileScreen  {...props} refreshTrigger={refreshTrigger} />}</Tab.Screen>
            <Tab.Screen name="Setting">{(props) => <SettingScreen  {...props} refreshTrigger={refreshTrigger} />}</Tab.Screen>
        </Tab.Navigator>
    )
}

const RegisterClass = ({ refreshTrigger }) => {
    return (
        <Stack.Navigator screenOptions={{
            headerTitle: () => {
                return <Text style={{ fontSize: 18, fontWeight: '500', color: 'white' }}>Đăng ký lớp học</Text>
            },
            headerStyle: {
                backgroundColor: '#BB0000',
                height: 80,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: '500',
                fontSize: 18,
            },
            headerTitleAlign: 'center'
        }}>
            <Stack.Screen name="classRegister">{(props) => <ClassRegister key={refreshTrigger} {...props} refreshTrigger={refreshTrigger} />}</Stack.Screen>
        </Stack.Navigator>
    )
}

const ClassNavigationForStudent = ({ refreshTrigger }) => {
    return (
        <Stack.Navigator
            screenOptions={({ route }) => ({
                headerTitle: () => {
                    if (route.name === 'studentClassScreen') {
                        const { name, id, teacher } = route.params
                        return (
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 8
                            }}>
                                <View style={{
                                    width: 35,
                                    height: 35,
                                    borderRadius: 5,
                                    backgroundColor: getColorForId(id),
                                    justifyContent: 'center'
                                }}>
                                    <Text style={{
                                        fontSize: 15,
                                        fontWeight: '600',
                                        textAlign: 'center',
                                        color: 'white'
                                    }}>{classNameCode(name)}</Text>
                                </View>
                                <View style={{
                                    justifyContent: 'center'
                                }}>
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: 500,
                                        color: 'white'
                                    }}> {name} </Text>
                                    <Text style={{
                                        fontSize: 12,
                                        color: '#CCCCCC'
                                    }}> {teacher}</Text>
                                </View>

                            </View>
                        )
                    }

                    let titleName
                    if (route.name === "absenceRequest") titleName = 'Nghỉ phép'
                    else if (route.name === "myClasses") titleName = 'Lớp của tôi'
                    else if (route.name === "submitSurvey") titleName = 'Nộp bài'
                    return <Text style={{ fontSize: 18, fontWeight: '500', color: 'white' }}>{titleName} </Text>
                },
                headerStyle: {
                    backgroundColor: '#BB0000',
                    height: 80,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: '500',
                    fontSize: 18,
                },
                headerTitleAlign: !(route.name === 'studentClassScreen') && 'center',
            }
            )}>
            <Stack.Screen name="myClasses">{(props) => <StudentClasses key={refreshTrigger} {...props} refreshTrigger={refreshTrigger} />}</Stack.Screen>
            <Stack.Screen name="studentClassScreen">{(props) => <ClassScreen key={refreshTrigger} {...props} refreshTrigger={refreshTrigger} />}</Stack.Screen>
            <Stack.Screen name="submitSurvey">{(props) => <SubmitSurvey key={refreshTrigger} {...props} refreshTrigger={refreshTrigger} />}</Stack.Screen>
            <Stack.Screen name="absenceRequest">{(props) => <AbsenceRequest key={refreshTrigger} {...props} refreshTrigger={refreshTrigger} />}</Stack.Screen>
        </Stack.Navigator>
    )
}

export default AppNavigation