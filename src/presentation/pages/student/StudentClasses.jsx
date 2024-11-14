import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import ClassItem from '../../components/classItem'
import { useSelector } from 'react-redux'

const testData = [
    {
        id: 1,
        name: 'Đa nền tảng',
        teacher: 'Nguyen Tien Thanh'
    },
    {
        id: 2,
        name: 'Lưu trữ và xử lý dữ liệu lớn',
        teacher: 'Tran Viet Trung'
    },
    {
        id: 3,
        name: 'Học sâu và ứng dụng',
        teacher: 'Trinh Anh Phuc'
    },
    {
        id: 4,
        name: 'Nhập môn Khoa học dữ liệu',
        teacher: 'Pham Van Hai'
    },
]

const StudentClasses = () => {
    const [currentId, setCurrentId] = useState('')
    const { myClasses } = useSelector(state => state.learning)
    console.log('classList: ' + myClasses)

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