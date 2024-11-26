import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { convertVNDate, getColorForId } from '../../utils/format'

const AssignmentItem = ({ item }) => {
    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', gap: 15, alignItems: 'flex-start' }}>
                <View style={{}}>
                    <View style={{
                        marginTop: 5,
                        width: 30,
                        height: 30,
                        backgroundColor: getColorForId(item.class_id),
                        borderRadius: 6,
                        justifyContent: 'center'
                    }}>
                        <Text style={{
                            color: 'white',
                            textAlign: 'center',
                        }}>BT</Text>
                    </View>
                </View>
                <View style={{}}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 500
                    }}>{item?.title}</Text>
                    <Text style={{
                        color: 'gray'
                    }}>Deadline: {convertVNDate(item.deadline)} </Text>
                </View>
            </View>
            <View style={{}}>
                <Text style={{
                    fontSize: 12,
                    fontWeight: 500
                }}>
                    {item.grade ? item.grade : "Chưa có điểm"}
                </Text>
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
        justifyContent: 'space-between',
        marginVertical: 10,
        marginHorizontal: 20
    }
})

export default AssignmentItem