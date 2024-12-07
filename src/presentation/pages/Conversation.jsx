import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, KeyboardAvoidingView, Keyboard, FlatList, Image } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import IconI from 'react-native-vector-icons/Ionicons'
import { useDispatch, useSelector } from 'react-redux';
import uuid from 'react-native-uuid'
import * as actions from '../redux/actions'
import Spinner from 'react-native-loading-spinner-overlay';
import { getDisplayedAvatar } from '../../utils/format';
import { Client, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client'

const SOCKET_URL = 'http://157.66.24.126:8080/ws';
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
    const dispatch = useDispatch()
    const { name, avatar, partner_id } = route.params
    
    //useSelector
    const { userId, token } = useSelector(state => state.auth)
    const { userInfo } = useSelector(state => state.user)
    const { currentConversation } = useSelector(state => state.message)
    
    
    const [dispatchData, setDispatchData] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [loadingText, setLoadingText] = useState('Loading...')

    //
    const stompClientRef = useRef(null);

    useEffect(() => {
      // Initialize the STOMP client
        const socket = new SockJS(SOCKET_URL)
        const stompClient = Stomp.over(socket)
        stompClientRef.current = stompClient

        stompClient.connect({}, (frame) => {
            console.log('Connected: ' + frame);
            stompClient.subscribe(`/user/${userId}/inbox`, (message) => {
                const msg = JSON.parse(message.body);
                console.log('Received message from inbox:', msg);
                dispatch(actions.getConversation({
                    token: token,
                    index: "0",
                    count: "1000",
                    partner_id: partner_id,
                    mark_as_read: "true"
                }))
            });
        })

        stompClient.onStompError = (frame) => {
            console.error('STOMP error: ', frame.headers['message']);
            console.error('Details: ', frame.body);
        };

        // Cleanup when the component unmounts
        return () => {
            if (stompClientRef.current) {
            stompClientRef.current.deactivate(); // Deactivate the stompClient when unmounted
            }
        };
    }, []);

    const [conversation, setConversation] = useState([])
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

    const sendMessage = (content) => {
        if (stompClientRef.current && message.message) {
            const payload = {
                receiver: {
                    id: partner_id
                },
                content: content,
                sender: userInfo.email,
                token: token
            }
            stompClientRef.current.send(
                '/chat/message',
                {},
                JSON.stringify(payload)
            )
        } else {
            console.error('STOMP client not initialized or message is empty');
        }
    }

    const handleSend = () => {
        if (!message?.message_id) return
        setConversation([message, ...conversation])
        sendMessage(message.message)
        setMessage({
            message_id: null,
            message: '',
            sender: {
                id: userId,
                name: userInfo?.name,
                avatar: userInfo?.avatar
            },
            created_at: (new Date()).toISOString().split(".")[0],
            unread: 0
        })
    }


    //get current conversation
    useEffect(() => {
        if (dispatchData) {
            setIsLoading(true)
            dispatch(actions.getConversation({
                token: token,
                index: "0",
                count: "1000",
                partner_id: partner_id,
                mark_as_read: "true"
            }))
            // setIsLoading(false)
            setDispatchData(false)
        }
    }, [])

    useEffect(() => {
        if (currentConversation) {
          setConversation(currentConversation); // Update conversation when currentConversation changes
          setIsLoading(false); // Set loading to false after conversation data is received
        // setTimeout(() => {
        //     setIsLoading(false)
        // }, 3000)
        }
      }, [currentConversation]); 

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
                    source={item.sender.avatar ? { uri: getDisplayedAvatar(item.sender.avatar) } : require('../../../assets/default-avatar.jpg')}
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
            <Spinner
                visible={isLoading}
                textContent={loadingText}
                textStyle={{
                    color: '#000'
                }}
            />
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
                            'created_at': new Date().toISOString().split('.')[0]
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