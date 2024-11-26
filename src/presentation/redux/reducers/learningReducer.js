import { act } from 'react'
import actionTypes from '../actions/actionTypes'

const initState = {
    myClasses: [],
    currentClass: {},
    currentClassBasic: {},
    classMaterial: [],
    allStudentAssignment: [],
    studentAssignmentsByClassId: [],
    completedAssignments: [],
    upcomingAssignments: [],
    pastDueAssignments: [],
    surveyOfCurrentClass: [],
    attendanceRecord: {}
}

const learningReducer = (state = initState, action) => {
    switch (action.type) {
        //class
        case actionTypes.GET_CLASS_LIST:
            return {
                ...state,
                myClasses: action.data || []
            }
        case actionTypes.GET_CLASS_INFO:
            return {
                ...state,
                currentClass: action.data || {}
            }
        case actionTypes.GET_BASIC_CLASS_INFO:
            return {
                ...state,
                currentClassBasic: action.data || {}
            }
        //attendance
        case actionTypes.GET_ATTENDANCE_RECORD:
            return {
                ...state,
                attendanceRecord: action.data || {}
            }

        //absence

        //assignment
        case actionTypes.GET_STUDENT_ASSIGNMENTS:
            return {
                ...state,
                allStudentAssignment: action.data || []
            }
        case actionTypes.GET_STUDENT_ASSIGNMENTS_BY_CLASS_ID:
            return {
                ...state,
                studentAssignmentsByClassId: action.data || []
            }
        case actionTypes.GET_COMPLETED_ASSIGNMENTS:
            return {
                ...state,
                completedAssignments: action.data || []
            }
        case actionTypes.GET_PAST_DUE_ASSIGNMENTS:
            return {
                ...state,
                pastDueAssignments: action.data || []
            }
        case actionTypes.GET_UPCOMING_ASSIGNMENTS:
            return {
                ...state,
                upcomingAssignments: action.data || []
            }
        case actionTypes.GET_SURVEYS_OF_CLASS:
            return {
                ...state,
                surveyOfCurrentClass: action.data || []
            }

        //material
        case actionTypes.GET_MATERIAL_LIST:
            return {
                ...state,
                classMaterial: action.data || []
            }
        case actionTypes.LOGOUT:
            return {
                ...state,
                myClasses: []
            }
        default:
            return state;
    }
}

export default learningReducer