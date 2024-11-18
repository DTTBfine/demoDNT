import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { classNameCode, getColorForId } from '../../utils/format'
import { useSelector } from 'react-redux'
import * as DocumentPicker from 'expo-document-picker';

const CustomTeacherClass = ({ id, name, type }) => {
    const navigate = useNavigation()

    return (
        <View style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        }}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 8
            }}>
                <View style={{
                    width: 35,
                    height: 35,
                    borderRadius: 5,
                    backgroundColor: getColorForId(id),
                    justifyContent: 'center'
                }}>
                    <Text style={{
                        fontSize: 15,
                        fontWeight: '600',
                        textAlign: 'center',
                        color: 'white'
                    }}>{classNameCode(name)}</Text>
                </View>
                <View style={{
                    justifyContent: 'center'
                }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 500,
                        color: 'white'
                    }}> {name} </Text>
                    <Text style={{
                        fontSize: 12,
                        color: '#CCCCCC'
                    }}> {type}</Text>
                </View>
            </View>
            <TouchableOpacity onPress={() => navigate.navigate('addMaterial', { class_id: id })}>
                <Text style={{
                    fontSize: 38,
                    fontWeight: '300',
                    color: 'white'
                }}>+</Text>
            </TouchableOpacity>
        </View>
    )
}

export default CustomTeacherClass