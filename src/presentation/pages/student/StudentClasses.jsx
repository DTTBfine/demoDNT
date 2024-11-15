import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import ClassItem from '../../components/classItem'
import { useSelector } from 'react-redux'

const StudentClasses = () => {
    const [currentId, setCurrentId] = useState('')
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
            {myClasses.length > 0 && myClasses.map((item) => {
                return (
                    <View key={item.class_id} style={{
                        padding: 10
                    }}>
                        <ClassItem id={item.class_id} name={item.class_name} teacher={item.lecturer_name} currentId={currentId} setCurrentId={setCurrentId} />
                    </View>
                )
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