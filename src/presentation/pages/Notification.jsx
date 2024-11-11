import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import NoteItem from '../components/NoteItem'

const testData = [
    1, 2, 3, 4, 5, 6
]

const Notification = () => {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.body}>
                {
                    testData.length > 0 && testData.map((item) => {
                        return (
                            <View key={item}>
                                <NoteItem />
                            </View>
                        )
                    })
                }
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EEEEEE"
    },
    body: {
        flexDirection: 'column',
        padding: 15,
        gap: 20
    }
})

export default Notification