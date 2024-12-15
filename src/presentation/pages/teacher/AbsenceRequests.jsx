import { View, Text, FlatList, Modal, Pressable, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon5 from 'react-native-vector-icons/FontAwesome5'
import ConfirmModal from '../../components/ConfirmModal'
import { useDispatch, useSelector } from 'react-redux'
import * as actions from '../../redux/actions'
import * as constants from '../../../utils/constants'
import Spinner from 'react-native-loading-spinner-overlay'
import * as apis from '../../../data/api'
import IconI from 'react-native-vector-icons/Ionicons'

const absenceStatus = constants.absenceStatus

const AbsenceRequests = ({ route }) => {
    const { name, class_id, type } = route.params
    const dispatch = useDispatch()
    const { token, role, userId } = useSelector(state => state.auth)
    const [currentRequest, setCurrentRequest] = useState(null)
    const [showRequestInfo, setShowRequestInfo] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [currentHandle, setCurrentHandle] = useState('')
    const { absenceRequests } = useSelector(state => state.learning)
    const [dispatchData, setDispatchData] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [loadingText, setLoadingText] = useState('Loading...')

    const [showFilter, setShowFilter] = useState(false)
    const [arrange, setArrange] = useState('latest') //null là lấy hết
    const [refreshing, setRefreshing] = useState(false)

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

    const filterRequests = (requests) => {
        switch (arrange) {
            case 'pending':
                return requests.filter(request => request.status === absenceStatus.pending)
            case 'rejected':
                return requests.filter(request => request.status === absenceStatus.rejected)
            case 'accepted':
                return requests.filter(request => request.status === absenceStatus.accepted)
            default:
                return requests.sort((a, b) => new Date(b.absence_date) - new Date(a.absence_date))
        }
    }

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
        const payloadSN = {
            token: token,
            message: 'Chấp nhận yêu cầu nghỉ học',
            toUser: currentRequest.student_account.account_id,
            type: 'ACCEPT_ABSENCE_REQUEST',
        };

        console.log("SN accept payload",payloadSN)
    
        let responseSN;
        try {
            responseSN = await apis.apiSendNotification(payloadSN);
            console.log('Send notification response:', responseSN);
        } catch (error) {
            console.error('Error in send notification API:', error);
            return;
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
        const payloadSN = {
            token: token,
            message: 'Từ chối yêu cầu nghỉ học',
            toUser: currentRequest.student_account.account_id,
            type: 'REJECT_ABSENCE_REQUEST',
        };

        console.log("SN reject payload",payloadSN)
    
        let responseSN;
        try {
            responseSN = await apis.apiSendNotification(payloadSN);
            console.log('Send notification response:', responseSN);
        } catch (error) {
            console.error('Error in send notification API:', error);
            return;
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
                        <Text style={{
                            fontWeight: item.status === 'PENDING' && '600',
                            color: item.status === 'PENDING' ? 'goldenrod' : 'gray'
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
                    <Text style={{ fontSize: 16, fontWeight: item.status === absenceStatus.pending ? '600' : '400', color: item.status === absenceStatus.pending ? 'black' : 'gray' }}>{item.student_account.first_name} {item.student_account.last_name} - {item.student_account.student_id}</Text>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
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
            gap: 10
        }}>
            <Spinner
                visible={isLoading}
                textContent={loadingText}
                textStyle={{
                    color: '#AA000'
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
                                    <Text
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                        style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontSize: 16, fontWeight: '500' }}>Minh chứng: </Text>
                                        <Text style={{
                                            zIndex: 100,
                                            color: 'dodgerblue',
                                            textDecorationLine: 'underline',
                                            fontSize: 16,
                                        }}
                                            onPress={() => {
                                                setShowRequestInfo(false)
                                                console.log("open file in drive")
                                                Linking.openURL(currentRequest.file_url).catch(err => console.error("Failed to open URL: ", err))
                                            }}
                                        >{currentRequest.file_url}
                                        </Text>
                                    </Text>
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
                currentRequest && currentHandle === 'Accept' && showConfirmModal && <ConfirmModal handleName={"Chấp nhận"} handleFunction={async () => { await handleAccept() }} showConfirmModal={showConfirmModal} setShowConfirmModal={setShowConfirmModal} />
            }
            {
                currentRequest && currentHandle === 'Reject' && showConfirmModal && <ConfirmModal handleName={"Từ chối"} handleFunction={async () => { await handleReject() }} showConfirmModal={showConfirmModal} setShowConfirmModal={setShowConfirmModal} />

            }
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
                            setShowFilter('latest')
                            setArrange(null)
                        }}>
                            <Text style={{ textAlign: 'right', fontSize: 15, color: 'brown', fontWeight: '500' }}>Mới nhất</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ padding: 5 }} onPress={() => {
                            setShowFilter(false)
                            setArrange('pending')
                        }}>
                            <Text style={{ textAlign: 'right', fontSize: 15, color: 'goldenrod', fontWeight: '500' }}>Chờ xử lý</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ padding: 5 }} onPress={() => {
                            setShowFilter(false)
                            setArrange("rejected")
                        }}>
                            <Text style={{ textAlign: 'right', fontSize: 15, color: 'crimson', fontWeight: '500' }}>Đã từ chối</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ padding: 5 }} onPress={() => {
                            setShowFilter(false)
                            setArrange('accepted')
                        }}>
                            <Text style={{ textAlign: 'right', fontSize: 15, color: 'forestgreen', fontWeight: '500' }}>Đã chấp nhận</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
            <FlatList
                data={filterRequests([...absenceRequests])}
                keyExtractor={(item) => item.id}
                renderItem={renderRequest}
                contentContainerStyle={{ paddingBottom: 10 }}
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