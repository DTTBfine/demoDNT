import { View, Text, FlatList, Modal, Pressable, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon5 from 'react-native-vector-icons/FontAwesome5'
import ConfirmModal from '../../components/ConfirmModal'
import { useDispatch, useSelector } from 'react-redux'
import * as actions from '../../redux/actions'
import * as constants from '../../../utils/constants'
import Spinner from 'react-native-loading-spinner-overlay'
import * as apis from '../../../data/api'

const testData = [
    {
        "id": "293",
        "student_account": {
            "account_id": "197",
            "last_name": "Hương",
            "first_name": "Hoàng Thu",
            "email": "Huonght@hust.edu.vn",
            "student_id": "95"
        },
        "absence_date": "2024-12-21",
        "reason": "Xin nghỉ vì lí do ốm",
        "status": "PENDING",
        "file_url": "https://drive.google.com/file/d/1uyK7_mpeq1waLNv3gfAiOoYF6RWZ52jx/view?usp=drivesdk"
    },
    {
        "id": "292",
        "student_account": {
            "account_id": "195",
            "last_name": "Hoàng",
            "first_name": "Nguyễn Đức",
            "email": "Hoangnd@hust.edu.vn",
            "student_id": "94"
        },
        "absence_date": "2024-12-21",
        "reason": "Sở hữu bảng mã màu CSS chuẩn, bạn sẽ tự tin hơn khi thiết kế, lập trình web, bởi màu sắc là một phần không thể thiếu trong thế giới Internet",
        "status": "ACCEPTED",
        "file_url": "https://drive.google.com/file/d/1RRanTlcKWLBUdZCqE_Mue7UDlIY2oTj5/view?usp=drivesdk"
    },
    {
        "id": "291",
        "student_account": {
            "account_id": "195",
            "last_name": "Hoàng",
            "first_name": "Nguyễn Đức",
            "email": "Hoangnd@hust.edu.vn",
            "student_id": "94"
        },
        "absence_date": "2024-12-21",
        "reason": "Sở hữu bảng mã màu CSS chuẩn, bạn sẽ tự tin hơn khi thiết kế, lập trình web, bởi màu sắc là một phần không thể thiếu trong thế giới Internet",
        "status": "REJECTED",
        "file_url": "https://drive.google.com/file/d/1RRanTlcKWLBUdZCqE_Mue7UDlIY2oTj5/view?usp=drivesdk"
    },

    {
        "id": "290",
        "student_account": {
            "account_id": "195",
            "last_name": "Hoàng",
            "first_name": "Nguyễn Đức",
            "email": "Hoangnd@hust.edu.vn",
            "student_id": "94"
        },
        "absence_date": "2024-12-21",
        "reason": "Sở hữu bảng mã màu CSS chuẩn, bạn sẽ tự tin hơn khi thiết kế, lập trình web, bởi màu sắc là một phần không thể thiếu trong thế giới Internet",
        "status": "PENDING",
        "file_url": "https://drive.google.com/file/d/1RRanTlcKWLBUdZCqE_Mue7UDlIY2oTj5/view?usp=drivesdk"
    }
]

const absenceStatus = constants.absenceStatus

const AbsenceRequests = ({ route }) => {
    const { name, class_id, type } = route.params 
    const dispatch = useDispatch()
    const { token } = useSelector(state => state.auth)
    const [currentRequest, setCurrentRequest] = useState(null)
    const [showRequestInfo, setShowRequestInfo] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [currentHandle, setCurrentHandle] = useState('')
    const { absenceRequests } = useSelector(state => state.learning)
    const [dispatchData, setDispatchData] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [loadingText, setLoadingText] = useState('Loading...')

    useEffect(() => {
        if (dispatchData) {
            setIsLoading(true)
            dispatch(actions.getAbsenceRequests({
                token: token,
                class_id: class_id,
                status: null,
                date: null,
                pageable_request: null
            }))
            console.log("page absence requests: " + JSON.stringify(absenceRequests))
            setIsLoading(false)
            setDispatchData(false)
        }
    })

    const handleAccept = async () => {
        console.log('Chấp nhận yêu cầu')
        setShowConfirmModal(false)
        setIsLoading(true)

        const response = await apis.apiReviewAbsenceRequest({
            token: token,
            request_id: currentRequest.id,
            status: absenceStatus.accepted
        })
        console.log("accept request response: " + JSON.stringify(response.data))

        if (response?.data?.meta?.code === constants.responseCodes.statusOK) {
            Alert.alert("Success", "Chấp nhận đơn xin nghỉ thành công")
            currentRequest.status = absenceStatus.accepted
        } else {
            Alert.alert("Error", "Chấp nhận đơn xin nghỉ không thành công")
        }

        setIsLoading(false)
        setCurrentRequest(null)
        setShowRequestInfo(false)
        setCurrentHandle('')
    }

    const handleReject = async () => {
        console.log('Từ chối yêu cầu')
        setShowConfirmModal(false)
        setIsLoading(true)

        const response = await apis.apiReviewAbsenceRequest({
            token: token,
            request_id: currentRequest.id,
            status: absenceStatus.rejected
        })
        console.log("accept request response: " + JSON.stringify(response.data))

        if (response?.data?.meta?.code === constants.responseCodes.statusOK) {
            Alert.alert("Success", "Từ chối đơn xin nghỉ thành công")
            currentRequest.status = absenceStatus.rejected
        } else {
            Alert.alert("Error", "Từ chối đơn xin nghỉ không thành công")
        }

        setIsLoading(false)
        setCurrentRequest(null)
        setShowRequestInfo(false)
        setCurrentHandle('')
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
                        <Text style={{ fontStyle: 'italic', fontWeight: item.status === 'PENDING' && '600', color: item.status === 'PENDING' ? '#AA0000' : 'gray' }}>Ngày {item.absence_date}</Text>
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
                    <Text style={{ fontSize: 16, fontWeight: item.status === absenceStatus.pending ? '600' : '400', color: item.status ===  absenceStatus.pending ? 'black' : 'gray' }}>{item.student_account.first_name} {item.student_account.last_name} - {item.student_account.student_id}</Text>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
                            fontStyle: 'italic',
                            color: 'gray',
                            paddingVertical: 10,
                            width: 280,
                            fontWeight: item.status === absenceStatus.pending && '600'
                        }}
                    >{item.reason}</Text>
                </View>
                <Text onPress={() => {
                    setCurrentRequest(item)
                    setShowRequestInfo(true)
                }}
                    style={{ textDecorationLine: 'underline', color: 'deepskyblue', textAlign: 'right' }}>Chi tiết</Text>
            </View>
        )
    }

    return (
        <View style={{
            flex: 1,
            padding: 10,
            paddingBottom: 20,
            justifyContent: 'flex-end',
        }}>
            <Spinner
                visible={isLoading}
                textContent={loadingText}
                textStyle={{
                    color: '#000'
                }}
            />
            {
                currentRequest && (
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={showRequestInfo}
                        onRequestClose={() => setShowRequestInfo(false)}
                    >
                        <Pressable style={styles.modalBackground} onPress={() => { }}>
                            <View style={styles.modalContainer} >
                                <TouchableOpacity onPress={() => {
                                    setShowRequestInfo(false)
                                    setCurrentRequest(null)
                                }}
                                    style={{ flexDirection: 'row', gap: 5, marginBottom: 10, paddingBottom: 5, borderBottomWidth: 1, borderColor: '#CCCCCC' }}>
                                    <Icon5 name='angle-left' color='gray' size={18} />
                                    <Text style={{ color: 'gray', fontWeight: '500' }}>Trở lại</Text>
                                </TouchableOpacity>
                                <Text style={{
                                    fontSize: 24,
                                    fontWeight: '500',
                                    marginBottom: 10,
                                    color: '#AA0000',
                                    textAlign: 'center'
                                }}>Đơn xin nghỉ</Text>
                                <Text style={{ textAlign: 'right', fontStyle: 'italic', color: 'gray', fontSize: 13 }}>Ngày nghỉ: {currentRequest.absence_date}</Text>
                                <View style={{ paddingVertical: 15, gap: 15 }}>
                                    <Text>
                                        <Text style={{ fontSize: 16, fontWeight: '500' }}>Sinh viên: </Text>
                                        <Text style={{ fontSize: 16, padding: 5, fontWeight: '600' }}>{currentRequest.student_account.first_name} {currentRequest.student_account.last_name}</Text>
                                    </Text>
                                    <Text>
                                        <Text style={{ fontSize: 16, fontWeight: '500' }}>Email: </Text>
                                        <Text style={{ fontSize: 16, padding: 5 }}>{currentRequest.student_account.email}</Text>
                                    </Text>
                                    <Text>
                                        <Text style={{ fontSize: 16, fontWeight: '500' }}>Lý do: </Text>
                                        {currentRequest.reason && <Text style={{ fontSize: 16, padding: 5 }}>{currentRequest.reason}</Text>}
                                    </Text>
                                    <View>
                                        <Text style={{ fontSize: 16, fontWeight: '500' }}>Minh chứng: </Text>
                                        <TouchableOpacity onPress={() => {
                                            setShowRequestInfo(false)
                                            console.log("open file in drive")
                                            Linking.openURL(currentRequest.file_url).catch(err => console.error("Failed to open URL: ", err))
                                        }}
                                            style={{ padding: 5 }}
                                        >
                                            <Text style={{
                                                zIndex: 100,
                                                color: 'dodgerblue',
                                                textDecorationLine: 'underline',
                                                fontSize: 16,
                                            }}
                                            >{currentRequest.file_url}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {currentRequest.status === 'PENDING' ?
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
                                        <TouchableOpacity onPress={() => {
                                            setCurrentHandle('Reject')
                                            setShowConfirmModal(true)
                                        }}
                                            style={{ flexDirection: 'row', gap: 15, padding: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#AA0000', borderRadius: 18, width: 100 }}
                                        >
                                            <Text style={{ fontSize: 16, fontWeight: '400', color: 'white', fontWeight: '600' }}>Từ chối</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                            setCurrentHandle('Accept')
                                            setShowConfirmModal(true)
                                        }}
                                            style={{ flexDirection: 'row', gap: 15, padding: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: 'limegreen', borderRadius: 18, width: 100 }}
                                        >
                                            <Text style={{ fontSize: 16, fontWeight: '400', color: 'white', fontWeight: '600' }}>Chấp nhận</Text>
                                        </TouchableOpacity>
                                    </View> :
                                    <View style={{ marginTop: 20 }}>
                                        <Text style={{
                                            backgroundColor: currentRequest.status === 'ACCEPTED' ? 'forestgreen' : 'crimson',
                                            color: 'white',
                                            padding: 10,
                                            borderRadius: 15,
                                            fontSize: 16,
                                            fontWeight: '600',
                                            textAlign: 'center'
                                        }}
                                        >{currentRequest.status === 'ACCEPTED' ? 'Đã chấp nhận' : 'Đã từ chối'}</Text>
                                    </View>
                                }
                            </View>
                        </Pressable>
                    </Modal>
                )
            }
            {
                currentRequest && currentHandle === 'Accept' && showConfirmModal && <ConfirmModal handleName={"Chấp nhận"} handleFunction={async () => {await handleAccept()}} showConfirmModal={showConfirmModal} setShowConfirmModal={setShowConfirmModal} />
            }
            {
                currentRequest && currentHandle === 'Reject' && showConfirmModal && <ConfirmModal handleName={"Từ chối"} handleFunction={async () => {await handleReject()}} showConfirmModal={showConfirmModal} setShowConfirmModal={setShowConfirmModal} />

            }
            <FlatList
                data={absenceRequests}
                keyExtractor={(item) => item.id}
                renderItem={renderRequest}
                contentContainerStyle={{ paddingBottom: 10 }}  // Đảm bảo các tin nhắn được căn dưới
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    modalContainer: {
        zIndex: 1,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%'
    }
})

export default AbsenceRequests