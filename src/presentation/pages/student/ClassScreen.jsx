import { View, Text, ScrollView, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import AssignmentItem from '../../components/assignmentItem'

const ClassScreen = ({ route }) => {
    const { name, tabName } = route.params
    const [currentTab, setCurrentTab] = useState(tabName)

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
                {currentTab === 'Bài tập' && <UpcomingSurvey />}
                {currentTab === 'Tài liệu' && <MaterialList />}
            </ScrollView>
        </View>
    )
}

const UpcomingSurvey = () => {
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
                            <AssignmentItem />
                        </View>
                    )
                })
            }
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
        backgroundColor: '#EEEEEE'
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