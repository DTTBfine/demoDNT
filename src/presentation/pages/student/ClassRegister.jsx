import { View, Text, ScrollView, TextInput, StyleSheet, Button, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as actions from '../../redux/actions'



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
    const {_, classInfo, classInfoErr, registerClassSuccess} = useSelector(state => state.learning)
    const [classesList, setClassesList] = useState([])
    
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
        dispatch(actions.getBasicClassInfo({
            token: token,
            class_id: classId
        }))
        setClassId('')
    }

    const handleRegisterClass = async () => {
        console.log("class list: " + classesList.length())
        if (classesList.length() == 0) {
            console.log("empty empty")
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
        const classIds = classesList.map(item => item.class_id);
        dispatch(actions.registerClass({
            token: token,
            class_ids: classIds
        }))
        setClassesList([])
    }

    useEffect(() => {
        if (classInfo.id === 0) {
            return
        }
        setClassesList(prevClassesList => {
            const exists = prevClassesList.some(item => item.id === classInfo.id);
            if (exists) {
                return prevClassesList
            }
            return [...prevClassesList, classInfo]
        });
    }, [classInfo]); 

    useEffect(() => {
        if (!classInfoErr) {
            return
        }
        setError({
            type: classIdErrorType,
            message: classInfoErr
        })
    }, [classInfoErr])

    useEffect(() => {
        if (!registerClassSuccess) {
            setError({
                type: registerClassErrorType,
                message: "đăng ký lớp không thành công"
            })
            return
        }
        setRegisterClassInfo("đăng ký lớp thành công")
    }, [])
   
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

            <View style={{
                borderWidth: 1,
                borderColor: '#BB0000',
                height: 300
            }}>
                <Text>Mã lớp - Mã lớp kèm - Tên lớp</Text>
                {classesList.length > 0 ? (
                classesList.map((classItem, index) => (
                    <Text key={index}>
                        {classItem.class_id} - {classItem.attached_code} - {classItem.class_name}
                    </Text>
                ))
            ) : (
                <Text>Sinh viên chưa đăng ký lớp nào</Text>
            )}
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