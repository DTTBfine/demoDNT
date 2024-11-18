import { View, Text, ScrollView, TextInput, StyleSheet, Button, TouchableOpacity, Pressable } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'

const ClassManage = () => {
    const navigate = useNavigation()
    const { myClasses } = useSelector(state => state.learning)
    const [classList, setClassList] = useState(myClasses)
    const [classId, setClassId] = useState('') //lấy classId của input lọc
    const [isChoosed, setIsChoosed] = useState({}) //id lớp để chọn chỉnh sửa

    const HeaderItem = {
        class_id: 'Mã lớp',
        class_name: 'Tên lớp',
        attached_code: 'Mã lớp kèm',
        class_type: 'Loại lớp',
        student_count: 'Số lượng sinh viên',
        status: 'Trạng thái lớp',
    }

    return (
        <ScrollView style={styles.container}>
            <View style={{
                flexDirection: 'row',
                gap: 10,
                marginBottom: 15
            }}>
                <TextInput
                    style={{
                        flex: 7,
                        borderWidth: 1,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderColor: '#CC0000',
                        borderRadius: 5,
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
                        setClassList(myClasses.filter(classItem => classItem.class_id === classId))
                    }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontStyle: 'italic', fontSize: 16 }}> Tìm kiếm</Text>
                </TouchableOpacity>
            </View>

            <View>
                <ScrollView horizontal={true}>
                    <View style={{
                        gap: 10,
                        backgroundColor: 'white'
                    }}>
                        <ClassBasicInfoItem isHeader classItem={HeaderItem} />
                        <View style={{
                            width: '100%',
                            height: 300,
                            borderWidth: 1,
                            borderColor: "#AA0000"
                        }}>
                            <ScrollView>
                                {classList?.length === 0 && <Text style={{
                                    fontStyle: 'italic',
                                    color: 'gray',
                                    paddingHorizontal: 20,
                                    paddingVertical: 10
                                }}>Không có lớp phù hợp</Text>}
                                {classList?.length > 0 && classList.map((item) => {
                                    return (
                                        <View key={item.class_id}>
                                            <ClassBasicInfoItem
                                                classItem={item}
                                                isChoosed={isChoosed}
                                                setIsChoosed={setIsChoosed}
                                            />
                                        </View>
                                    )
                                })}
                            </ScrollView>
                        </View>
                    </View>
                </ScrollView>
            </View>

            <View style={{
                flexDirection: 'row',
                gap: 5,
                marginVertical: 10
            }}>
                <TouchableOpacity
                    style={{
                        flex: 5,
                        backgroundColor: "#BB0000",
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 15,
                        paddingVertical: 10
                    }}
                    onPress={() => {
                        navigate.navigate('AddClass')
                    }}>
                    <Text style={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontStyle: 'italic',
                        fontSize: 16
                    }}>
                        Tạo lớp học
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        flex: 5,
                        backgroundColor: "#BB0000",
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 15,
                        paddingVertical: 10
                    }}
                    onPress={() => {
                        navigate.navigate('EditClass', { isChoosed })
                    }}>
                    <Text style={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontStyle: 'italic',
                        fontSize: 16
                    }}>
                        Chỉnh sửa
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={{
                marginTop: 20
            }}>
                <Text style={{
                    color: '#BB0000',
                    textDecorationLine: 'underline',
                    fontStyle: 'italic',
                    fontWeight: 'bold',
                    textAlign: 'center'
                }}>Thông tin danh sách các lớp mở</Text>
            </View>

        </ScrollView>
    )
}

const ClassBasicInfoItem = ({ isHeader, classItem, isChoosed, setIsChoosed }) => {
    return (
        <View style={{
            backgroundColor: isHeader && '#AA0000',
            minHeight: isHeader && 60,
            flexDirection: 'row',
            alignItems: 'center'
        }}>
            <Cell isHeader={isHeader} width={100} data={classItem?.class_id} />
            <Cell isHeader={isHeader} width={200} data={classItem?.class_name} />
            <Cell isHeader={isHeader} width={100} data={classItem?.attached_code || classItem?.class_id} />
            <Cell isHeader={isHeader} width={100} data={classItem?.class_type} />
            <Cell isHeader={isHeader} width={100} data={classItem?.student_count || classItem?.max_student_amount} />
            <Cell isHeader={isHeader} width={150} data={classItem?.status} />
            <View style={[styles.cell, { width: 150, borderRightWidth: 0 }]}>
                {isHeader ? <Text style={[styles.dataCell, { color: isHeader && 'white', fontWeight: isHeader ? '600' : '400' }]}>Thao tác</Text>
                    : <Pressable onPress={() => { setIsChoosed(classItem) }}
                        style={{
                            width: 20,
                            height: 20,
                            borderWidth: 1,
                            //borderRadius: 10,
                            backgroundColor: isChoosed === classItem ? '#AA0000' : 'white'
                        }} />
                }

            </View>
        </View >
    )
}

const Cell = ({ isHeader, width, data }) => {
    return (
        <View style={[styles.cell, { width: width }]}>
            <Text style={[styles.dataCell, { color: isHeader && 'white', fontWeight: isHeader ? '600' : '400' }]}>{data} </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
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
    }
})

export default ClassManage