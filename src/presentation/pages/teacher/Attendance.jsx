import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as actions from '../../redux/actions'
import { useDispatch, useSelector } from 'react-redux'
import { formatSQLDate } from '../../../utils/format'
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon5 from 'react-native-vector-icons/FontAwesome5'
import Spinner from 'react-native-loading-spinner-overlay'
import DateTimePicker from '@react-native-community/datetimepicker';
import * as apis from '../../../data/api'
import { responseCodes } from '../../../utils/constants'
import * as constants from '../../../utils/constants'
import { Picker } from '@react-native-picker/picker'

const attendanceStatus = constants.attendanceStatus

const Attendance = ({ route }) => {
    const { id, name, type, tabName } = route.params
    const { token, role, userId } = useSelector(state => state.auth)
    const [loadData, setLoadData] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [dateAttended, setDateAttended] = useState(null)
    const [refreshing, setRefreshing] = useState(false)
    const dispatch = useDispatch()

    const { currentClass, attendanceDates } = useSelector(state => state.learning) //xóa đi
    // console.log("displayed date: " + displayedDate.toISOString())
    // console.log(currentClass)

    //todo: thêm số lần điểm danh
    useEffect(() => { //Gọi api luôn, k lấy ở redux nữa?
        if (loadData) {
            setIsLoading(true)
            dispatch(actions.getClassInfo({
                token: token,
                role: role,
                account_id: userId,
                class_id: id
            }))
            dispatch(actions.getAttendanceDates({
                token: token,
                class_id: id
            }))
            fetchAttendanceList(currentDate)
            setTimeout(() => {
                setIsLoading(false)
            }, 500)
            setLoadData(false)
        }
    }, [])


    const new_date = new Date()
    const [currentDate, setCurrentDate] = useState(formatSQLDate(new_date))

    const [attendanceList, setAttendanceList] = useState({})
    console.log("attendance list: " + JSON.stringify(attendanceList))
    const handleChangeStatus = (id) => {
        setAttendanceList(prev => ({
            ...prev,
            [id]: {
                ...prev[id], // Preserve the existing properties of the object
                status: prev[id]?.status === attendanceStatus.present 
                    ? attendanceStatus.unexcusedAbsence 
                    : attendanceStatus.present // Update only the status
            }
        }));
    }

    const handleSetStatus = (id) => {
        let status = ''
        switch (attendanceList[id]?.status) {
            case attendanceStatus.present:
                status = attendanceStatus.excusedAbsence
                break
            case attendanceStatus.excusedAbsence:
                status = attendanceStatus.unexcusedAbsence
                break
            case attendanceStatus.unexcusedAbsence:
                status = attendanceStatus.present
                break
        }
        setAttendanceList(prev => ({
            ...prev,
            [id]: {
                ...prev[id], // Preserve the rest of the properties
                status: status // Update only the status
            }
        }));
    }

    const getAttendanceList = async (date) => {
        const response = await apis.apiGetAttendanceList({
            token: token,
            class_id: id,
            date: date,
            pageable_request: null
        })
        // console.log("get attendance list response: " + JSON.stringify(response?.data))
        if (response?.data?.meta?.code === responseCodes.statusOK) {
            return response?.data?.data?.attendance_student_details
        }
        return []
    }

    const fetchAttendanceList = async (date) => {
        setAttendanceList({});  // Initialize with an empty object
        let currentDateAttendStatus = {};
        setIsLoading(true)
        console.log("getting attendance list: " )
        const list = await getAttendanceList(date);
        setIsLoading(false)
        if (list?.length > 0) {
            // Create a lookup table (map) for attendanceList
            let attendanceMap = {};
            list.forEach(record => {
                attendanceMap[record.student_id] = record
            });

            // Map student_accounts using the lookup table
            currentClass?.student_accounts?.forEach(item => {
                currentDateAttendStatus[item.student_id] = attendanceMap[item.student_id]; // Default to null if no record found
            });
        } else {
            currentClass?.student_accounts?.forEach(item => {
                currentDateAttendStatus[item.student_id] = {
                    status: attendanceStatus.present
                }
            })
        }
        
        // Update state with the object
        setAttendanceList(currentDateAttendStatus);
    }

    useEffect(() => {
        if (currentClass?.student_accounts) {
            if (dateAttended) {
                fetchAttendanceList(dateAttended)
            } else {
                console.log("default date here")
                fetchAttendanceList(currentDate)
            }
        }
        
    }, [dateAttended])

    const handleChangeDate = (value) => {
        if (value === 'default') {
            setDateAttended(null)
        } else {
            setDateAttended(value)
        }
    }

    const handleSubmit = async () => {
        const payload = {
            token: token,
            class_id: id,
            date: currentDate,
            attendance_list: currentClass.student_accounts.map(item => 
                attendanceList[item.student_id]?.status !== attendanceStatus.present ? item.student_id : null).filter(id => id !== null)
        }
        setIsLoading(true)
        const response = await apis.apiTakeAttendance(payload)
        console.log("take attendance response: " + JSON.stringify(response?.data))
        setIsLoading(false)
        if (response?.data?.meta?.code === responseCodes.statusOK) {
            Alert.alert("Success", "Điểm danh thành công")
        } else {
            console.log("error taking attendance: " + JSON.stringify(response.data))
            Alert.alert("Error", "Điểm danh không thành công")
        }

        console.log("payload: " + JSON.stringify(payload))
    }

    const handleSetAttendanceStatus = async () => {
        setIsLoading(true)
        for (const id in attendanceList) {
            if (attendanceList[id]) {
                const response = await apis.apiSetAttendanceStatus({
                    token: token,
                    status: attendanceList[id]?.status,
                    attendance_id: attendanceList[id]?.attendance_id
                })
                if (response?.data?.meta?.code !== responseCodes.statusOK) {
                    console.log("error setting attendance status: " + JSON.stringify(response.data))
                    Alert.alert("Error", "Không thể thay đổi trạng thái điểm danh")
                    break
                }
            }
        }
        setIsLoading(false)
        Alert.alert("Success", "Thay đổi trạng thái điểm danh thành công")
    }

    const handleRefresh = () => {
        setRefreshing(true)
        setTimeout(() => {
            dispatch(actions.getClassInfo({
                token: token,
                role: role,
                account_id: userId,
                class_id: id
            }))
            dispatch(actions.getAttendanceDates({
                token: token,
                class_id: id
            }))
            setDateAttended(null)
            fetchAttendanceList(currentDate)
            setRefreshing(false)       
        }, 500);

    }

    return (
        <ScrollView 
            style={{ padding: 10, gap: 15 }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}   
                />
            }
        >
            <Spinner
                visible={isLoading}
                textContent=''
                textStyle={{
                    color: '#FFF'
                }}
            />
            <View>
                <Text style={{ fontSize: 24, fontWeight: '500' }}>{currentClass.class_name}</Text>
                <Text style={{ color: 'gray' }}>Mã lớp: {currentClass.class_id} ( {currentClass.class_type} )</Text>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ textAlign: 'right', padding: 5, color: 'gray', fontSize: 14, }}>Ngày đã điểm danh</Text>
                {/* <View style={{ borderWidth: 1, height: 40, width: 200, borderColor: '#CCCCCC', backgroundColor: 'white', borderRadius: 15 }}>
                </View> */}

                
            </View>
            <Picker
                    // style={styles.picker}
                    selectedValue={dateAttended}
                    onValueChange={handleChangeDate}
                >
                    <Picker.Item label='Điểm danh hôm nay' value="default"></Picker.Item>
                {attendanceDates?.length > 0 && attendanceDates.map((date, index) => (
                    <Picker.Item 
                        key={index}  // Use index or a unique identifier
                        label={formatSQLDate(date)} // Text displayed in the picker
                        value={formatSQLDate(date)} // Value associated with the picker item
                    />
                ))}
                </Picker>


            <View style={{ borderColor: '#CCCCCC', borderWidth: 1, backgroundColor: 'white', elevation: 5, borderRadius: 5 }}>
                <ScrollView horizontal={true} >
                    <View>
                        <View style={{ flexDirection: 'row' }}>
                            <Cell isHeader={true} width={100} data={'STT'} />
                            <Cell isHeader={true} width={100} data={'ID sinh viên'} />
                            <Cell isHeader={true} width={250} data={'Họ tên'} />
                            <Cell isHeader={true} width={100} data={dateAttended ? dateAttended : currentDate} />
                            <Cell isHeader={true} width={100} data={'Tổng số lần vắng'} />
                            <Cell isHeader={true} width={100} data={'Ghi chú'} />
                        </View>
                        <View style={{ height: 400 }}>
                            <ScrollView>
                                {
                                    currentClass?.student_accounts?.length > 0 && 
                                    currentClass?.student_accounts?.filter(item => attendanceList[item.student_id]?.status)?.map((item, index) => {
                                        return (
                                            <View key={index} style={{ flexDirection: 'row' }}>
                                                <Cell isHeader={false} width={100} data={index + 1} />
                                                <Cell isHeader={false} width={100} data={item.student_id} />
                                                <Cell isHeader={false} width={250} data={item.first_name + ' ' + item.last_name} />
                                                {/* presented in attend status means absence  */}
                                                {!dateAttended && <Cell isHeader={false} width={100} data={attendanceList[item.student_id]?.status === attendanceStatus.present ? <Icon name='check-circle' color='deepskyblue' size={24} onPress={() => handleChangeStatus(item.student_id)} /> :
                                                    <Icon5 name='ban' color='#BB0000' size={22} onPress={() => handleChangeStatus(item.student_id)} />} />}
                                                {dateAttended && (
                                                    <Cell 
                                                        isHeader={false} 
                                                        width={100}
                                                        data={
                                                            attendanceList[item.student_id]?.status === attendanceStatus.present ? (
                                                                <Icon
                                                                    name="check-circle"
                                                                    color="deepskyblue"
                                                                    size={24}
                                                                    onPress={() => handleSetStatus(item.student_id)}
                                                                />
                                                            ) : attendanceList[item.student_id]?.status === attendanceStatus.excusedAbsence ? (
                                                                <Icon5
                                                                    name="user-check"
                                                                    color="green"
                                                                    size={22}
                                                                    onPress={() => handleSetStatus(item.student_id)}
                                                                />
                                                            ) : (
                                                                <Icon5
                                                                    name="ban"
                                                                    color="#BB0000"
                                                                    size={22}
                                                                    onPress={() => handleSetStatus(item.student_id)}
                                                                />
                                                            )
                                                        }
                                                    />
                                                )}
                                                <Cell isHeader={false} width={100} data={''} />
                                                <Cell isHeader={false} width={100} data={''} />
                                            </View>
                                        )
                                    })
                                }
                            </ScrollView>
                        </View>
                    </View>
                </ScrollView>

            </View>
            {!dateAttended ? (
                <View style={{ alignItems: 'center' }}>
                <TouchableOpacity
                    style={[styles.button, { width: 150, backgroundColor: '#BB0000' }]}
                    onPress={async () => {
                        await handleSubmit()
                    }}>
                    <Text style={{ color: "white", fontSize: 17, fontStyle: 'italic', fontWeight: 'bold', alignSelf: 'center', }}>Submit</Text>
                </TouchableOpacity>
            </View>
            ) : <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity
                        style={[styles.button, { width: 150, backgroundColor: '#BB0000' }]}
                        onPress={async () => {
                            await handleSetAttendanceStatus()
                        }}>
                        <Text style={{ color: "white", fontSize: 17, fontStyle: 'italic', fontWeight: 'bold', alignSelf: 'center', }}>Set Status</Text>
                    </TouchableOpacity>
                </View>}
            
        </ScrollView>
    )
}

const Cell = ({ isHeader, width, data }) => {
    return (
        <View style={[styles.cell, { backgroundColor: isHeader && '#BB0000', width: width }]}>
            <Text style={[styles.dataCell, { color: isHeader && 'white', fontWeight: isHeader ? '600' : '400' }]}>{data} </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {

    },
    cell: {
        justifyContent: 'center',
        borderRightWidth: 1,
        borderColor: '#BBBBBB',
        alignItems: 'center'
    },
    dataCell: {
        textAlign: 'center',
        padding: 10
    },
    button: {
        backgroundColor: '#AA0000',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 15,
        width: 200
    },
    dateText: {
        fontSize: 16,
        color: 'black',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginEnd: 1
    },
    dateInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#BB0000',
        borderRadius: 15,
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: 'snow',
    },
    picker: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 20,
        color: 'white'
    },
})

export default Attendance