import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native'
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

const Attendance = ({ route }) => {
    const { id, name, type, tabName } = route.params
    const { token, role, userId } = useSelector(state => state.auth)
    const [loadData, setLoadData] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [dateAttended, setDateAttended] = useState(null)
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
            setTimeout(() => {
                setIsLoading(false)
            }, 500)
            setLoadData(false)
        }
    }, [])

    const new_date = new Date()
    const [currentDate, setCurrentDate] = useState(formatSQLDate(new_date))

    const [attendStatus, setAttendStatus] = useState(Array.isArray(currentClass.student_accounts) && currentClass.student_accounts.length > 0 ?
        Object.fromEntries(currentClass.student_accounts?.map(item => [item.student_id, true])) : {}
    )
    console.log("attend status: " + JSON.stringify(attendStatus))
    const handleChangeStatus = (id) => {
        if (dateAttended) {
            return Alert.alert("Warning", "Không thể thay đổi trạng thái điểm danh")
        }
        setAttendStatus(prev => ({ ...prev, [id]: !prev[id] }))
    }

    const getAttendanceList = async (date) => {
        const response = await apis.apiGetAttendanceList({
            token: token,
            class_id: id,
            date: date,
            pageable_request: null
        })
        console.log("get attendance list response: " + JSON.stringify(response?.data))
        if (response?.data?.meta?.code === responseCodes.statusOK) {
            return response?.data?.data?.attendance_student_details
        }
        return []
    }

    const fetchAttendStatus = async (date) => {
        setAttendStatus({});  // Initialize with an empty object
        let currentDateAttendStatus = {};
        setIsLoading(true)
        console.log("getting attendance list")
        const attendanceList = await getAttendanceList(date);
        setIsLoading(false)
        console.log('attendance list: ' + JSON.stringify(attendanceList))
        if (attendanceList?.length > 0) {
            attendanceList.forEach(item => {
                // Use student_id as key and status as value
                currentDateAttendStatus[item.student_id] = item.status === constants.attendanceStatus.present;
            });
        } else {
            currentClass?.student_accounts?.forEach(item => {
                // Default to 'true' if no attendance list available
                currentDateAttendStatus[item.student_id] = true;
            });
        }
        
        
        // Update state with the object
        setAttendStatus(currentDateAttendStatus);
    }

    useEffect(() => {
        if (currentClass?.student_accounts) {
            if (dateAttended) {
                fetchAttendStatus(dateAttended)
            } else {
                // console.log("default date here")
                fetchAttendStatus(currentDate)
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
            attendance_list: currentClass.student_accounts.map(item => !attendStatus[item.student_id] ? item.student_id : null).filter(id => id !== null)
        }
        setIsLoading(true)
        const response = await apis.apiTakeAttendance(payload)
        console.log("take attendance response: " + JSON.stringify(response?.data))
        setIsLoading(false)
        if (response?.data?.meta?.code === responseCodes.statusOK) {
            Alert.alert("Success", "Điểm danh thành công")
        } else {
            Alert.alert("Error", "Điểm danh không thành công")
        }

        console.log("payload: " + JSON.stringify(payload))
    }

    return (
        <View style={{ padding: 10, gap: 15 }}>
            <Spinner
                visible={isLoading}
                textContent={'Đang tải dữ liệu...'}
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
                                    currentClass?.student_accounts?.length > 0 && currentClass?.student_accounts.map((item, index) => {
                                        return (
                                            <View key={index} style={{ flexDirection: 'row' }}>
                                                <Cell isHeader={false} width={100} data={index + 1} />
                                                <Cell isHeader={false} width={100} data={item.student_id} />
                                                <Cell isHeader={false} width={250} data={item.first_name + ' ' + item.last_name} />
                                                <Cell isHeader={false} width={100} data={attendStatus[item.student_id] ? <Icon name='check-circle' color='deepskyblue' size={24} onPress={() => handleChangeStatus(item.student_id)} /> :
                                                    <Icon5 name='ban' color='#BB0000' size={22} onPress={() => handleChangeStatus(item.student_id)} />} />
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
            {!dateAttended && (
                <View style={{ alignItems: 'center' }}>
                <TouchableOpacity
                    style={[styles.button, { width: 150, backgroundColor: '#BB0000' }]}
                    onPress={handleSubmit}>
                    <Text style={{ color: "white", fontSize: 17, fontStyle: 'italic', fontWeight: 'bold', alignSelf: 'center', }}>Submit</Text>
                </TouchableOpacity>
            </View>
            )}
            
        </View>
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