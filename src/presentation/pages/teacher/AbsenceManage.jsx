import { View, Text, Dimensions, ScrollView } from 'react-native'
import React from 'react'

const windowDimensions = Dimensions.get('window'); // Lấy kích thước của màn hình
const { width, height } = windowDimensions; // Đảm bảo rằng chúng ta truy cập đúng thuộc tính

const test = [
    {
        id: 1,
        status: true
    },
    {
        id: 2,
        status: true
    },
    {
        id: 3,
        status: false
    },
    {
        id: 4,
        status: true
    },
]

const AbsenceManage = ({ route }) => {
    const { name, id, type } = route.params
    return (
        <View style={{ padding: 10 }}>
            <View>
                <Text style={{ fontSize: 24, fontWeight: '500' }}>{name}</Text>
                <Text style={{ color: 'gray' }}>Mã lớp: {id} ( {type} )</Text>
            </View>
            <View style={{
                height: height - 200,
            }}>
                <ScrollView style={{ padding: 5 }}>
                    {test.length > 0 && test.map((item, index) => {
                        return (
                            <View key={index} style={{
                                marginVertical: 8,
                                padding: 5,
                                borderRadius: 15,
                                borderRightWidth: 1,
                                borderBottomWidth: 1,
                                borderColor: '#ccc',
                                elevation: 5,
                                backgroundColor: item.status ? '#eee' : 'cornsilk'
                            }}>
                                <View style={{ height: 50, paddingHorizontal: 10, paddingTop: 5 }}>
                                    <Text style={{
                                        color: item.status ? "gray" : 'black',
                                        fontWeight: item.status ? '300' : '600'
                                    }}>Nội dung của Request</Text>
                                    <Text style={{
                                        color: item.status ? "gray" : 'black',
                                        fontWeight: item.status ? '300' : '600'
                                    }}>Lấy theo trạng thái đã xem hay chưa để in đậm :)))</Text>
                                </View>

                            </View>
                        )
                    })
                    }
                </ScrollView>
            </View>
        </View>
    )
}

export default AbsenceManage