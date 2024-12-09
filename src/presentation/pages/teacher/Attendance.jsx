import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as actions from '../../redux/actions'
import { useDispatch, useSelector } from 'react-redux'
import { formatSQLDate } from '../../../utils/format'
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon5 from 'react-native-vector-icons/FontAwesome5'
import Spinner from 'react-native-loading-spinner-overlay'

const Attendance = ({ route }) => {
    const { id, name, type, tabName } = route.params
    const { token, role, userId } = useSelector(state => state.auth)
    const [loadData, setLoadData] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()

    const { currentClass } = useSelector(state => state.learning) //xóa đi
    console.log(currentClass)
    useEffect(() => { //Gọi api luôn, k lấy ở redux nữa?
        if (loadData) {
            setIsLoading(true)
            dispatch(actions.getClassInfo({
                token: token,
                role: role,
                account_id: userId,
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
        Object.fromEntries(currentClass.student_accounts?.map(item => [item.account_id, true])) : {}
    )

    const handleChangeStatus = (id) => {
        setAttendStatus(prev => ({ ...prev, [id]: !prev[id] }))
    }

    console.log(attendStatus)

    const handleSubmit = () => {
        const payload = {
            token: token,
            class_id: id,
            date: currentDate,
            attendance_list: currentClass.student_accounts.map(item => attendStatus[item.account_id] ? item.account_id : null).filter(id => id !== null)
        }
        console.log(payload)
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
                <View style={{ borderWidth: 1, height: 40, width: 200, borderColor: '#CCCCCC', backgroundColor: 'white', borderRadius: 15 }}>

                </View>
            </View>


            <View style={{ borderColor: '#CCCCCC', borderWidth: 1, backgroundColor: 'white', elevation: 5, borderRadius: 5 }}>
                <ScrollView horizontal={true} >
                    <View>
                        <View style={{ flexDirection: 'row' }}>
                            <Cell isHeader={true} width={100} data={'STT'} />
                            <Cell isHeader={true} width={100} data={'ID sinh viên'} />
                            <Cell isHeader={true} width={250} data={'Họ tên'} />
                            <Cell isHeader={true} width={100} data={currentDate} />
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
                                                <Cell isHeader={false} width={100} data={attendStatus[item.account_id] ? <Icon name='check-circle' color='deepskyblue' size={24} onPress={() => handleChangeStatus(item.account_id)} /> :
                                                    <Icon5 name='ban' color='#BB0000' size={22} onPress={() => handleChangeStatus(item.account_id)} />} />
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
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity
                    style={[styles.button, { width: 150, backgroundColor: '#BB0000' }]}
                    onPress={handleSubmit}>
                    <Text style={{ color: "white", fontSize: 17, fontStyle: 'italic', fontWeight: 'bold', alignSelf: 'center', }}>Submit</Text>
                </TouchableOpacity>
            </View>
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
    }
})

export default Attendance