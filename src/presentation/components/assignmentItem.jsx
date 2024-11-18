import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const AssignmentItem = ({ }) => {
    return (
        <View style={styles.container}>
            <View style={{
                flex: 1,
            }}>
                <View style={{
                    width: 30,
                    height: 30,
                    backgroundColor: '#009999',
                    borderRadius: 6,
                    justifyContent: 'center'
                }}>
                    <Text style={{
                        color: 'white',
                        textAlign: 'center',
                    }}>ST</Text>
                </View>
            </View>
            <View style={{
                flex: 8
            }}>
                <Text style={{
                    fontSize: 16,
                    fontWeight: 500
                }}> Tên bài</Text>
                <Text style={{
                    color: 'gray'
                }}> Đã làm gì lúc </Text>
                <Text style={{
                    color: 'gray'
                }}> Tên lớp</Text>
            </View>
            <View style={{
                flex: 3
            }}>
                <Text style={{
                    fontSize: 12,
                    fontWeight: 500
                }}>10/10 điểm</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderColor: '#CCCCCC',
        elevation: 5,
        borderRadius: 15,
        padding: 15,
        gap: 15
    }
})

export default AssignmentItem