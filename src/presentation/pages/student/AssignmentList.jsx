import { View, Text, StyleSheet, ScrollView, Image, Dimensions, RefreshControl } from 'react-native'
import React, { createContext, useContext, useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../redux/actions'
import { assignmentStatus } from '../../../utils/constants/class';
import { classNameCode, getColorForId, getDisplayedAvatar } from '../../../utils/format';
import Spinner from 'react-native-loading-spinner-overlay';

const windowDimensions = Dimensions.get('window'); // Lấy kích thước của màn hình
const { width, height } = windowDimensions; // Đảm bảo rằng chúng ta truy cập đúng thuộc tính   

const size = {
  width: width,
  height: height
}

const days = ['chủ nhật', 'thứ hai', 'thứ ba', 'thứ tư', 'thứ năm', 'thứ sáu', 'thứ bảy']
const GlobalContext = createContext()

const AssignmentList = () => {
  const [state, setState] = useState('Sắp tới')
  const dispatch = useDispatch()
  const [dispatchData, setDispatchData] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  // const [displayedAssignments, setDisplayedAssignments] = useState([])
  const { token } = useSelector(state => state.auth)
  const { myClasses, upcomingAssignments, pastDueAssignments, completedAssignments } = useSelector(state => state.learning)

  const getClassNameById = (id) => {
    let classObj = myClasses.find(item => item.class_id == id)
    return classObj.class_name
  }

  useEffect(() => {
    if (dispatchData) {
      setIsLoading(true)
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
      // setTimeout(() => {
      //   setIsLoading(false)
      // }, 2000)
      setIsLoading(false)
      setDispatchData(false)
    }
  }, [])

  // useEffect(() => {
  //   switch (state) {
  //     case "Sắp tới":
  //       setDisplayedAssignments(upcomingAssignments);
  //       break;
  //     case "Quá hạn":
  //       setDisplayedAssignments(pastDueAssignments)
  //       break
  //     case "Đã hoàn thành":
  //       setDisplayedAssignments(completedAssignments)
  //       break
  //     default:
  //       setDisplayedAssignments([])
  //   }
  // }, [state])


  const navigate = useNavigation()

  const { userInfo } = useSelector(state => state.user)
  const avatarUri = getDisplayedAvatar(userInfo.avatar)

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <GlobalContext.Provider value={{isLoading, setIsLoading}}>
        <Spinner
          visible={isLoading}
          textContent={'Load dữ liệu bài tập...'}
          textStyle={{
            color: '#000'
          }}
        />
        <View style={{
          height: 80,
          backgroundColor: '#BB0000',
          justifyContent: "flex-start",
          alignItems: 'flex-end',
          padding: 15,
          paddingTop: 30,
          flexDirection: 'row',
          gap: 5
        }}>
          <Image
            source={avatarUri.length > 0 ? { uri: avatarUri } : require('../../../../assets/default-avatar.jpg')}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: 'gray'
            }}
          />
          <Text style={{
            fontSize: 28,
            fontWeight: '600',
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
        

        <ShowAssignmentsList state={state} />
        {/* <View style={styles.list}>
          <ScrollView>
            {displayedAssignments?.length === 0 && <Text style={{ textAlign: 'center', color: 'gray', fontWeight: '500', fontSize: 15, fontStyle: 'italic' }}>Không có bài tập nào</Text>}
            {
              displayedAssignments?.length > 0 && displayedAssignments?.map((item, index) => {
                const day = new Date(item.deadline)
                return (
                  <View key={index} style={{
                    gap: 10
                  }}>
                    <View style={{
                      flexDirection: "row",
                      alignItems: 'baseline',
                    }}>
                      <Text style={{
                        paddingHorizontal: 10,
                        fontSize: 17,
                        fontWeight: '600'
                      }}>
                        {day.getDate()} thg {day.getMonth() + 1}
                      </Text>
                      <Text style={{
                        color: 'gray',
                        fontSize: 14
                      }}>
                        {days[day.getDay()]}
                      </Text>
                    </View>
                    <AssignmentItem item={item} class_name={getClassNameById(item.class_id)} />
                  </View>
                )
              })
            }
          </ScrollView>
        </View> */}
        </GlobalContext.Provider>
      </View>
    </View>
  )
}

const AssignmentItem = ({ item, class_name }) => {

  return (
    <View style={{
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
    }}>
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
            }}>{classNameCode(class_name)}</Text>
          </View>
        </View>
        <View>
          <Text style={{
            fontSize: 16,
            fontWeight: 500
          }}>{item?.title}</Text>
          <Text style={{
            color: 'gray'
          }}>{class_name} </Text>
        </View>
      </View>
      <View>
        <Text style={{
          fontSize: 12,
          fontWeight: 500
        }}>
          {item?.grade ? `${item.grade}/10` : "Chưa có điểm"}
        </Text>
      </View>
    </View>
  )
}

const ShowAssignmentsList = ({state}) => {
  const dispatch = useDispatch()
  const { token } = useSelector(state => state.auth)
  const {isLoading, setIsLoading} = useContext(GlobalContext)
  const { myClasses, upcomingAssignments, pastDueAssignments, completedAssignments } = useSelector(state => state.learning)
  const [ displayedAssignments, setDisplayedAssignments] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const getClassNameById = (id) => {
    let classObj = myClasses.find(item => item.class_id == id)
    return classObj.class_name
  }
  
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
  }, [state, isLoading, upcomingAssignments, pastDueAssignments, completedAssignments])

  const handleRefresh = () => {
    setRefreshing(true)
    switch (state) {
      case "Sắp tới":
        dispatch(actions.getUpcomingAssigments({
          token: token,
          type: assignmentStatus.upcoming,
          class_id: null
        }))
        break
      case "Quá hạn":
        dispatch(actions.getPastDueAssigments({
          token: token,
          type: assignmentStatus.pastDue,
          class_id: null
        }))
        break
      case "Đã hoàn thành":
        dispatch(actions.getCompletedAssigments({
          token: token,
          type: assignmentStatus.completed,
          class_id: null
        }))
        break        
    } 
    setTimeout(() => {
      setRefreshing(false)
    }, 500);
  }

  return (
    <View style={styles.list}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh} 
              />
            }
          >
            {displayedAssignments?.length === 0 && <Text style={{ textAlign: 'center', color: 'gray', fontWeight: '500', fontSize: 15, fontStyle: 'italic' }}>Không có bài tập nào</Text>}
            {
              displayedAssignments?.length > 0 && !isLoading && displayedAssignments?.map((item, index) => {
                const day = new Date(item.deadline)
                return (
                  <View key={index} style={{
                    gap: 10
                  }}>
                    <View style={{
                      flexDirection: "row",
                      alignItems: 'baseline',
                    }}>
                      <Text style={{
                        paddingHorizontal: 10,
                        fontSize: 17,
                        fontWeight: '600'
                      }}>
                        {day.getDate()} thg {day.getMonth() + 1}
                      </Text>
                      <Text style={{
                        color: 'gray',
                        fontSize: 14
                      }}>
                        {days[day.getDay()]}
                      </Text>
                    </View>
                    <AssignmentItem item={item} class_name={getClassNameById(item.class_id)} />
                  </View>
                )
              })
            }
          </ScrollView>
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
    height: height - 130,
    marginBottom: 20,
    marginTop: 15
  }


})
export default AssignmentList