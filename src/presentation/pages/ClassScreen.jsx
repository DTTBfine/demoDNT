import { View, Text, ScrollView, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import AssignmentItem from '../components/assignmentItem'
import { useSelector } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useNavigation } from '@react-navigation/native'

const ClassScreen = ({ route }) => {
    const { id, name, tabName } = route.params
    const [currentTab, setCurrentTab] = useState(tabName)
    const { role } = useSelector(state => state.auth)

    return (
        <View style={styles.cotainer}>
            <View style={{
                flexDirection: 'row'
            }}>
                <View style={[styles.tabItem, currentTab === "Bài tập" && styles.tabActive]}>
                    <Text onPress={() => setCurrentTab('Bài tập')}
                        style={[styles.tabName, currentTab === "Bài tập" && styles.tabNameActive]}>Bài tập</Text>
                </View>
                <View style={[styles.tabItem, currentTab === "Tài liệu" && styles.tabActive]}>
                    <Text onPress={() => setCurrentTab('Tài liệu')}
                        style={[styles.tabName, currentTab === "Tài liệu" && styles.tabNameActive]}>Tài liệu</Text>
                </View>
            </View>
            <ScrollView>
                {currentTab === 'Bài tập' && <UpcomingSurvey class_id={id} />}
                {currentTab === 'Tài liệu' && <MaterialList />}
            </ScrollView>
        </View>
    )
}

const UpcomingSurvey = ({ class_id }) => {
    const navigate = useNavigation()
    const { role } = useSelector(state => state.auth)
    const testData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    return (
        <View>
            <ScrollView style={{
                padding: 10,
                gap: 10,
                marginBottom: 20
            }}>
                {
                    testData.length > 0 && testData.map((item, index) => {
                        return (
                            <View key={index} style={{ padding: 10 }}>
                                <AssignmentItem />
                            </View>
                        )
                    })
                }
            </ScrollView>
            {role === 'LECTURER' && <View style={{
                position: 'absolute',
                top: 600,
                right: 30,
                backgroundColor: '#AA0000',
                width: 50,
                height: 50,
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Icon name="plus" color='white' size={40}
                    onPress={() => {
                        navigate.navigate("addSurvey", { class_id: class_id })
                    }}
                />
            </View>}
        </View>
    )
}

const MaterialList = () => {
    const testData = [1, 2, 3, 4]
    return (
        <View style={{
            padding: 10,
            gap: 10
        }}>
            {
                testData.length > 0 && testData.map((item, index) => {
                    return (
                        <View key={index}>
                            <Text> Tài liệu thứ {item} </Text>
                        </View>
                    )
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    cotainer: {
        backgroundColor: '#EEEEEE',
        flex: 1
    },
    tabItem: {
        flex: 1,
        backgroundColor: '#EEEEEE'
    },
    tabActive: {
        backgroundColor: '#BB0000',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    tabName: {
        textTransform: 'uppercase',
        fontWeight: '500',
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
        padding: 10
    },
    tabNameActive: {
        color: 'white',
        fontWeight: '800',
        borderTopWidth: 3,
        borderColor: 'cornflowerblue',
    }
})

export default ClassScreen