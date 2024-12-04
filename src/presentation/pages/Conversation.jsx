import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, KeyboardAvoidingView, Keyboard } from 'react-native'
import React from 'react'
import IconI from 'react-native-vector-icons/Ionicons'

const windowDimensions = Dimensions.get('window'); // Lấy kích thước của màn hình
const { width, height } = windowDimensions; // Đảm bảo rằng chúng ta truy cập đúng thuộc tính

const conversation = [
    {
        "message_id": "6666",
        "message": "khum chill nữa rồi",
        "sender": {
            "id": 122,
            "name": "Do Binh",
            "avatar": "https://drive.google.com/file/d/16JvbkQYKvaVWc9BfrK0no3o06xCP8dZD/view?usp=drivesdk"
        },
        "created_at": "2024-12-03T22:45:04",
        "unread": 0
    },
    {
        "message_id": "6665",
        "message": "x3 luôn là saoooo\n",
        "sender": {
            "id": 122,
            "name": "Do Binh",
            "avatar": "https://drive.google.com/file/d/16JvbkQYKvaVWc9BfrK0no3o06xCP8dZD/view?usp=drivesdk"
        },
        "created_at": "2024-12-03T22:44:35",
        "unread": 0
    },
    {
        "message_id": "6664",
        "message": "lag?\n",
        "sender": {
            "id": 9,
            "name": "Bfbf Gfdnnc",
            "avatar": null
        },
        "created_at": "2024-12-03T22:44:15",
        "unread": 0
    },
    {
        "message_id": "6663",
        "message": "Lag rồi\n",
        "sender": {
            "id": 122,
            "name": "Do Binh",
            "avatar": "https://drive.google.com/file/d/16JvbkQYKvaVWc9BfrK0no3o06xCP8dZD/view?usp=drivesdk"
        },
        "created_at": "2024-12-03T22:44:06",
        "unread": 0
    },
    {
        "message_id": "6662",
        "message": "đừng nói là chưa thấy nhá",
        "sender": {
            "id": 9,
            "name": "Bfbf Gfdnnc",
            "avatar": null
        },
        "created_at": "2024-12-03T22:43:58",
        "unread": 0
    }
]

const Conversation = ({ route }) => {
    const { name, avatar, conversation_id } = route.params
    return (
        <KeyboardAvoidingView style={styles.container}>
            <Text>Conversation</Text>
            <Text>Khum làm nữa đâu, đi ngủ đây :(((</Text>
            <View style={{
                height: 50,
                position: 'absolute',
                bottom: 15,
                left: 0,
                right: 0,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                paddingHorizontal: 10
            }}>
                <TextInput
                    style={{
                        flex: 11,
                        fontSize: 16,
                        borderRadius: 20,
                        paddingHorizontal: 10,
                        backgroundColor: '#ddd'
                    }}
                    placeholder='Nhắn tin'
                    placeholderTextColor="gray"
                    value={''}
                    onChangeText={(text) => { }}
                    onFocus={() => {
                        // Đảm bảo màn hình cuộn lên khi bàn phím xuất hiện
                        Keyboard.dismiss();
                    }}
                />
                <TouchableOpacity style={{ flex: 1 }}>
                    <IconI name='send' color="mediumpurple" size={25} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    }
})

export default Conversation