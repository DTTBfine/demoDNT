import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { classNameCode, getColorForId } from '../../../utils/format'
import IconI from 'react-native-vector-icons/Ionicons'
import Icon from 'react-native-vector-icons/FontAwesome'
import * as actions from '../../redux/actions'


const TeacherClasses = () => {
    const navigate = useNavigation()
    const dispatch = useDispatch()
    const { myClasses } = useSelector(state => state.learning)
    const { token, role, userId } = useSelector(state => state.auth)

    const [classList, setClassList] = useState(myClasses)
    const [className, setClassName] = useState('')
    const [currentId, setCurrentId] = useState('')
    const [refreshing, setRefreshing] = useState(false)

    const handleRefresh = () => {
        setRefreshing(true)
        dispatch(actions.getClassList({
            token: token,
            role: role,
            account_id: userId
        }))
        setTimeout(() => {
            setRefreshing(false)
        }, 500);
    }

    useEffect(() => {
        if (className && myClasses.length > 0) {
            setClassList(myClasses.filter(item => item.class_name.toLowerCase().includes(className.toLowerCase())))
        }
        else setClassList(myClasses)
    }, [className])

    const [showFilter, setShowFilter] = useState(false)
    const [payload, setPayload] = useState({
        class_type: null,
        status: null
    })

    const handleFilter = () => {
        setShowFilter(false)
        setClassList(myClasses.filter(item => {
            // Duyệt qua từng trường trong payload và kiểm tra giá trị của nó
            for (let key in payload) {
                if (payload[key] !== null && item[key] !== payload[key]) {
                    return false; // Nếu giá trị không trùng, bỏ qua object này
                }
            }
            return true; // Nếu tất cả các trường trong payload trùng với object
        }))
        setPayload({
            class_type: null,
            status: null
        })
    }

    const RadioChoice = ({ type, text }) => {
        return (
            <TouchableOpacity onPress={() => {
                payload[type] === text ? setPayload(prev => ({ ...prev, [type]: null })) :
                    setPayload(prev => ({ ...prev, [type]: text }))
            }} style={{ width: '50%' }}>
                {
                    payload[type] === text ? <View style={{ flexDirection: 'row', paddingVertical: 10, gap: 8 }}>
                        <IconI name='radio-button-on' color='#BB0000' size={20} />
                        <Text style={{ fontWeight: '500', color: '#BB0000' }}>{text}</Text>
                    </View> : <View style={{ flexDirection: 'row', paddingVertical: 10, gap: 8 }}>
                        <IconI name='radio-button-off' color='gray' size={20} />
                        <Text style={{ fontWeight: '500' }}>{text}</Text>
                    </View>

                }
            </TouchableOpacity>
        )
    }

    return (
        <ScrollView style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />
            }>
            <View style={{
                paddingHorizontal: 10
            }}>
                <View style={{
                    backgroundColor: 'gainsboro',
                    flexDirection: 'row',
                    borderRadius: 20,
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    gap: 10
                }}>
                    <Icon name='search' color='darkgray' size={20} />
                    <TextInput
                        style={{
                            fontSize: 16
                        }}
                        placeholder='Tìm kiếm theo tên lớp'
                        placeholderTextColor="gray"
                        value={className}
                        onChangeText={(text) => setClassName(text)}
                    />
                </View>
                {/* <TouchableOpacity
                    style={{
                        flex: 5,
                        backgroundColor: "#BB0000",
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 15
                    }}
                    onPress={() => {
                        setClassList(myClasses?.length > 0 ? myClasses.filter(classItem => classItem.class_id === classId) : [])
                    }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontStyle: 'italic', fontSize: 16 }}> Tìm kiếm</Text>
                </TouchableOpacity> */}
                <View style={{ marginVertical: 10, gap: 10 }}>
                    <TouchableOpacity onPress={() => setShowFilter(!showFilter)} style={{ alignItems: 'center', flexDirection: 'row', gap: 10 }}>
                        <IconI name="filter" color='gray' size={18} />
                        <Text style={{ fontSize: 16, color: 'gray', fontWeight: '500' }}>Bộ lọc</Text>
                    </TouchableOpacity>
                    {
                        showFilter && <View style={{
                            padding: 10,
                            borderWidth: 1,
                            borderColor: '#ccc',
                            borderRadius: 10,
                            backgroundColor: 'white',
                            // position: 'absolute',
                            // top: 30,
                            // left: 30,
                            zIndex: 1
                        }}>
                            <View>
                                <Text style={{ fontSize: 16, fontWeight: '500' }}>Trạng thái :</Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                    <RadioChoice type={'status'} text={'ACTIVE'} />
                                    <RadioChoice type={'status'} text={'COMPLETED'} />
                                    <RadioChoice type={'status'} text={'UPCOMING'} />
                                </View>
                            </View>
                            <View>
                                <Text style={{ fontSize: 16, fontWeight: '500' }}>Loại lớp :</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <RadioChoice type={'class_type'} text={'LT'} />
                                    <RadioChoice type={'class_type'} text={'LT_BT'} />
                                </View>
                            </View>
                            <TouchableOpacity onPress={handleFilter}
                                style={{ backgroundColor: '#BB0000', borderRadius: 10, padding: 5, marginTop: 10 }}>
                                <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '600', color: 'white' }}>Lọc</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            </View>
            <ScrollView >
                <View style={{ gap: 10 }}>
                    {classList.length === 0 && <Text style={{ color: 'gray', textAlign: 'center', marginTop: 20, fontSize: 16 }}>Bạn không phụ trách lớp nào</Text>}
                    {classList.length > 0 && classList.map((item, index) => {
                        const { class_id, class_name, class_type } = item
                        return (
                            <View key={index} style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                                <ClassBox class_id={class_id} class_name={class_name} class_type={class_type} currentId={currentId} setCurrentId={setCurrentId} />
                            </View>
                        )
                    })}
                </View>
            </ScrollView>

        </ScrollView >
    )
}

