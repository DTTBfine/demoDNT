import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import ClassItem from '../../components/classItem'
import { useSelector } from 'react-redux'
import * as apis from '../../../data/api/index'
import IconI from 'react-native-vector-icons/Ionicons'

const StudentClasses = () => {
    const [currentId, setCurrentId] = useState('')
    const { isLoggedIn, msg, update, token, role, userId } = useSelector(state => state.auth)

    const { myClasses } = useSelector(state => state.learning)
    const [classList, setClassList] = useState(myClasses)
    const [className, setClassName] = useState('')

    console.log(myClasses)

    const [teacherList, setTeacherList] = useState([...new Set(myClasses.map(item => item.lecturer_name))])

    useEffect(() => {
        setTeacherList([...new Set(myClasses.map(item => item.lecturer_name))])
    }, [myClasses])

    useEffect(() => {
        if (className && myClasses.length > 0) {
            setClassList(myClasses.filter(item => item.class_name.includes(className)))
        }
        else setClassList(myClasses)
    }, [className])

    const [showFilter, setShowFilter] = useState(false)
    const [payload, setPayload] = useState({
        class_type: null,
        lecturer_name: null,
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
    }

    const RadioChoice = ({ type, text }) => {
        return (
            <TouchableOpacity onPress={() => {
                payload[type] === text ? setPayload(prev => ({ ...prev, [type]: null })) :
                    setPayload(prev => ({ ...prev, [type]: text }))
            }} style={{ minWidth: '50%' }}>
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
        <ScrollView style={styles.container}>
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
                                <Text style={{ fontSize: 16, fontWeight: '500' }}>Giảng viên :</Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                    {
                                        teacherList.length > 0 && teacherList.map((item, index) => {
                                            return (
                                                <View key={index}>
                                                    <RadioChoice type={'lecturer_name'} text={item} />
                                                </View>
                                            )
                                        })
                                    }
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
            <View style={{
                padding: 10
            }}>
                {classList.length === 0 && <Text style={{
                    fontStyle: 'italic',
                    color: 'gray',
                    textAlign: 'center'
                }}> Bạn chưa tham gia lớp học nào !</Text>}
                {classList.length > 0 && classList.map((item) => {
                    const { class_id, class_name, lecturer_name } = item
                    return (
                        <View key={item.class_id} style={{
                            marginBottom: 15
                        }}>
                            <ClassItem id={class_id} name={class_name} teacher={lecturer_name} currentId={currentId} setCurrentId={setCurrentId} />
                        </View>
                    )
                })}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15
    }
})

export default StudentClasses