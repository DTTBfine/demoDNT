import { View, Text, ScrollView, TextInput, StyleSheet, Button, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as actions from '../../redux/actions'
import ClassBasicInfoItem from '../../components/classBasicInfoItem'
import * as apis from '../../../data/api/index'
import { responseCodes } from '../../../utils/constants/responseCodes'

const ClassRegister = () => {
    const classIdErrorType = 'class_id_error'
    const registerClassErrorType = 'register_class_error'
    const dispatch = useDispatch()
    const [classId, setClassId] = useState('')
    const [registerClassInfo, setRegisterClassInfo] = useState('')
    const [error, setError] = useState({
        type: '',
        message: ''
    })
    const { isLoggedIn, msg, update, token, role, userId } = useSelector(state => state.auth)
    const [classesList, setClassesList] = useState([])
    const [isChosen, setIsChosen] = useState('')
    
    const HeaderItem = {
        class_id: 'Mã lớp',
        class_name: 'Tên lớp',
        attached_code: 'Mã lớp kèm',
        class_type: 'Loại lớp',
        student_count: 'Số lượng sinh viên',
        status: 'Trạng thái lớp',
    }
    
    const handleGetClassInfo = async () => {
        if (!classId) {
            setError({
                type: classIdErrorType,
                message: "mã lớp không được bỏ trống"
            })
            return
        }

        setError({
            type: '',
            message: ''
        })
        


        const response = await apis.apiGetBasicClassInfo({
            token: token, 
            class_id: classId
        })
        if (response?.data.meta.code !== responseCodes.statusOK) {
            return setError({
                type: classIdErrorType,
                message: response.data.data
            })
        }
        const classInfo = response.data.data
        setClassesList(prevClassesList => {
            const exists = prevClassesList.some(item => item.id === classInfo.id);
            if (exists) {
                return prevClassesList
            }
            return [...prevClassesList, classInfo]
        });

        setClassId('')
    }

    const handleRegisterClass = async () => {
        if (classesList?.length == 0) {
            setError({
                type: registerClassErrorType,
                message: "bạn chưa chọn đăng ký lớp nào"
            })
            return
        }
        setError({
            type: '',
            message: ''
        })
        const classIds = classesList.map(item => String(item.class_id));
        console.log("hehe " + JSON.stringify({
            token: token,
            class_ids: classIds
        }))
        const response = await apis.apiRegisterClass({
            token: token,
            class_ids: classIds
        })
        if (response?.data.meta.code !== responseCodes.statusOK) {
            return setError({
                type: registerClassErrorType,
                message: response?.data.meta.message
            })
        }

        setError({
            type: '',
            message: ''
        })
        setRegisterClassInfo("đăng ký lớp thành công")
        // dispatch(actions.registerClass({
        //     token: token,
        //     class_ids: classIds
        // }))
        setClassesList([])
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
                        borderColor: '#CC0000'
                    }}
                    value={classId}
                    onChangeText={(text) => setClassId(text)}
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
                    onPress={async () => {
                        await handleGetClassInfo();
                    }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontStyle: 'italic', fontSize: 16 }}> Đăng ký</Text>
                </TouchableOpacity>
            </View>

            {error.type === classIdErrorType && (
                <Text style={{ color: 'red', marginBottom: 10 }}>
                    {error.message}
                </Text>
            )}


            <View>
                <ScrollView horizontal={true}>
                    <View style={{
                        gap: 10
                    }}>
                        <ClassBasicInfoItem isHeader classItem={HeaderItem} />
                        <View style={{
                            width: '100%',
                            height: 300,
                            borderWidth: 1,
                            borderColor: "#AA0000"
                        }}>
                            <ScrollView>
                                {classesList?.length === 0 && <Text style={{
                                    fontStyle: 'italic',
                                    color: 'gray',
                                    paddingHorizontal: 20,
                                    paddingVertical: 10
                                }}>Bạn chưa chọn đăng ký lớp nào</Text>}
                                {classesList?.length > 0 && classesList.map((item) => {
                                    return (
                                        <View key={item.class_id}>
                                            <ClassBasicInfoItem
                                                classItem={item}
                                                isChoosed={isChosen}
                                                setIsChoosed={setIsChosen}
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
                    onPress={async () => {
                        await handleRegisterClass();
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
            {error.type === registerClassErrorType && (
                <Text style={{ color: 'red', marginBottom: 10 }}>
                    {error.message}
                </Text>
            )}
            { registerClassInfo && (
                <Text style={{ color: 'green', marginBottom: 10 }}>
                    {registerClassInfo}
                </Text>
            )}

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