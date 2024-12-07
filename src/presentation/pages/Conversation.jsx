import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, KeyboardAvoidingView, Keyboard, FlatList, Image } from 'react-native'
import React, { useState } from 'react'
import IconI from 'react-native-vector-icons/Ionicons'
import { useSelector } from 'react-redux';
import SockJS from 'sockjs-client'

const windowDimensions = Dimensions.get('window'); // Lấy kích thước của màn hình
const { width, height } = windowDimensions; // Đảm bảo rằng chúng ta truy cập đúng thuộc tính

const initConversation = [
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

const TIME_THRESHOLD = 300 //5 phút 

const Conversation = ({ route }) => {
    const { name, avatar, conversation_id } = route.params
    const { userId } = useSelector(state => state.auth)
    const { userInfo } = useSelector(state => state.user)
    console.log(JSON.stringify(userInfo))

    const [conversation, setConversation] = useState(initConversation)
    const [message, setMessage] = useState({
        message_id: null,
        message: '',
        sender: {
            id: userId,
            name: userInfo?.name,
            avatar: userInfo?.avatar
        },
        created_at: '',
        unread: 0
    })
    console.log(JSON.stringify(message))
    const handleSend = () => {
        if (!message.message_id) return
        setConversation([message, ...conversation])
        setMessage({
            message_id: null,
            message: '',
            sender: {
                id: userId,
                name: userInfo?.name,
                avatar: userInfo?.avatar
            },
            created_at: new Date().toISOString(),
            unread: 0
        })
    }

    const convertAvtLink = (avatarLink) => {
        let avatarUri = ''
        if (avatarLink?.length > 0 && avatarLink.startsWith("https://drive.google.com")) {
            const fileId = avatarLink.split('/d/')[1].split('/')[0];
            avatarUri = `https://drive.google.com/uc?export=view&id=${fileId}`
        }
        return avatarUri
    }

    const removeTrailingNewline = (message) => {
        return message.replace(/\n$/, '');
    };

    const renderMessage = ({ item, index }) => {
        // Lấy tin nhắn trước đó để so sánh
        const previousMessage = index < conversation.length ? conversation[index + 1] : null;

        // Chuyển đổi timestamp sang đối tượng Date
        const currentTime = new Date(item.created_at);
        const previousTime = previousMessage ? new Date(previousMessage.created_at) : null;

        // Tính sự chênh lệch thời gian (giây) giữa tin nhắn hiện tại và tin nhắn trước đó
        const timeDiff = previousTime ? (currentTime - previousTime) / 1000 : null;

        // Điều kiện để ẩn avatar nếu tin nhắn đến từ cùng một người và thời gian cách nhau ít hơn TIME_THRESHOLD
        const showAvatar = !previousMessage || item.sender.id !== previousMessage.sender.id || timeDiff > TIME_THRESHOLD;

        // Điều chỉnh margin nếu tin nhắn cách nhau gần
        const marginMessageSmall = timeDiff && timeDiff <= TIME_THRESHOLD && item.sender.id === previousMessage.sender.id;

        return (
            <View style={{
                flexDirection: 'row',
                marginTop: marginMessageSmall ? 3 : 10,
                gap: 10,
                justifyContent: item.sender.id == userId ? 'flex-end' : 'flex-start'
            }}>
                {item.sender.id != userId && showAvatar && <Image
                    source={item.sender.avatar ? { uri: convertAvtLink(item.sender.avatar) } : require('../../../assets/default-avatar.jpg')}
                    style={{
                        width: 30,
                        height: 30,
                        borderRadius: 15,
                    }}
                />}
                {
                    item.sender.id != userId && !showAvatar && <View style={{
                        width: 30,
                        height: 30,
                    }} />
                }
                <Text style={{
                    backgroundColor: item.sender.id == userId ? 'mediumpurple' : 'gainsboro',
                    color: item.sender.id == userId && 'white',
                    borderRadius: 20,
                    paddingVertical: 8,
                    paddingHorizontal: 10,
                    fontSize: 16,
                    maxWidth: 250
                }}>{removeTrailingNewline(item.message)}</Text>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView style={styles.container}>
            <View style={{
                flex: 1,
                padding: 10,
                justifyContent: 'flex-end',
                marginBottom: 50
            }}>
                <FlatList
                    data={conversation}
                    keyExtractor={(item) => item.message_id}
                    renderItem={renderMessage}
                    inverted={true}  // Đảo ngược thứ tự của danh sách
                    contentContainerStyle={{ paddingBottom: 10 }}  // Đảm bảo các tin nhắn được căn dưới
                    showsVerticalScrollIndicator={false}
                />
            </View>
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
                    multiline
                    numberOfLines={4}
                    autoCapitalize='sentences'
                    placeholder='Nhắn tin'
                    placeholderTextColor="gray"
                    value={message.message}
                    onChangeText={(text) => {
                        setMessage(prev => ({
                            ...prev,
                            'message_id': +conversation[0].message_id + 1 + '',
                            'message': text,
                            'created_at': new Date().toISOString()
                        }))
                    }}
                    onFocus={() => {
                        // Đảm bảo màn hình cuộn lên khi bàn phím xuất hiện
                        //Keyboard.dismiss();
                    }}
                />
                <TouchableOpacity style={{ flex: 1 }} onPress={handleSend}>
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