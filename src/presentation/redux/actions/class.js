import actionTypes from "./actionTypes";
import * as apis from '../../../data/api'
import { responseCodes } from "../../../utils/constants/responseCodes"
import { days } from "../../../utils/format";

//class
export const getClassList = (payload) => async (dispatch) => {
    const response = await apis.apiGetClassList(payload)
    if (response?.data.meta.code === responseCodes.statusOK) {
        dispatch({
            type: actionTypes.GET_CLASS_LIST,
            data: response.data.data.page_content
        })
    }
    else {
        console.log('failed to get class list with status code: ' + response.status)
        dispatch({
            type: actionTypes.GET_CLASS_LIST,
            data: null
        })
    }
}

export const getClassInfo = (payload) => async (dispatch) => {
    const response = await apis.apiGetClassInfo(payload)
    if (response?.data.meta.code === responseCodes.statusOK) {
        dispatch({
            type: actionTypes.GET_CLASS_INFO,
            data: response.data.data
        })
    }
    else {
        console.log('failed to get class info with status code: ' + response.status)
        dispatch({
            type: actionTypes.GET_CLASS_INFO,
            data: null
        })
    }
}

export const registerClass = (payload) => async (dispatch) => {
    const response = await apis.apiRegisterClass(payload)
    if (response?.data.meta.code === responseCodes.statusOK) {
        dispatch({
            type: actionTypes.REGISTER_CLASS_SUCCCESS
        })
        return
    }
    console.log("register failed")
    dispatch({
        type: actionTypes.REGISTER_CLASS_FAILED
    })
}

export const getBasicClassInfo = (payload) => async (dispatch) => {
    const response = await apis.apiGetBasicClassInfo(payload)
    if (response?.data.meta.code === responseCodes.statusOK) {
        dispatch({
            type: actionTypes.GET_BASIC_CLASS_INFO,
            data: response.data.data
        })
        return
    }
    dispatch({
        type: actionTypes.GET_BASIC_CLASS_INFO,
        data: null
    })
}

export const getOpenClasses = (payload) => async (dispatch) => {
    const response = await apis.apiGetOpenClasses(payload)
    if (response?.data.meta.code === responseCodes.statusOK) {
        return dispatch({
            type: actionTypes.GET_OPEN_CLASSES,
            data: response.data.data
        })
    }
    dispatch({
        type: actionTypes.GET_OPEN_CLASSES,
        data: null
    })
}

export const getClassesByFilter = (payload) => async (dispatch) => {
    const response = await apis.apiGetClassesByFilter(payload)
    if (response?.data?.meta?.code === responseCodes.statusOK) {
        return dispatch({
            type: actionTypes.GET_CLASSES_BY_FILTER,
            data: response.data.data
        })
    }

    console.log("error getting classes by filter: " + JSON.stringify(response.data))
    dispatch({
        type: actionTypes.GET_CLASSES_BY_FILTER,
        data: null
    })
}

//absence
export const getAbsenceRequests = (payload) => async (dispatch) => {
    const response = await apis.apiGetAbsenceRequests(payload)
    if (response?.data?.meta?.code === responseCodes.statusOK) {
        return dispatch({
            type: actionTypes.GET_ABSENCE_REQUEST,
            data: response.data.data.page_content
        })
    }
    dispatch({
        type: actionTypes.GET_ABSENCE_REQUEST,
        data: null
    })
}


//attendance
export const getAttendanceRecord = (payload) => async (dispatch) => {
    const response = await apis.apiGetAttendanceRecord(payload)
    if (response?.data?.meta?.code !== responseCodes.statusOK) {
        return dispatch({
            type: actionTypes.GET_ATTENDANCE_RECORD,
            data: null
        })
    }

    dispatch({
        type: actionTypes.GET_ATTENDANCE_RECORD,
        data: response?.data?.data
    })

}

export const getAttendanceDates = (payload) => async (dispatch) => {
    const response = await apis.apiGetAttendanceDates(payload)
    if (response?.data?.meta?.code === responseCodes.statusOK) {
        return dispatch({
            type: actionTypes.GET_ATTENDANCE_DATES,
            data: response?.data?.data
        })
    }

    return dispatch({
        type: actionTypes.GET_ATTENDANCE_DATES,
        data: null
    })
}


//assignment
export const getStudentAssignments = (payload) => async (dispatch) => {
    const response = await apis.apiGetStudentAssignments(payload)
    console.log('Đã lấy response của api get student assignments')
    if (response?.data.meta.code === responseCodes.statusOK) {
        dispatch({
            type: actionTypes.GET_STUDENT_ASSIGNMENTS,
            data: response.data.data
        })
    }
    else {
        console.log('failed to get all assignments list with status code: ' + response.status)
        dispatch({
            type: actionTypes.GET_STUDENT_ASSIGNMENTS,
            data: null
        })
    }
}

