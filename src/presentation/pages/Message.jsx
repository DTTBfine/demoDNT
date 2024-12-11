import { View, Text, Image, StyleSheet, TextInput, Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import IconM from 'react-native-vector-icons/MaterialIcons'
import { getHourMinute } from '../../utils/format'
import { useNavigation } from '@react-navigation/native'
import * as actions from '../redux/actions'
import Spinner from 'react-native-loading-spinner-overlay'
import { getDisplayedAvatar } from '../../utils/format'


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

    useEffect(() => {
        if (dispatchData) {
            setIsLoading(true)
            dispatch(actions.getListConversation({
                token: token,
                index: "0",
                count: "1000"
            }))
            // setTimeout(() => {
            //     setIsLoading(false)
            // }, 2000)
            setIsLoading(false)
            setDispatchData(false)
        }
    }, [])

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
                    value={''}
                    onChangeText={(text) => { }}
                />
            </View>

            <View style={{
                height: height - 200
            }}>
                <ScrollView>
                    {listConversations?.length > 0 ? listConversations.map((item, index) => {
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
                                    <Text style={{ fontSize: 17, fontWeight:item.last_message.sender.id != userId && item.last_message.unread ? '600' : '400' }}>{item.partner.name}</Text>
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
                </ScrollView>
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