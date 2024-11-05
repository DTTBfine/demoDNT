import React from 'react';
import { View, Text } from 'react-native'

function ProfileScreen({ navigation, route }) {
    return (
        <View>
            <Text> HOàng Thế Anh là đồ ngốc haha</Text>
            <Text>This is {route.params.name}'s profile</Text>
        </View>
    );
}

export default ProfileScreen;