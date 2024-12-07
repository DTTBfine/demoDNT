import React from 'react'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome'
import IconI from 'react-native-vector-icons/Ionicons'
import { Image, Text, View } from 'react-native';

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

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator()

const AppNavigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="auth" component={AuthNavigation} />
                <Stack.Screen name="student" component={StudentRoute} />
                <Stack.Screen name="teacher" component={TeacherRoute} />
                {/* <Stack.Screen name="inapp" component={InapNavigation} /> */}
                <Stack.Screen name="notification" component={Note} />
                <Stack.Screen name="message" component={MessageRoute} />
                <Stack.Screen name="testUI" component={TestUI} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

const MessageRoute = () => {
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
                } : undefined,
            })}>
            <Stack.Screen name="conversationList" component={Message} />
            <Stack.Screen name="conversation" component={Conversation} />
        </Stack.Navigator >
    )
}

const TestUI = () => {
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
            <Stack.Screen name="submitSurvey" component={SubmitSurvey} />
        </Stack.Navigator>
    )
}

const AuthNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" component={LoginScreen} />
            <Stack.Screen name="register" component={RegisterScreen} />
        </Stack.Navigator>
    )
}

const Note = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerTitle: () => {
                return <Text style={{ fontSize: 18, fontWeight: '500', color: 'white' }}>Thông báo</Text>
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
            <Stack.Screen name="note" component={Notification} />
        </Stack.Navigator>
    )
}

const TeacherRoute = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="homepage" component={TeacherHomepage} />
            <Stack.Screen name="classNavigationForTeacher" component={ClassNavigationForTeacher} />
            <Stack.Screen name="teacherClassList" component={TeacherClassList} />
        </Stack.Navigator>
    )
}


const TeacherHomepage = () => {
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
            <Tab.Screen name="Home" component={TeacherScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
            <Tab.Screen name="Setting" component={SettingScreen} />
        </Tab.Navigator>
    )
}

const TeacherClassList = () => {
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
            <Stack.Screen name="teacherClasses" component={TeacherClasses} />
            <Stack.Screen name="teacherClassScreen" component={ClassScreen} />
            <Stack.Screen name="addSurvey" component={AddSurvey} />
            <Stack.Screen name="editSurvey" component={EditSurvey} />
            <Stack.Screen name="surveyResponse" component={SurveyResponse} />
            <Stack.Screen name="addMaterial" component={AddMaterial} />
            <Stack.Screen name="editMaterial" component={EditMaterial} />
            <Stack.Screen name="attendance" component={Attendance} />
            <Stack.Screen name="absenceRequests" component={AbsenceRequests} />
        </Stack.Navigator>
    )
}

const ClassNavigationForTeacher = () => {
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
            <Stack.Screen name="classManage" component={ClassManage} />
            <Stack.Screen name="AddClass" component={AddClass} />
            <Stack.Screen name="EditClass" component={EditClass} />
        </Stack.Navigator>
    )
}

const StudentRoute = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="homepage" component={StudentHomepage} />
            <Stack.Screen name="registerClass" component={RegisterClass} />
            <Stack.Screen name="classNavigationForStudent" component={ClassNavigationForStudent} />
            <Stack.Screen name="assignment" component={AssignmentList} />
        </Stack.Navigator>
    )
}

const StudentHomepage = () => {
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
            <Tab.Screen name="Home" component={StudentScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
            <Tab.Screen name="Setting" component={SettingScreen} />
        </Tab.Navigator>
    )
}

const RegisterClass = () => {
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
            <Stack.Screen name="classRegister" component={ClassRegister} />
        </Stack.Navigator>
    )
}

const ClassNavigationForStudent = () => {
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
                    if (route.name === "absenceRequest") titleName = 'Nghỉ phép'
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
            <Stack.Screen name="myClasses" component={StudentClasses} />
            <Stack.Screen name="studentClassScreen" component={ClassScreen} />
            <Stack.Screen name="submitSurvey" component={SubmitSurvey} />
            <Stack.Screen name="absenceRequest" component={AbsenceRequest} />
        </Stack.Navigator>
    )
}

// const InapNavigation = () => {
//     return (
//         <Tab.Navigator
//             screenOptions={({ route }) => ({
//                 tabBarIcon: ({ focused, color, size }) => {
//                     let iconName
//                     if (route.name === 'home') {
//                         iconName = 'home'
//                     } else if (route.name === 'profile') {
//                         iconName = 'user'
//                     } else {
//                         iconName = 'gear'
//                     }
//                     return <Icon name={iconName} color={color} size={20} />
//                 },
//                 tabBarActiveTintColor: '#AA0000',
//                 tabBarInactiveTintColor: 'gray',
//                 header: (props) => (<CustomHeader {...props} />),
//                 tabBarStyle: {
//                     borderRadius: 40,
//                     marginBottom: 10,
//                     marginHorizontal: 10,
//                     borderWidth: 1,
//                     height: 70,
//                     borderColor: '#ccc'
//                 },
//                 tabBarLabelStyle: {
//                     fontSize: 13,
//                     textAlign: 'center',
//                     fontWeight: '500',
//                     marginBottom: 10
//                 },
//                 tabBarIconStyle: {
//                     marginBottom: -4, // Giúp căn chỉnh icon với tên tab
//                 },
//             })}
//         >
//             <Tab.Screen name="homepage" component={HomePage} />
//             <Tab.Screen name="profile" component={ProfileScreen} />
//             <Tab.Screen name="setting" component={SettingScreen} />
//         </Tab.Navigator>
//     )
// }

// const HomePage = () => {
//     return (
//         <Stack.Navigator screenOptions={{ headerShown: false }}>
//             <Stack.Screen name="home" component={HomeScreen} />
//         </Stack.Navigator>
//     )
// }

export default AppNavigation