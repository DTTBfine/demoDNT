import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome'
import { Text } from 'react-native';
import CustomHeader from '../components/customHeader';
import LoginScreen from '../pages/Login';
import RegisterScreen from '../pages/Register';
import ProfileScreen from '../pages/Profile';
import SettingScreen from '../pages/Setting';

import TeacherScreen from '../pages/teacher/TeacherScreen';
import ClassManage from '../pages/teacher/ClassManage';
import AddClass from '../pages/teacher/AddClass';
import AddSurvey from '../pages/teacher/AddSurvey';

import StudentScreen from '../pages/student/StudentScreen';
import ClassRegister from '../pages/student/ClassRegister';
import AssignmentList from '../pages/student/AssignmentList';
import AbsenceRequest from '../pages/student/AbsenceRequest';
import StudentClasses from '../pages/student/StudentClasses';
import Notification from '../pages/Notification';
import EditClass from '../pages/teacher/EditClass';
import ClassScreen from '../pages/student/ClassScreen';

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
            </Stack.Navigator>
        </NavigationContainer>
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
            <Stack.Screen name="addSurvey" component={AddSurvey} />
        </Stack.Navigator>
    )
}

const TeacherHomepage = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName
                    if (route.name === 'home') {
                        iconName = 'home'
                    } else if (route.name === 'profile') {
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
            <Tab.Screen name="home" component={TeacherScreen} />
            <Tab.Screen name="profile" component={ProfileScreen} />
            <Tab.Screen name="setting" component={SettingScreen} />
        </Tab.Navigator>
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
                    if (route.name === 'home') {
                        iconName = 'home'
                    } else if (route.name === 'profile') {
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
            <Tab.Screen name="home" component={StudentScreen} />
            <Tab.Screen name="profile" component={ProfileScreen} />
            <Tab.Screen name="setting" component={SettingScreen} />
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
                    let titleName
                    if (route.name === "absenceRequest") titleName = 'Nghỉ phép'
                    else if (route.name === "myClasses") titleName = 'Lớp của tôi'
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
            <Stack.Screen name="myClasses" component={StudentClasses} />
            <Stack.Screen name="classScreen" component={ClassScreen} />
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