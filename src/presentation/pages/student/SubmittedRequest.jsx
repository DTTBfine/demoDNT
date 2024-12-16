import { View, Text, FlatList, TouchableOpacity, Linking, RefreshControl, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as constants from '../../../utils/constants'
import IconI from 'react-native-vector-icons/Ionicons'
import { useDispatch, useSelector } from 'react-redux'
import * as actions from '../../redux/actions'
import Spinner from 'react-native-loading-spinner-overlay'

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
    const dispatch = useDispatch()
    const { class_id } = route.params
    const { studentAbsenceRequests } = useSelector(state => state.learning)
    const { token } = useSelector(state => state.auth)
    const [dispatchData, setDispatchData] = useState(true)
    const [showFilter, setShowFilter] = useState(false)
    const [arrange, setArrange] = useState(null) //null là lấy hết
    const [refreshing, setRefreshing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    // console.log("list: " + JSON.stringify(studentAbsenceRequests))

    useEffect(() => {
        if (dispatchData) {
            setIsLoading(true)
            dispatch(actions.getStudentAbsenceRequests({
                token: token,
                class_id: class_id,
                status: null,
                date: null,
                pageable_request: {
                    page: 0,
                    page_size: 10000
                }
            }))
            setDispatchData(false)
            setIsLoading(false)
        }
    })

    useEffect(() => {
        //Gọi api lấy theo status
        setIsLoading(true)
        dispatch(actions.getStudentAbsenceRequests({
            token: token,
            class_id: class_id,
            status: arrange,
            date: null,
            pageable_request: {
                page: 0,
                page_size: 10000
            }
        }))
        setIsLoading(false)
    }, [arrange])

    const handleRefresh = () => {
        setRefreshing(true)
        setTimeout(() => {
            dispatch(actions.getStudentAbsenceRequests({
                token: token,
                class_id: class_id,
                status: null,
                date: null,
                pageable_request: {
                    page: 0,
                    page_size: 10000
                }
            }))
            setArrange(null)
            setShowFilter(false)
            setRefreshing(false)
        }, 500);
    }

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
            <Spinner
                visible={isLoading}
                textContent=''
                textStyle={{
                    color: '#FFF'
                }}
            />
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
                            setArrange(absenceStatus.pending)
                        }}>
                            <Text style={{ textAlign: 'right', fontSize: 15, color: 'goldenrod', fontWeight: '500' }}>Chờ xử lý</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ padding: 5 }} onPress={() => {
                            setShowFilter(false)
                            setArrange(absenceStatus.rejected)
                        }}>
                            <Text style={{ textAlign: 'right', fontSize: 15, color: 'crimson', fontWeight: '500' }}>Đã từ chối</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ padding: 5 }} onPress={() => {
                            setShowFilter(false)
                            setArrange(absenceStatus.accepted)
                        }}>
                            <Text style={{ textAlign: 'right', fontSize: 15, color: 'forestgreen', fontWeight: '500' }}>Đã chấp nhận</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
            {studentAbsenceRequests?.length > 0 ? 
                <FlatList
                    data={[...studentAbsenceRequests].reverse()}
                    keyExtractor={(item) => item.id}
                    renderItem={renderRequest}
                    contentContainerStyle={{ paddingBottom: 10 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}   
                        />
                    }
                /> : 
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                        />
                    }
                >   
                </ScrollView>
            }
            
        </View>
    )
}

export default SubmittedRequest