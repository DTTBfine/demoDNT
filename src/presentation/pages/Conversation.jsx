import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, KeyboardAvoidingView, Keyboard, FlatList, Image, Modal, TouchableWithoutFeedback, Alert, RefreshControl } from 'react-native'
import React, { act, useEffect, useRef, useState } from 'react'
import IconI from 'react-native-vector-icons/Ionicons'
import Icon6 from 'react-native-vector-icons/FontAwesome6'
import { useDispatch, useSelector } from 'react-redux';
import uuid from 'react-native-uuid'
import * as actions from '../redux/actions'
import Spinner from 'react-native-loading-spinner-overlay';
import { getDisplayedAvatar, getHourMinute } from '../../utils/format';
import { Client, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client'
import * as apis from '../../data/api'
import { responseCodes } from '../../utils/constants';
import { SOCKET_URL } from '../../data/websocket/constants';

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
    }
]

const TIME_THRESHOLD = 300 //5 phút 

const LONG_TIME_THRESHOLD = 3600 //1 tiếng

const DEFAULT_COUNT = 15

const Conversation = ({ route }) => {
    const dispatch = useDispatch()
    const { name, avatar, partner_id } = route.params
    // console.log("partner id: " + partner_id)

    //useSelector
    const { userId, token } = useSelector(state => state.auth)
    const { userInfo } = useSelector(state => state.user)


    const [dispatchData, setDispatchData] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [loadingText, setLoadingText] = useState('Loading...')
    const [refreshing, setRefreshing] = useState(false)
    const [loadingTrigger, setLoadingTrigger] = useState({
        "current_index": 0,
        "mark_as_read": "true",
        "signal": false
    })

    //
    const stompClientRef = useRef(null);

    const getConversations = async (index, mark_as_read) => {
        const response = await apis.apiGetConversation({
            token: token,
            index: index,
            count: DEFAULT_COUNT,
            partner_id: partner_id,
            mark_as_read: mark_as_read
        })

        if (response?.data?.meta?.code !== responseCodes.statusOK) {
            console.log("error getting conversation: " + JSON.stringify(response?.data))
            return []
        }



        return response.data.data.conversation
    }

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
                let mark_as_read = "false"
                if (msg.sender.id === partner_id) {
                    mark_as_read = "true"
                }

                setLoadingTrigger((prev) => ({
                    ...prev,
                    current_index: 0,
                    mark_as_read: mark_as_read,
                    signal: !prev.signal
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

    const handleSend = async () => {
        if (!message?.message_id) return
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
        setLoadingTrigger((prev) => ({
            ...prev,
            current_index: 0,
            mark_as_read: "false",
            signal: !prev.signal
        }))
    }
    //init conversation
    useEffect(() => {
        if (dispatchData) {
            setIsLoading(true)

            setLoadingTrigger((prev) => ({
                ...prev,
                current_index: 0,
                mark_as_read: "true",
                signal: !prev.signal
            }))



            setIsLoading(false)
            setDispatchData(false)
        }
    }, [])

    useEffect(() => {
        console.log("using effect, current index: " + loadingTrigger.current_index)
        const index = loadingTrigger.current_index
        if (index === 0) {
            console.log("reloading conversation, mark as read: " + loadingTrigger.mark_as_read)
            const actionReload = async () => {
                const c = await getConversations(0, loadingTrigger.mark_as_read)
                setConversation(c)
            }
            actionReload()
        } else {
            console.log("loading more messages")
            const actionLoad = async () => {
                setIsLoading(true)
                const c = await getConversations(index, loadingTrigger.mark_as_read)
                setIsLoading(false)
                setConversation((prev) => [...prev, ...c])
            }
            actionLoad()
        }
        dispatch(actions.getListConversation({
            token: token,
            index: "0",
            count: "1000"
        }))
    }, [loadingTrigger])





    const removeTrailingNewline = (message) => {
        return message.replace(/\n$/, '');
    };

    const [curMes, setcurMes] = useState(null)
    const today = new Date()

    const [showHandleDelete, setShowHandleDelete] = useState(false)

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

        const isTodayMessage = today.toDateString() === currentTime.toDateString()

        const isStartDay = !previousMessage || currentTime.toDateString() !== previousTime.toDateString()

        const showTime = (timeDiff && timeDiff >= LONG_TIME_THRESHOLD) || (curMes && curMes === item) || isStartDay

        // Tính số mili giây trong 4 ngày
        const fourDaysInMs = 4 * 24 * 60 * 60 * 1000;

        // Tính khoảng cách giữa currentTime và ngày hiện tại
        const timeDifference = today - currentTime;

        // Kiểm tra nếu khoảng cách nhỏ hơn hoặc bằng 4 ngày (4 ngày = 4 * 24 * 60 * 60 * 1000 ms)
        const isWithinFourDays = timeDifference <= fourDaysInMs;

        // Điều chỉnh margin nếu tin nhắn cách nhau gần
        const marginMessageSmall = timeDiff && timeDiff <= TIME_THRESHOLD && item.sender.id === previousMessage.sender.id;

        return (
            <View style={{
                marginTop: !isTodayMessage ? 3 : marginMessageSmall ? 3 : 10,
            }}>
                {showTime && <Text style={{ textAlign: 'center', fontSize: 12, paddingVertical: 5, color: 'gray' }}>
                    {isTodayMessage ? `${getHourMinute(item.created_at).hour + ':' + getHourMinute(item.created_at).minute}` :
                        isWithinFourDays ? `${(getHourMinute(item.created_at).dayInWeek === 1 ? 'CN' : `T.${getHourMinute(item.created_at).dayInWeek}`) + ' LÚC ' + getHourMinute(item.created_at).hour + ':' + getHourMinute(item.created_at).minute}` :
                            `${getHourMinute(item.created_at).day + ' TH' + getHourMinute(item.created_at).month + ' LÚC ' + getHourMinute(item.created_at).hour + ':' + getHourMinute(item.created_at).minute}`}
                </Text>}
                <View style={{
                    flexDirection: 'row',
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
                    <Text onLongPress={() => {
                        setcurMes(item)
                        setShowHandleDelete(true)
                    }}
                        onPress={() => { item === curMes ? setcurMes(null) : setcurMes(item) }}
                        style={{
                            backgroundColor: item.sender.id == userId ? 'mediumpurple' : 'gainsboro',
                            color: item.sender.id == userId && 'white',
                            borderRadius: 20,
                            paddingVertical: 8,
                            paddingHorizontal: 10,
                            fontSize: 16,
                            maxWidth: 250
                        }}> {removeTrailingNewline(item.message)} </Text>
                </View>
            </View>
        );
    };

    const handleRefresh = () => {
        setRefreshing(true)
        setLoadingTrigger((prev) => ({
            ...prev,
            current_index: 0,
            mark_as_read: prev.mark_as_read,
            signal: !prev.signal
        }))
        dispatch(actions.getListConversation({
            token: token,
            index: "0",
            count: "1000"
        }))

        setTimeout(() => {
            setRefreshing(false)
        }, 500)
    }

    return (
        <KeyboardAvoidingView style={styles.container}>
            <Spinner
                visible={isLoading}
                textContent=''
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
                    onEndReached={() => {
                        setLoadingTrigger((prev) => ({
                            ...prev,
                            current_index: prev.current_index + DEFAULT_COUNT,
                            mark_as_read: "true",
                            signal: !prev.signal
                        }))
                    }}
                    onEndReachedThreshold={0.1}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                        // colors={["#9Bd35A", "#689F38"]} // Android loading spinner colors
                        />
                    }
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
                            'message_id': conversation[0] ? +conversation[0].message_id + 1 + '' : '1',
                            'message': text,
                            'created_at': new Date().toISOString().split('.')[0]
                        }))
                    }}
                    onFocus={() => {
                        // Đảm bảo màn hình cuộn lên khi bàn phím xuất hiện
                        //Keyboard.dismiss();
                    }}
                />
                <TouchableOpacity style={{ flex: 1 }} onPress={async () => { await handleSend() }}>
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