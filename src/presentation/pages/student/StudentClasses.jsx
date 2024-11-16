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
            {myClasses?.length > 0 && myClasses.map((item) => {
                const newItem = { ...item, attached_code: item.attached_code || item.class_id };
                try {
                    return (
                        <View key={newItem?.class_id} style={{
                            padding: 10
                        }}>
                            <ClassItem 
                                id={newItem.class_id} 
                                name={newItem.class_name} 
                                teacher={newItem.lecturer_name} 
                                currentId={currentId} 
                                setCurrentId={setCurrentId} 
                            />
                        </View>
                    )
                } catch (error) {
                    console.log(error)
                }
                
            })}
            
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export default StudentClasses