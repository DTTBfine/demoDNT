import { View, Text } from 'react-native'
import React from 'react'
import { useDispatch } from 'react-redux'
import * as actions from '../redux/actions'

const SettingScreen = () => {
    const dispatch = useDispatch()
    return (
        <View>
            <Text>Setting</Text>
            <Text onPress={() => {

            }}>Log out</Text>
        </View>
    )
}

export default SettingScreen