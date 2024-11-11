import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { classNameCode, getRandomBasicColor, getRandomColor } from '../../utils/constant'
import { useNavigation } from '@react-navigation/native'

const ClassItem = ({ id, name, teacher, currentId, setCurrentId }) => {
    const navigate = useNavigation()
    //const [isExpanded, setIsExpanded] = useState(false)

    return (
        <View style={[styles.container, { borderWidth: 2, borderColor: currentId === id ? '#AA0000' : '#DDDDDD' }]}>
            <TouchableOpacity style={styles.titleBox} onPress={() => {
                //setIsExpanded(!isExpanded)
                setCurrentId(id)
                if (currentId === id) setCurrentId('0')
            }}>
                <View style={{
                    width: 55,
                    height: 55,
                    borderRadius: 10,
                    backgroundColor: getRandomColor(),
                    justifyContent: 'center'
                }}>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: '600',
                        textAlign: 'center',
                        color: 'white'
                    }}>{classNameCode(name)}</Text>
                </View>
                <View style={{
                    justifyContent: 'center'
                }}>
                    <Text style={{
                        fontSize: 17,
                        fontWeight: 500,
                    }}> {name} </Text>
                    <Text style={{
                        fontSize: 13,
                        color: 'gray'
                    }}> {teacher}</Text>
                </View>
            </TouchableOpacity>
            {currentId === id && <View style={{
                borderTopColor: '#CCCCCC',
                borderTopWidth: 1,
            }}>
                <Text style={styles.textBar}> Bài tập </Text>
                <Text style={styles.textBar}> Tài liệu</Text>
                <Text style={styles.textBar} onPress={() => {
                    navigate.navigate('absenceRequest')
                }}> Xin phép nghỉ học</Text>
            </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 15,
        backgroundColor: '#DDDDDD',
        paddingHorizontal: 10,
        paddingVertical: 15,
        gap: 10
    },
    titleBox: {
        flexDirection: 'row',
        gap: 10,
    },
    textBar: {
        padding: 8,
        fontWeight: '500'
    }
})

export default ClassItem