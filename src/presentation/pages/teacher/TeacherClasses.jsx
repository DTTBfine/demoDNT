import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { classNameCode, getColorForId } from '../../../utils/format'

const TeacherClasses = () => {
    const navigate = useNavigation()
    const { myClasses } = useSelector(state => state.learning)
    console.log(JSON.stringify(myClasses))

    const [classList, setClassList] = useState(myClasses)
    const [classId, setClassId] = useState('')

    return (
        <View style={styles.container}>
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
            <ScrollView >
                <View style={{ gap: 10 }}>
                    {myClasses.length === 0 && <Text>Bạn không phụ trách lớp nào</Text>}
                    {myClasses.length > 0 && myClasses.map((item, index) => {
                        const { class_id, class_name, class_type } = item
                        return (
                            <View key={index}>
                                <ClassBox class_id={class_id} class_name={class_name} class_type={class_type} />
                            </View>
                        )
                    })}
                </View>
            </ScrollView>

        </View>
    )
}

const ClassBox = ({ class_id, class_name, class_type }) => {
    const navigate = useNavigation()
    console.log('class_id: ' + class_id)
    return (
        <TouchableOpacity style={styles.titleBox} onPress={() => navigate.navigate('addSurvey', { class_id: class_id })}>
            <View style={{
                width: 55,
                height: 55,
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
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 15
    },
    titleBox: {
        flexDirection: 'row',
        gap: 10,
        backgroundColor: 'papayawhip',
        padding: 10,
        borderRadius: 10
    }
})

export default TeacherClasses