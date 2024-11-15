import { View, Text, ScrollView, TextInput, StyleSheet, Button, TouchableOpacity } from 'react-native'
import React from 'react'
import ClassBasicInfoItem from '../../components/classBasicInfoItem'
import { useSelector } from 'react-redux'

const ClassRegister = () => {
    //const { classList } = useSelector(state => state.learning)
    // const HeaderItem = {
    //     class_id: 'Mã lớp',
    //     class_name: 'Tên lớp',
    //     attached_code: 'Mã lớp kèm',
    //     class_type: 'Loại lớp',
    //     student_count: 'Số lượng sinh viên',
    //     status: 'Trạng thái lớp',
    // }
    //console.log(JSON.stringify(classList[0]))

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
                        borderColor: '#CC0000'
                    }}
                    placeholder='Mã lớp'
                    placeholderTextColor="gray"
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

                    }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontStyle: 'italic', fontSize: 16 }}> Đăng ký</Text>
                </TouchableOpacity>
            </View>

            <View>
                <ScrollView horizontal={true}>
                    <View style={{
                        gap: 10
                    }}>
                        {/* <ClassBasicInfoItem isHeader classItem={HeaderItem} /> */}
                        <View style={{
                            width: '100%',
                            height: 300,
                            borderWidth: 1,
                            borderColor: "#AA0000"
                        }}>
                            <ScrollView>
                                {/* {classList?.length === 0 && <Text style={{
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
                                })} */}
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

                    }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontStyle: 'italic', fontSize: 16 }}> Gửi đăng ký</Text>
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

                    }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontStyle: 'italic', fontSize: 16 }}> Xóa lớp</Text>
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

const styles = StyleSheet.create({
    container: {
        padding: 20,
    }
})

export default ClassRegister