import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import ClassItem from '../../components/classItem'
import { useSelector } from 'react-redux'
import * as apis from '../../../data/api/index'

const StudentClasses = () => {
    const [currentId, setCurrentId] = useState('')
    const { isLoggedIn, msg, update, token, role, userId } = useSelector(state => state.auth)

    const { myClasses } = useSelector(state => state.learning)

    return (
        <ScrollView style={styles.container}>
            <View style={{
                margin: 10,
                padding: 10,
                backgroundColor: '#CCCCCC',
                flexDirection: 'row',
                borderRadius: 10
            }}>
                <Text> icon </Text>
                <Text>Tìm kiếm </Text>
            </View>
            <View style={{
                padding: 10
            }}>
                {myClasses.length === 0 && <Text style={{
                    fontStyle: 'italic',
                    color: 'gray',
                    textAlign: 'center'
                }}> Bạn chưa tham gia lớp học nào !</Text>}
                {myClasses.length > 0 && myClasses.map((item) => {
                    const { class_id, class_name, lecturer_name } = item
                    return (
                        <View key={item.class_id} style={{
                            padding: 10
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
        flex: 1
    }
})

export default StudentClasses