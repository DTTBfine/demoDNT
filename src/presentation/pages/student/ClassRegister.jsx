import { View, Text, ScrollView, TextInput, StyleSheet, Button, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as actions from '../../redux/actions'
import ClassBasicInfoItem from '../../components/classBasicInfoItem'
import * as apis from '../../../data/api/index'
import { responseCodes } from '../../../utils/constants/responseCodes'

const ClassRegister = () => {
    const dispatch = useDispatch()

    const classIdErrorType = 'class_id_error'
    const registerClassErrorType = 'register_class_error'
    const [classId, setClassId] = useState('')
    const [registerClassInfo, setRegisterClassInfo] = useState('')
    const [error, setError] = useState({
        type: '',
        message: ''
    })
    const { isLoggedIn, msg, update, token, role, userId } = useSelector(state => state.auth)
    const [classesList, setClassesList] = useState([])
    const [isChosen, setIsChosen] = useState('')
    const [checkedList, setCheckedList] = useState(new Map())

    const HeaderItem = {
        class_id: 'Mã lớp',
        class_name: 'Tên lớp',
        attached_code: 'Mã lớp kèm',
        class_type: 'Loại lớp',
        max_student_amount: 'Sinh viên tối đa',
        status: 'Trạng thái lớp',
        register_status: 'Trạng thái đăng ký'
    }

    const handleGetClassInfo = async () => {
        setError({
            type: '',
            message: ''
        })
        if (!classId) {
            setError({
                type: classIdErrorType,
                message: "mã lớp không được bỏ trống"
            })
            return
        }

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
            return [...prevClassesList, { ...classInfo, register_status: '...' }]
        });

        setClassId('')
    }

    const handleRegisterClass = async () => {
        setRegisterClassInfo('')
        setError({
            type: '',
            message: ''
        })
        const classIds = [...checkedList.keys()]
        if (classIds?.length === 0) {
            return setError({
                type: registerClassErrorType,
                message: "bạn chưa chọn đăng ký lớp nào"
            })
        }
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

        const info = response.data.data
        let regSuccessClasses = []
        let regFailedClasses = []

        info.forEach(item => {
            const matchingClass = classesList.find(cls => cls.class_id === item.class_id);

            if (matchingClass) {
                if (item.status.toUpperCase() === 'SUCCESS') {
                    regSuccessClasses.push(matchingClass.class_name);
                } else if (item.status.toUpperCase() === 'FAILED') {
                    regFailedClasses.push(matchingClass.class_name);
                }
            }
            setClassesList(prevClassesList =>
                prevClassesList.map(cls =>
                    cls.class_id === item.class_id
                        ? { ...cls, register_status: item.status }
                        : cls
                )
            );
        });

        if (regFailedClasses.length !== 0) {
            setError({
                type: registerClassErrorType,
                message: "Đăng ký các lớp sau không thành công: " + regFailedClasses.join(', ')
            })
        } else {
            setError({
                type: '',
                message: ''
            })
        }

        if (regSuccessClasses.length !== 0) {
            setRegisterClassInfo("Đăng ký các lớp sau thành công: " + regSuccessClasses.join(', '))
        }
        setCheckedList(new Map())

        // setClassesList([])
        dispatch(actions.getClassList({
            token: token,
            role: role,
            account_id: userId
        }))
    }

    const handleDeleteClass = async () => {
        setRegisterClassInfo('')
        setError({
            type: '',
            message: ''
        })
        const classIds = [...checkedList?.keys()]
        if (classIds?.length === 0) {
            return
        }

        let invalidClasses = [];

        for (let i = classesList.length - 1; i >= 0; i--) {
            if (!classIds.includes(classesList[i].class_id)) {
                continue
            }

            if (classesList[i].register_status.toUpperCase() === 'SUCCESS') {
                invalidClasses.push(classesList[i].class_name)
                continue
            }
            classesList.splice(i, 1)
        }


        if (invalidClasses?.length > 0) {
            setError({
                type: registerClassErrorType,
                message: "Không thể xóa các lớp đã đăng ký thành công: " + invalidClasses.join(', ')
            })
        }

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
                                                checkedList={isChosen}
                                                setCheckedList={setCheckedList}
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
                    onPress={async () => {
                        await handleDeleteClass()
                    }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontStyle: 'italic', fontSize: 16 }}> Xóa lớp</Text>
                </TouchableOpacity>
            </View>
            {error.type === registerClassErrorType && (
                <Text style={{ color: 'red', marginBottom: 10 }}>
                    {error.message}
                </Text>
            )}
            {registerClassInfo && (
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