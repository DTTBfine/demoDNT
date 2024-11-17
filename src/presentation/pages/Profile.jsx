import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'

const ProfileScreen = () => {
    const { userInfo } = useSelector(state => state.user)
    console.log(userInfo)
    return (
        <View style={styles.container}>
            <View>
                <Text>Avatar</Text>
                <View>
                    <Text>{userInfo.ho} {userInfo.ten} </Text>
                </View>
            </View>
            <View>
                <Text> hahaha mai làm vẫn kịp</Text>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {

    }
})

export default ProfileScreen