export const getStudentAssignmentsByClassId = (payload) => async (dispatch) => {
    const response = await apis.apiGetStudentAssignmentsByClassId(payload)
    if (response?.data.meta.code === responseCodes.statusOK) {
        dispatch({
            type: actionTypes.GET_STUDENT_ASSIGNMENTS_BY_CLASS_ID,
            data: response?.data?.data
        })
    }
    else {
        dispatch({
            type: actionTypes.GET_STUDENT_ASSIGNMENTS_BY_CLASS_ID,
            data: null
        })
    }
}

export const getUpcomingAssigments = (payload) => async (dispatch) => {
    const response = await apis.apiGetStudentAssignments(payload)
    if (response?.data.meta.code === responseCodes.statusOK) {
        dispatch({
            type: actionTypes.GET_UPCOMING_ASSIGNMENTS,
            data: response?.data?.data
        })
    }
    else {
        dispatch({
            type: actionTypes.GET_UPCOMING_ASSIGNMENTS,
            data: null
        })
    }
}

//getCompletedAssignments will return grade in each assignment if it's been graded
export const getCompletedAssigments = (payload) => async (dispatch) => {
    const response = await apis.apiGetStudentAssignments(payload)
    if (response?.data.meta.code === responseCodes.statusOK) {
        let assignmentsList = response?.data?.data
        for (let item of assignmentsList) {
            const submissionResponse = await apis.apiGetSubmission({
                token: payload.token,
                assignment_id: item?.id
            })
            if (submissionResponse?.data?.meta?.code === responseCodes.statusOK) {
                item.grade = submissionResponse?.data?.data?.grade
            } else {
                item.grade = null
            }
        }
        dispatch({
            type: actionTypes.GET_COMPLETED_ASSIGNMENTS,
            data: assignmentsList
        })
    }
    else {
        dispatch({
            type: actionTypes.GET_COMPLETED_ASSIGNMENTS,
            data: null
        })
    }
}


export const getPastDueAssigments = (payload) => async (dispatch) => {
    const response = await apis.apiGetStudentAssignments(payload)
    if (response?.data.meta.code === responseCodes.statusOK) {
        dispatch({
            type: actionTypes.GET_PAST_DUE_ASSIGNMENTS,
            data: response?.data?.data
        })
    }
    else {
        dispatch({
            type: actionTypes.GET_PAST_DUE_ASSIGNMENTS,
            data: null
        })
    }
}

export const getSubmission = (payload) => async (dispatch) => {
    const response = await apis.apiGetSubmission(payload)
    if (response?.data?.meta?.code === responseCodes.statusOK) {
        return dispatch({
            type: actionTypes.GET_SUBMISSION,
            data: response?.data?.data
        })
    }
    dispatch({
        type: actionTypes.GET_SUBMISSION,
        data: null
    })
}

export const getAllSurveys = (payload) => async (dispatch) => {
    const response = await apis.apiGetAllSurveys(payload)
    console.log('Đã lấy response của api get all survey of class')
    if (response?.data.meta.code === responseCodes.statusOK) {
        dispatch({
            type: actionTypes.GET_SURVEYS_OF_CLASS,
            data: response.data.data
        })
    }
    else {
        console.log('failed to get all surveys of class with status code: ' + response.status)
        dispatch({
            type: actionTypes.GET_SURVEYS_OF_CLASS,
            data: null
        })
    }
}


//notification
export const getUnreadNotificationCount = (payload) => async (dispatch) => {
    const response = await apis.apiGetUnreadNotificationCount(payload)
    if (response?.data.meta.code === responseCodes.statusOK) {
        dispatch({
            type: actionTypes.GET_UNREAD_NOTIFICATION_COUNT,
            data: response.data.data
        })
        return
    }
    dispatch({
        type: actionTypes.GET_UNREAD_NOTIFICATION_COUNT,
        data: null
    })
}


//material
export const getMaterialList = (payload) => async (dispatch) => {
    const response = await apis.apiGetMaterialList(payload)
    if (response?.data.code === responseCodes.statusOK) {
        dispatch({
            type: actionTypes.GET_MATERIAL_LIST,
            data: response.data.data
        })
    }
    else {
        console.log('failed to get material list with status code: ' + response.status)
        dispatch({
            type: actionTypes.GET_MATERIAL_LIST,
            data: null
        })
    }
}

export const getMaterialInfo = (payload) => async (dispatch) => {
    const response = await apis.apiGetMaterialInfo(payload)
    if (response?.data.code === responseCodes.statusOK) {
        dispatch({
            type: actionTypes.GET_MATERIAL_INFO,
            data: response.data.data
        })
    }
    else {
        console.log('failed to get material info with status code: ' + response.status)
        dispatch({
            type: actionTypes.GET_MATERIAL_INFO,
            data: null
        })
    }
}


//message










