import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native'
import React, { useState } from 'react'

const ClassBasicInfoItem = ({ isHeader, classItem, class_id, class_name, attached_code, class_type, student_count, status, isChoosed, setIsChoosed }) => {
    return (
        <View style={[styles.container, {
            backgroundColor: isHeader && '#AA0000',
            minHeight: isHeader && 60,

        }]}>
            <Cell isHeader={isHeader} width={100} data={classItem?.class_id} />
            <Cell isHeader={isHeader} width={200} data={classItem?.class_name} />
            <Cell isHeader={isHeader} width={100} data={classItem?.attached_code} />
            <Cell isHeader={isHeader} width={100} data={classItem?.class_type} />
            <Cell isHeader={isHeader} width={100} data={classItem?.student_count} />
            <Cell isHeader={isHeader} width={150} data={classItem?.status} />
            <View style={[styles.cell, { width: 150, borderRightWidth: 0 }]}>
                {isHeader ? <Text style={[styles.dataCell, { color: isHeader && 'white', fontWeight: isHeader ? '600' : '400' }]}>Thao tác</Text>
                    : <Pressable onPress={() => { isChoosed === classItem ? setIsChoosed({}) : setIsChoosed(classItem) }}
                        style={{
                            width: 20,
                            height: 20,
                            borderWidth: 1,
                            //borderRadius: 10,
                            backgroundColor: isChoosed === classItem ? '#AA0000' : 'white'
                        }} />
                }

            </View>
        </View>
    )
}

const Cell = ({ isHeader, width, data }) => {
    return (
        <View style={[styles.cell, { width: width }]}>
            <Text style={[styles.dataCell, { color: isHeader && 'white', fontWeight: isHeader ? '600' : '400' }]}>{data} </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    cell: {
        justifyContent: 'center',
        borderRightWidth: 1,
        borderColor: '#BBBBBB',
        alignItems: 'center'
    },
    dataCell: {
        textAlign: 'center',
        padding: 10
    }
})

export default ClassBasicInfoItem