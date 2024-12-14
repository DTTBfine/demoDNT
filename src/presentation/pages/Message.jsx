import { View, Text, Image, StyleSheet, TextInput, Dimensions, ScrollView, TouchableOpacity, FlatList, RefreshControl } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import IconM from 'react-native-vector-icons/MaterialIcons'
import { getHourMinute } from '../../utils/format'
import { useNavigation } from '@react-navigation/native'
import * as actions from '../redux/actions'
import Spinner from 'react-native-loading-spinner-overlay'
import { getDisplayedAvatar } from '../../utils/format'
import * as apis from '../../data/api'
import { responseCodes } from '../../utils/constants'
import { SOCKET_URL } from '../../data/websocket/constants'
import { Client, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client'

const DEFAULT_COUNT = 15

//Lấy hộ list conversation đi
const conversations = [
    {
        "id": 5671,
        "partner": {
            "id": 122,
            "name": "Do Binh",
            "avatar": "https://drive.google.com/file/d/16JvbkQYKvaVWc9BfrK0no3o06xCP8dZD/view?usp=drivesdk"
        },
        "last_message": {
            "sender": {
                "id": 122,
                "name": "Do Binh",
                "avatar": "https://drive.google.com/file/d/16JvbkQYKvaVWc9BfrK0no3o06xCP8dZD/view?usp=drivesdk"
            },
            "message": "khum chill nữa rồi",
            "created_at": "2024-12-03T22:45:04",
            "unread": 1
        },
        "created_at": "2024-12-03T22:37:47",
        "updated_at": "2024-12-03T22:45:04"
    },
    {
        "id": 5668,
        "partner": {
            "id": 9,
            "name": "Bfbf Gfdnnc",
            "avatar": null
        },
        "last_message": {
            "sender": {
                "id": 9,
                "name": "Bfbf Gfdnnc",
                "avatar": null
            },
            "message": "ádf",
            "created_at": "2024-12-03T22:23:11",
            "unread": 1
        },
        "created_at": "2024-12-03T22:23:11",
        "updated_at": "2024-12-03T22:23:11"
    }
]

const windowDimensions = Dimensions.get('window'); // Lấy kích thước của màn hình
const { width, height } = windowDimensions; // Đảm bảo rằng chúng ta truy cập đúng thuộc tính

const Message = () => {
    const navigate = useNavigation()
    const dispatch = useDispatch()
    const { token, userId } = useSelector(state => state.auth)
    const { userInfo } = useSelector(state => state.user)
    const { listConversations } = useSelector(state => state.message)
    const [dispatchData, setDispatchData] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [loadingTrigger, setLoadingTrigger] = useState({
        "current_index": 0,
        "signal": false
    })
    const [curlist, setCurlist] = useState([])
    const [searchedList, setSearchedList] = useState([])
    const stompClientRef = useRef(null);
    const [partnerName, setPartnerName] = useState('')


    const getListConversations = async (index) => {
        const response = await apis.apiGetListConversation({
            token: token,
            index: index,
            count: DEFAULT_COUNT
        })
        if (response?.data?.meta?.code !== responseCodes.statusOK) {
            console.log("error get list conversations: " + JSON.stringify(response.data))
            return []
        }

        return response.data.data.conversations
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
                dispatch(actions.getListConversation({
                    token: token,
                    index: 0,
                    count: 1000
                }))

                setLoadingTrigger((prev) => ({
                    ...prev,
                    current_index: 0,
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


    // //init list
    // useEffect(() => {
    //     if (dispatchData) {
    //         setLoadingTrigger((prev) => ({
    //             ...prev,
    //             current_index: 0,
    //             signal: !prev.signal
    //         }))
    //         setDispatchData(false)
    //     }
    // }, [])

    // useEffect(() => {
    //     console.log("using effect, current index: " + loadingTrigger.current_index)
    //     const index = loadingTrigger.current_index
    //     if (index === 0) {
    //         console.log("reloading list")
    //         const actionReload = async () => {
    //             const list = await getListConversations(0)
    //             setCurlist(list)
    //         }
    //         actionReload()
    //     } else {
    //         console.log("loading more messages")
    //         const actionLoad = async () => {
    //             setIsLoading(true)
    //             const list = await getListConversations(index)
    //             setIsLoading(false)
    //             setCurlist((prev) => [...prev, ...list])
    //         }
    //         actionLoad()
    //     }
    // }, [loadingTrigger])

    useEffect(() => {
        if (dispatchData) {
            setIsLoading(true)
            dispatch(actions.getListConversation({
                token: token,
                index: 0,
                count: 1000
            }))
            setLoadingTrigger((prev) => ({
                ...prev,
                current_index: 0,
                signal: !prev.signal
            }))

            setIsLoading(false)
            setDispatchData(false)
        }
    }, [])

    useEffect(() => {
        if (listConversations) {
            setCurlist(listConversations)
        }
    }, [loadingTrigger, listConversations])

    useEffect(() => {
        if (partnerName?.length > 0 && listConversations.length > 0) {
            //Không phân biệt chữ hoa chữ thường
            setSearchedList(listConversations.filter(item => item.partner.name.toLowerCase().includes(partnerName.toLowerCase())))
        } else {
            setSearchedList([])
        }
    }, [partnerName])

    const handleRefresh = () => {
        setRefreshing(true)
        setLoadingTrigger((prev) => ({
            ...prev,
            current_index: 0,
            signal: !prev.signal
        }))
        setPartnerName('')
        setTimeout(() => {
            setRefreshing(false)
        }, 500);
    }

    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity key={index} onPress={() => navigate.navigate('conversation', { name: item.partner.name, avatar: item.partner.avatar, partner_id: item.partner.id })}
                style={{
                    marginVertical: 8,
                    flexDirection: 'row',
                    gap: 10,
                    alignItems: 'center'
                }}>
                <View>
                    <Image
                        source={item.partner.avatar ? { uri: getDisplayedAvatar(item.partner.avatar) } : require('../../../assets/default-avatar.jpg')}
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                        }}
                    />
                </View>
                <View>
                    <Text style={{ fontSize: 17, fontWeight: item.last_message.sender.id != userId && item.last_message.unread ? '600' : '400' }}>{item.partner.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {item.last_message.sender.id == userId && <Text style={{ fontWeight: '400', color: 'dimgray' }}>Bạn:</Text>}
                        <View style={{ maxWidth: 220, paddingHorizontal: 5 }}>
                            <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={{
                                    fontWeight: (item.last_message.sender.id != userId && item.last_message.unread) ? '600' : '400',
                                    color: (item.last_message.sender.id != userId && item.last_message.unread) ? 'black' : 'dimgray',
                                }}
                            >{item.last_message.message}</Text>
                        </View>
                        <Icon name='circle' color={(item.last_message.sender.id != userId && item.last_message.unread) ? 'black' : 'dimgray'} size={3} />
                        <Text style={{ paddingHorizontal: 5, color: (item.last_message.sender.id != userId && item.last_message.unread) ? 'black' : 'dimgray' }}>{getHourMinute(item.last_message.created_at).hour}:{getHourMinute(item.last_message.created_at).minute}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <Spinner
                visible={isLoading}
                textContent={'Loading...'}
                textStyle={{
                    color: '#000'
                }}
            />
            <View style={{
                marginVertical: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10
                }}>
                    <Image
                        source={userInfo.avatar ? { uri: getDisplayedAvatar(userInfo.avatar) } : require('../../../assets/default-avatar.jpg')}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 23,
                            borderWidth: 2,
                            borderColor: '#AA0000'
                        }}
                    />
                    <Text style={{
                        fontSize: 24,
                        fontWeight: '600'
                    }}>Đoạn chat</Text>
                </View>
                <View style={{ backgroundColor: 'gainsboro', padding: 8, borderRadius: 20 }}>
                    <IconM name="edit" size={20} onPress={() => { navigate.navigate("searchAccount") }} />
                </View>
            </View>

            <View style={{
                backgroundColor: 'gainsboro',
                flexDirection: 'row',
                borderRadius: 20,
                alignItems: 'center',
                paddingHorizontal: 10,
                gap: 10
            }}>
                <Icon name='search' color='darkgray' size={20} />
                <TextInput
                    style={{ fontSize: 16 }}
                    placeholder='Tìm kiếm'
                    placeholderTextColor="gray"
                    value={partnerName}
                    onChangeText={(text) => { setPartnerName(text) }}
                />
            </View>

            <View style={{
                height: height - 200
            }}>
                {curlist?.length > 0 ? (
                    <FlatList
                        data={partnerName?.length > 0 ? searchedList : curlist}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={{ paddingBottom: 40 }}
                        showsVerticalScrollIndicator={false}
                        onEndReached={() => {
                            setLoadingTrigger((prev) => ({
                                ...prev,
                                current_index: prev.current_index + DEFAULT_COUNT,
                                signal: !prev.signal
                            }))
                        }}
                        onEndReachedThreshold={0.1}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={handleRefresh}
                            />
                        }
                    />
                ) : (
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={handleRefresh}
                            />
                        }
                        style={{ paddingTop: 50 }}>
                        <Text style={{ textAlign: 'center', fontSize: 13, color: 'gray' }}>Bạn chưa có cuộc hội thoại nào!</Text>
                        <Text style={{ textAlign: 'center', fontSize: 20, color: 'gray' }}>Hãy bắt đầu trò chuyện</Text>
                    </ScrollView>
                )}

                {/* <ScrollView>
                    {curlist?.length > 0 ? curlist.map((item, index) => {
                        return (
                            <TouchableOpacity key={index} onPress={() => navigate.navigate('conversation', { name: item.partner.name, avatar: item.partner.avatar, partner_id: item.partner.id })}
                                style={{
                                    marginVertical: 8,
                                    flexDirection: 'row',
                                    gap: 10,
                                    alignItems: 'center'
                                }}>
                                <View>
                                    <Image
                                        source={item.partner.avatar ? { uri: getDisplayedAvatar(item.partner.avatar) } : require('../../../assets/default-avatar.jpg')}
                                        style={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: 25,
                                        }}
                                    />
                                </View>
                                <View>
                                    <Text style={{ fontSize: 17, fontWeight: item.last_message.sender.id != userId && item.last_message.unread ? '600' : '400' }}>{item.partner.name}</Text>
                                    <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                                        {item.last_message.sender.id == userId && <Text style={{ fontWeight: '400', color: 'dimgray' }}>Bạn:</Text>}
                                        <Text style={{
                                            fontWeight: (item.last_message.sender.id != userId && item.last_message.unread) ? '600' : '400',
                                            color: (item.last_message.sender.id != userId && item.last_message.unread) ? 'black' : 'dimgray'
                                        }}
                                        >{item.last_message.message}</Text>
                                        <Icon name='circle' color={(item.last_message.sender.id != userId && item.last_message.unread) ? 'black' : 'dimgray'} size={3} />
                                        <Text style={{ color: (item.last_message.sender.id != userId && item.last_message.unread) ? 'black' : 'dimgray' }}>{getHourMinute(item.last_message.created_at).hour}:{getHourMinute(item.last_message.created_at).minute}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    }) :
                        <View style={{ paddingTop: 50 }}>
                            <Text style={{ textAlign: 'center', fontSize: 13, color: 'gray' }}>Bạn chưa có cuộc hội thoại nào!</Text>
                            <Text style={{ textAlign: 'center', fontSize: 20, color: 'gray' }}>Hãy bắt đầu trò chuyện</Text>
                        </View>}
                </ScrollView> */}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
        paddingHorizontal: 15,
        gap: 10
    }
})

export default Message