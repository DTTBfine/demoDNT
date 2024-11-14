import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as actions from '../redux/actions'
import { useNavigation } from '@react-navigation/native'

const SettingScreen = () => {
    const dispatch = useDispatch()
    const { isLoggedIn, msg, update, token, role, userId } = useSelector(state => state.auth)
    const navigate = useNavigation()
    return (
        <View>
            <Text>Setting</Text>
            <TouchableOpacity style={{
                borderWidth: 1,
                padding: 10
            }} onPress={() => {
                dispatch(actions.logout())
                console.log(isLoggedIn)
                console.log('token after login: ' + token)
                navigate.navigate('auth')
            }} >
                <Text>Log out</Text>
            </TouchableOpacity>
        </View>
    )
}

export default SettingScreen