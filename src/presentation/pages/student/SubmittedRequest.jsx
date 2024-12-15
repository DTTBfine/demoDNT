import { View, Text, FlatList, TouchableOpacity, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as constants from '../../../utils/constants'
import IconI from 'react-native-vector-icons/Ionicons'

const absenceStatus = constants.absenceStatus

const testData = [
    {
        "id": "374",
        "student_account": {
            "account_id": "122",
            "last_name": "Binh",
            "first_name": "Do",
            "email": "binhdtt@hust.edu.vn",
            "student_id": "57"
        },
        "absence_date": "2024-12-14",
        "reason": "Nghỉ",
        "status": "PENDING",
        "file_url": "https://drive.google.com/file/d/1AxwANgvljFsFxMu42DLxDyh88QCCgYx4/view?usp=drivesdk",
        "class_id": "000050"
    },
    {
        "id": "373",
        "student_account": {
            "account_id": "122",
            "last_name": "Binh",
            "first_name": "Do",
            "email": "binhdtt@hust.edu.vn",
            "student_id": "57"
        },
        "absence_date": "2024-12-14",
        "reason": "Nghỉ",
        "status": "PENDING",
        "file_url": "https://drive.google.com/file/d/1BdlVmhDCWOJU11YFnaQhYZkdcrsH4aAh/view?usp=drivesdk",
        "class_id": "000050"
    },
    {
        "id": "372",
        "student_account": {
            "account_id": "122",
            "last_name": "Binh",
            "first_name": "Do",
            "email": "binhdtt@hust.edu.vn",
            "student_id": "57"
        },
        "absence_date": "2024-12-14",
        "reason": "Nghỉ",
        "status": "PENDING",
        "file_url": "https://drive.google.com/file/d/1E-pyjTkN_PaFqYONBy2o9WZS8ZQcRBye/view?usp=drivesdk",
        "class_id": "000050"
    },
    {
        "id": "371",
        "student_account": {
            "account_id": "122",
            "last_name": "Binh",
            "first_name": "Do",
            "email": "binhdtt@hust.edu.vn",
            "student_id": "57"
        },
        "absence_date": "2024-12-14",
        "reason": "Nghỉ",
        "status": "PENDING",
        "file_url": "https://drive.google.com/file/d/1qc0xIa8Ot45nzjYBDpQmNuLWrTp5r9Js/view?usp=drivesdk",
        "class_id": "000050"
    },
    {
        "id": "370",
        "student_account": {
            "account_id": "122",
            "last_name": "Binh",
            "first_name": "Do",
            "email": "binhdtt@hust.edu.vn",
            "student_id": "57"
        },
        "absence_date": "2024-12-14",
        "reason": "Nghỉ",
        "status": "REJECTED",
        "file_url": "https://drive.google.com/file/d/1hvz_w8vXj5Ur20ke2jF6GQuOoy_JXm9v/view?usp=drivesdk",
        "class_id": "000050"
    }
]

const SubmittedRequest = ({ route }) => {
    const { class_id } = route.params
    const [showFilter, setShowFilter] = useState(false)
    const [arrange, setArrange] = useState(null) //null là lấy hết
    const [StudentRequest, setStudentRequest] = useState(testData)

    useEffect(() => {
        //Gọi api lấy theo status

    }, [arrange])

    const renderRequest = ({ item, index }) => {
        return (
            <View style={{
                backgroundColor: item.status === absenceStatus.pending ? 'white' : '#eee',
                borderRadius: 15,
                elevation: 5,
                margin: 10,
                paddingVertical: 10,
                paddingHorizontal: 15
            }}>
                <View style={{ borderBottomWidth: 1, borderColor: '#ddd', paddingVertical: 10, flexDirection: 'row' }}>
                    <View style={{ flex: 2 }}>
                        <Text style={{
                            fontWeight: item.status === 'PENDING' && '600',
                            color: item.status === absenceStatus.pending ? 'goldenrod' : item.status === absenceStatus.accepted ? 'forestgreen' : 'crimson'

                        }}>
                            Ngày {item.absence_date}
                        </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{
                            textAlign: 'right',
                            fontSize: 12,
                            color: item.status === absenceStatus.pending ? 'goldenrod' : item.status === absenceStatus.accepted ? 'forestgreen' : 'crimson'
                        }}
                        >
                            {item.status === absenceStatus.pending ? 'Chờ xử lý' : item.status === absenceStatus.accepted ? 'Đã chấp nhận' : 'Đã từ chối'}
                        </Text>
                    </View>
                </View>
                <View style={{ paddingVertical: 10 }}>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
                            color: 'gray',
                            paddingVertical: 10,
                            width: 280,
                            fontWeight: item.status === absenceStatus.pending && '600'
                        }}
                    >Lý do: {item.reason}</Text>
                    <TouchableOpacity onPress={() => {
                        console.log("open file in drive")
                        Linking.openURL(item.file_url).catch(err => console.error("Failed to open URL: ", err))
                    }}>
                        <Text style={{ color: 'cornflowerblue', textDecorationLine: 'underline' }}>Minh chứng</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <View style={{
            padding: 10,
            gap: 10,
            paddingBottom: 40
        }}>
            <View style={{
                alignItems: 'flex-end',
                paddingRight: 10
            }}>
                <TouchableOpacity onPress={() => setShowFilter(!showFilter)} style={{ alignItems: 'center', flexDirection: 'row', gap: 10 }}>
                    <Text style={{ fontSize: 16, color: 'gray', fontWeight: '500' }}>Sắp xếp theo</Text>
                    <IconI name="filter" color='gray' size={18} />
                </TouchableOpacity>
                {
                    showFilter && <View style={{
                        backgroundColor: 'white',
                        position: 'absolute',
                        top: 30,
                        zIndex: 1,
                        borderRadius: 10,
                        padding: 10,
                        elevation: 5
                    }}>
                        <TouchableOpacity style={{ padding: 5 }} onPress={() => {
                            setShowFilter(false)
                            setArrange(null)
                        }}>
                            <Text style={{ textAlign: 'right', fontSize: 15, color: 'brown', fontWeight: '500' }}>Mới nhất</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ padding: 5 }} onPress={() => {
                            setShowFilter(false)
                            setArrange('PENDING')
                        }}>
                            <Text style={{ textAlign: 'right', fontSize: 15, color: 'goldenrod', fontWeight: '500' }}>Chờ xử lý</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ padding: 5 }} onPress={() => {
                            setShowFilter(false)
                            setArrange('REJECTED')
                        }}>
                            <Text style={{ textAlign: 'right', fontSize: 15, color: 'crimson', fontWeight: '500' }}>Đã từ chối</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ padding: 5 }} onPress={() => {
                            setShowFilter(false)
                            setArrange('ACCEPTED')
                        }}>
                            <Text style={{ textAlign: 'right', fontSize: 15, color: 'forestgreen', fontWeight: '500' }}>Đã chấp nhận</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
            <FlatList
                data={[...StudentRequest].reverse()}
                keyExtractor={(item) => item.id}
                renderItem={renderRequest}
                contentContainerStyle={{ paddingBottom: 10 }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

export default SubmittedRequest