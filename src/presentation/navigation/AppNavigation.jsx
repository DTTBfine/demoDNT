import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from '../pages/Login';
import RegisterScreen from '../pages/Register';
import HomeScreen from '../pages/Home';
import ProfileScreen from '../pages/Profile';
import SettingScreen from '../pages/Setting';
import Icon from 'react-native-vector-icons/FontAwesome'
import CustomHeader from '../components/customHeader';
import ClassRegister from '../pages/ClassRegister';
import AddClass from '../pages/AddClass';
import ClassScreen from '../pages/ClassScreen';
import { Text } from 'react-native';
import ClassManage from '../pages/ClassManage';
import Assignments from '../pages/Assignments';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator()

const AppNavigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="auth" component={AuthNavigation} />
                <Stack.Screen name="inapp" component={InapNavigation} />
                <Stack.Screen name="class" component={ClassNavigation} />
                <Stack.Screen name="assignment" component={Assignments} />
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

const InapNavigation = () => {
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
            <Tab.Screen name="home" component={HomeScreen} />
            <Tab.Screen name="profile" component={ProfileScreen} />
            <Tab.Screen name="setting" component={SettingScreen} />
        </Tab.Navigator>
    )
}

const ClassNavigation = () => {
    return (
        <Stack.Navigator
            screenOptions={({ route }) => ({
                headerTitle: () => {
                    let titleName
                    if (route.name === "ClassScreen") titleName = 'Lớp học'
                    else if (route.name === "ClassRegister") titleName = 'Đăng ký lớp học'
                    else if (route.name === "ClassManage") titleName = 'Quản lý lớp học'
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
            <Stack.Screen name="ClassScreen" component={ClassScreen} />
            <Stack.Screen name="ClassRegister" component={ClassRegister} />
            <Stack.Screen name="ClassManage" component={ClassManage} />
            <Stack.Screen name="AddClass" component={AddClass} />
        </Stack.Navigator>
    )
}

export default AppNavigation