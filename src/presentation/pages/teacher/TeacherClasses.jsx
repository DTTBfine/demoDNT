import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { classNameCode, getColorForId } from '../../../utils/format'

const TeacherClasses = () => {
    const navigate = useNavigation()
    const { myClasses } = useSelector(state => state.learning)

    const [classList, setClassList] = useState(myClasses)
    const [classId, setClassId] = useState('')
    const [currentId, setCurrentId] = useState('')

    return (
        <View style={styles.container}>
            <View style={{
                flexDirection: 'row',
                gap: 15,
                marginBottom: 15,
                paddingHorizontal: 10
            }}>
                <TextInput
                    style={{
                        flex: 7,
                        borderWidth: 1,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderColor: '#CCCCCC',
                        borderRadius: 5,
                        elevation: 5,
                        backgroundColor: 'white'
                    }}
                    placeholder='Mã lớp'
                    placeholderTextColor="gray"
                    value={classId}
                    onChangeText={(text) => setClassId(text)}
                />
                <TouchableOpacity
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
                </TouchableOpacity>
            </View>
            <ScrollView >
                <View style={{ gap: 10 }}>
                    {myClasses.length === 0 && <Text>Bạn không phụ trách lớp nào</Text>}
                    {myClasses.length > 0 && myClasses.map((item, index) => {
                        const { class_id, class_name, class_type } = item
                        return (
                            <View key={index} style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                                <ClassBox class_id={class_id} class_name={class_name} class_type={class_type} currentId={currentId} setCurrentId={setCurrentId} />
                            </View>
                        )
                    })}
                </View>
            </ScrollView>

        </View>
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
                    //navigate.navigate('absenceRequest')
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