const ClassBox = ({ class_id, class_name, class_type, currentId, setCurrentId }) => {
    const navigate = useNavigation()
    return (
        <View style={[styles.classBox, { borderColor: currentId === class_id ? '#AA0000' : '#DDDDDD' }]}>
            <TouchableOpacity style={styles.titleBox} onPress={() => {
                //setIsExpanded(!isExpanded)
                setCurrentId(class_id)
                if (currentId === class_id) setCurrentId('0')
            }}>
                <View style={{
                    width: 45,
                    height: 45,
                    borderRadius: 10,
                    backgroundColor: getColorForId(class_id),
                    justifyContent: 'center'
                }}>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: '600',
                        textAlign: 'center',
                        color: 'white'
                    }}>{classNameCode(class_name)}</Text>
                </View>
                <View style={{
                    justifyContent: 'center'
                }}>
                    <Text style={{
                        fontSize: 17,
                        fontWeight: 500,
                    }}> {class_name} </Text>
                    <Text style={{
                        fontSize: 13,
                        color: 'gray'
                    }}> {class_type}</Text>
                </View>
            </TouchableOpacity>
            {currentId === class_id && <View style={{
                borderTopColor: '#CCCCCC',
                borderTopWidth: 1,
            }}>
                <Text style={styles.textBar} onPress={() => {
                    navigate.navigate('teacherClassScreen', { name: class_name, id: class_id, type: class_type, tabName: 'Chung' })
                }}> Chung </Text>
                <Text style={styles.textBar} onPress={() => {
                    navigate.navigate('teacherClassScreen', { name: class_name, id: class_id, type: class_type, tabName: 'Bài tập' })
                }}> Bài tập </Text>
                <Text style={styles.textBar} onPress={() => {
                    navigate.navigate('teacherClassScreen', { name: class_name, id: class_id, type: class_type, tabName: 'Tài liệu' })
                }}> Tài liệu</Text>
                <Text style={styles.textBar} onPress={() => {
                    navigate.navigate('attendance', { name: class_name, id: class_id, type: class_type })
                }}> Điểm danh </Text>
                <Text style={styles.textBar} onPress={() => {
                    navigate.navigate('absenceRequests', { name: class_name, class_id: class_id, type: class_type })
                }}> Các yêu cầu xin phép nghỉ học</Text>
            </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15
    },
    classBox: {
        backgroundColor: 'white',
        borderRadius: 10,
        borderBottomWidth: 1,
        borderRightWidth: 1,
        elevation: 5,
        borderColor: '#CCCCCC',
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    titleBox: {
        flexDirection: 'row',
        gap: 10,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
    },
    textBar: {
        padding: 8,
        fontWeight: '500'
    }
})

export default TeacherClasses