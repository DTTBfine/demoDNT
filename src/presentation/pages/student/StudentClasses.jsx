import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import ClassItem from '../../components/classItem'
import { getValue } from '../../../utils/localStorage'
import { getClassListRequest } from '../../../data/api'
import { responseCodes } from '../../../utils/constants/responseCodes'

// const testData = [
//     {
//         id: 1,
//         name: 'Đa nền tảng',
//         teacher: 'Nguyen Tien Thanh'
//     },
//     {
//         id: 2,
//         name: 'Lưu trữ và xử lý dữ liệu lớn',
//         teacher: 'Tran Viet Trung'
//     },
//     {
//         id: 3,
//         name: 'Học sâu và ứng dụng',
//         teacher: 'Trinh Anh Phuc'
//     },
//     {
//         id: 4,
//         name: 'Nhập môn Khoa học dữ liệu',
//         teacher: 'Pham Van Hai'
//     },
// ]

const getClassList = async () => {
    const [token, account_id] = await Promise.all([
        getValue('token'),
        getValue('userId')
    ])

    const payload = {
        token: token,
        role: "STUDENT",
        account_id: account_id
    }


    const response = await getClassListRequest(payload)
    const code = response.data.meta.code;
    if (!code) {
        return console.error('failed to get user info with status code: ' + response.status);
    }

    if (code !== responseCodes.statusOK) {
        return console.error("failed to get user info: " + response.data.meta.message);
    }

    return response.data.data;

}

const StudentClasses = () => {
    const [currentId, setCurrentId] = useState('')
    const [classList, setClassList] = useState(null)
    useEffect(() => {
        const fetchClassList = async () => {
            try {
                const data = await getClassList();
                setClassList(data);
            } catch (error) {
                console.error("error fetching class list: " + error);
            }
        };

        fetchClassList();
    }, []);
    if (!classList) {
        return <Text>Loading...</Text>;
    }

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
            {classList.length > 0 && classList.map((item) => {
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