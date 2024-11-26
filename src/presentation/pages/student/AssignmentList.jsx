import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import AssignmentItem from '../../components/assignmentItem'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../redux/actions'
import { assignmentStatus } from '../../../utils/constants/class';

const windowDimensions = Dimensions.get('window'); // Lấy kích thước của màn hình
const { width, height } = windowDimensions; // Đảm bảo rằng chúng ta truy cập đúng thuộc tính   

const size = {
  width: width,
  height: height
}

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

const testData = [
  {
    day: 'thứ hai',
    date: '20',
    month: '5',
    year: '2024'
  },
  {
    day: 'thứ năm',
    date: '16',
    month: '5',
    year: '2024'
  },
  {
    day: 'chủ nhật',
    date: '12',
    month: '5',
    year: '2024'
  },
  {
    day: 'thứ năm',
    date: '9',
    month: '5',
    year: '2024'
  },
  {
    day: 'thứ sáu',
    date: '26',
    month: '4',
    year: '2024'
  },
  {
    day: 'thứ năm',
    date: '25',
    month: '4',
    year: '2024'
  },
]

const AssignmentList = () => {
  const [state, setState] = useState('Sắp tới')
  const dispatch = useDispatch()
  const [dispatchData, setDispatchData] = useState(true)
  const [displayedAssignments, setDisplayedAssignments] = useState([])
  const { token } = useSelector(state => state.auth)
  const { upcomingAssignments, pastDueAssignments, completedAssignments } = useSelector(state => state.learning)
  

  useEffect(() => {
    if (dispatchData) {

      dispatch(actions.getCompletedAssigments({
        token: token,
        type: assignmentStatus.completed,
        class_id: null
      }))

      dispatch(actions.getUpcomingAssigments({
        token: token,
        type: assignmentStatus.upcoming,
        class_id: null
      }))

      dispatch(actions.getPastDueAssigments({
        token: token,
        type: assignmentStatus.pastDue,
        class_id: null
      }))

    setDispatchData(false)
    }
  }, [])

  useEffect(() => {

    switch (state) {
      case "Sắp tới":
        setDisplayedAssignments(upcomingAssignments);
        break;
      case "Quá hạn":
        setDisplayedAssignments(pastDueAssignments)
        break
      case "Đã hoàn thành":
        setDisplayedAssignments(completedAssignments)
        break
      default:
        setDisplayedAssignments([])
    }
  }, [state])
 
  const navigate = useNavigation()

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={{
          height: 80,
          backgroundColor: '#BB0000',
          justifyContent: "flex-start",
          alignItems: 'flex-end',
          padding: 15,
          flexDirection: 'row',
          gap: 5
        }}>
          <Image
            source={require('../../../../assets/default-avatar.jpg')}
            style={{
              width: 30,
              height: 30,
              borderRadius: 20,
            }}
          />
          <Text style={{
            fontSize: 22,
            fontWeight: 'bold',
            color: 'white'
          }} > Bài tập </Text>
        </View>

        <View style={styles.tabBar}>
          <View style={state === 'Sắp tới' ? styles.tabItemActive : styles.tabItemInactive}>
            <Text style={state === 'Sắp tới' && styles.textActive}
              onPress={() => { setState('Sắp tới') }}
            >Sắp tới</Text>
          </View>
          <View style={state === 'Quá hạn' ? styles.tabItemActive : styles.tabItemInactive}>
            <Text style={state === 'Quá hạn' && styles.textActive}
              onPress={() => { setState('Quá hạn') }}
            >Quá hạn</Text>
          </View>
          <View style={state === 'Đã hoàn thành' ? styles.tabItemActive : styles.tabItemInactive}>
            <Text style={state === 'Đã hoàn thành' && styles.textActive}
              onPress={() => { setState('Đã hoàn thành') }}
            >Đã hoàn thành</Text>
          </View>
        </View>

        <ScrollView style={styles.list}>
          {displayedAssignments?.length === 0 && <Text style={{ textAlign: 'center', color: 'gray', fontWeight: '500', fontSize: 15, fontStyle: 'italic' }}>Không có bài tập nào</Text>}
          {
            displayedAssignments?.length > 0 && displayedAssignments?.map((item, index) => {
              const day = new Date()
              return (
                <View key={index} style={{
                  gap: 10
                }}>
                  <View style={{
                    flexDirection: "row",
                    alignItems: 'baseline',
                    gap: 10
                  }}>
                    <Text style={{
                      fontSize: 17,
                      fontWeight: '600'
                    }}>
                      {day.date} thg {day.month}
                    </Text>
                    <Text style={{
                      color: 'gray',
                      fontSize: 14
                    }}>
                      {day.day}
                    </Text>
                  </View>
                  <AssignmentItem item={item} />
                </View>
              )
            })
          }
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: size.height,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: "space-around",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  tabItemActive: {
    backgroundColor: '#BB0000',
    color: 'white',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 15

  },
  tabItemInactive: {
    backgroundColor: '#CCCCCC',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 15
  },
  textActive: {
    color: 'white',
    fontWeight: 'bold'
  },
  list: {
    padding: 20,
    gap: 15
  }


})
export default AssignmentList