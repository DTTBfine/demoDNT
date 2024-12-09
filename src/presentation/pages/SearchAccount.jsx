import { View, Text, TextInput, TouchableOpacity, FlatList, Image } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { getDisplayedAvatar } from '../../utils/format'
import Icon from 'react-native-vector-icons/FontAwesome'
import IconI from 'react-native-vector-icons/Ionicons'
import * as apis from '../../data/api'
import Spinner from 'react-native-loading-spinner-overlay'
import { useSelector } from 'react-redux'
import { responseCodes } from '../../utils/constants'

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
    const [isLoading, setIsLoading] = useState(false)
    const { token } = useSelector(state => state.auth)
    const [searchedUsers, setSearchedUsers] = useState([])
    const [currentPageInfo, setCurrentPageInfo] = useState(null)

    const [nameSearch, setNameSearch] = useState(null)

    const loadMoreData = async () => {
        if (currentPageInfo?.next_page && nameSearch) {
            setIsLoading(true)
            const response = await apis.apiSearchAccount({
                search: nameSearch,
                pageable_request: {
                    page: currentPageInfo.next_page,
                    page_size: currentPageInfo.page_size
                }
            })
            setIsLoading(false)
            console.log("response loading more data: " + JSON.stringify(response?.data?.data?.page_content))
            if (response?.data?.meta?.code !== responseCodes.statusOK) {
                setCurrentPageInfo(null)
                console.log("error fetching next page: " + response?.data?.meta?.message)
            }
            const listUsers = response?.data?.data?.page_content
            if (listUsers) {
                setSearchedUsers((prevUsers) => [...prevUsers, ...listUsers]);
                setCurrentPageInfo(response?.data?.data?.page_info)
            }
        }

    }

    const handleSearch = async () => {
        // setNameSearch('')
        setIsLoading(true)
        const response = await apis.apiSearchAccount(({
            search: nameSearch,
            pageable_request: {
                page: "0",
                page_size: "10"
            }
        }))
        setIsLoading(false)

        if (response?.data?.meta?.code !== responseCodes.statusOK) {
            setSearchedUsers([])
            setCurrentPageInfo(null)
            return
        }
        const listUsers = response?.data?.data?.page_content
        // console.log("list user response: " + JSON.stringify(listUsers))

        if (listUsers) {
            setSearchedUsers(listUsers)
            setCurrentPageInfo(response?.data?.data?.page_info)
        }
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
            <Spinner
                visible={isLoading}
                textContent={'Chờ xử lý...'}
                textStyle={{
                    color: '#FFF'
                }}
            />
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
                {searchedUsers?.length > 0 ? (
                    <FlatList
                        data={searchedUsers}
                        keyExtractor={(item) => item.account_id}
                        renderItem={renderAccount}
                        contentContainerStyle={{ paddingBottom: 40 }}
                        showsVerticalScrollIndicator={false}
                        onEndReached={async () => { await loadMoreData() }}
                        onEndReachedThreshold={0.9}
                    />
                ) : (
                    <Text style={{ color: 'gray', textAlign: 'center', marginTop: 20, fontSize: 16 }}>No results found</Text> // Optionally show a fallback message
                )}
            </View>
        </View>
    )
}

export default SearchAccount