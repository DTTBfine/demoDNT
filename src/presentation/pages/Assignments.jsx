import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useState } from 'react'
import AssignmentItem from '../components/assignmentItem'

const data = [
  {
    name: 'Participant Exercise 20.5.2024',
    class: '20232-IT4110E-147831',
    startTime: '',
    deadline: '',
    done: true,
    time: '16:46',
    date: '20-5-2024'
  },
  {
    name: 'Bài tập về ngoại lệ',
    class: 'OOP-ICT',
    startTime: '',
    deadline: '',
    done: true,
    time: '11:28',
    date: '16-5-2024'
  },
  {
    name: 'LAB 3: STATIC ROUTING IN IP NETWORKS',
    class: 'Sáng T6c2 738935',
    startTime: '',
    deadline: '',
    done: true,
    time: '16:46',
    date: '12-5-2024'
  },
  {
    name: 'Exercise about class diagram',
    class: 'OOP-ICT',
    startTime: '',
    deadline: '',
    done: true,
    time: '11:11',
    date: '9-5-2024'
  }
]

const Assignments = () => {
  const [state, setState] = useState('Sắp tới')

  const finalData = []

  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={{
          height: 80
        }}> Header </Text>
      </View>

      <View style={styles.list}>
        <AssignmentItem />
        <AssignmentItem />
        <AssignmentItem />
      </View>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 20,
    gap: 15
  }


})
export default Assignments