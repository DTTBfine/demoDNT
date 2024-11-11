import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const NoteItem = () => {
    return (
        <View style={styles.container}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'baseline'
            }}>
                <Text style={{
                    color: '#AA0000',
                    fontWeight: 500
                }}>AIIHust</Text>
                <Text style={{
                    color: 'gray',
                    fontSize: 12
                }}>11/11/2024</Text>
            </View>
            <Text style={{
                fontWeight: '600',
                fontSize: 16,
                marginVertical: 5
            }}>Tên lớp học</Text>
            <View style={{
                borderTopWidth: 1,
                borderTopColor: '#DDDDDD',
                marginTop: 10,
                paddingVertical: 5
            }}>
                <Text>Nội dung của thông báo</Text>
            </View>
            <Text style={{
                textDecorationLine: 'underline',
                color: '#00CCEE',
                fontSize: 13,
                textAlign: 'right'
            }}>Chi tiết</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 15,
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10
    }
})

export default NoteItem