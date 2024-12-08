import { View, Text, TextInput, TouchableOpacity, FlatList, Image } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { getDisplayedAvatar } from '../../utils/format'
import Icon from 'react-native-vector-icons/FontAwesome'
import IconI from 'react-native-vector-icons/Ionicons'

const testData = [
    {
        "account_id": "336",
        "last_name": "Anh",
        "first_name": "Hai",
        "email": "testst@hust.edu.vn"
    },
    {
        "account_id": "298",
        "last_name": "Messi",
        "first_name": "Lionel",
        "email": "sv0912_test4@hust.edu.vn"
    },
    {
        "account_id": "196",
        "last_name": "Binh",
        "first_name": "Do Thanh",
        "email": "Tbaccteacher@hust.edu.vn",
        "avatar": "https://drive.google.com/file/d/1spl1nYTthtYdQ-zLEVboA1LqjpE716lT/view?usp=drivesdk"
    }
]

const SearchAccount = () => {
    const navigate = useNavigation()

    const [nameSearch, setNameSearch] = useState('')

    const handleSearch = () => {
        console.log('Xử lý đi')
        setNameSearch('')
    }

    const renderAccount = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => { navigate.navigate('conversation', { name: item.first_name + ' ' + item.last_name, avatar: item.avatar ? item.avatar : null, partner_id: item.account_id }) }}
                style={{
                    padding: 15,
                    flexDirection: 'row',
                    gap: 10
                }}>
                <Image
                    source={item.avatar ? { uri: getDisplayedAvatar(item.avatar) } : require('../../../assets/default-avatar.jpg')}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                    }}
                />
                <View>
                    <Text style={{ fontSize: 16, fontWeight: '500' }}>{item.first_name} {item.last_name}</Text>
                    <Text style={{ color: 'gray' }}>{item.email}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View>
            <View style={{
                backgroundColor: 'white',
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 10,
                paddingVertical: 5,
                elevation: 5,
                justifyContent: 'space-between'
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10
                }}>
                    <Text style={{ fontSize: 16, color: 'gray' }}>Đến: </Text>
                    <TextInput
                        style={{ fontSize: 16, }}
                        placeholder='Hãy nhập tên hoặc email'
                        placeholderTextColor="darkgrey"
                        value={nameSearch}
                        onChangeText={(text) => { setNameSearch(text) }}
                    />
                </View>
                <TouchableOpacity onPress={handleSearch}>
                    {/* <Icon name='magic' color='thistle' size={22} /> */}
                    <IconI name='send' color="thistle" size={25} />
                </TouchableOpacity>
            </View>
            <View>
                <FlatList
                    data={testData}
                    keyExtractor={(item) => item.account_id}
                    renderItem={renderAccount}
                    contentContainerStyle={{ paddingBottom: 10 }}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    )
}

export default SearchAccount