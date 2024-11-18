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
            data: response.data.data
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
    console.log("here here: " + response?.data.meta.code)
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
            type: actionTypes.GET_BASIC_CLASS_INFO_SUCCESS,
            data: response.data.data
        })
        return
    }
    dispatch({
        type: actionTypes.GET_BASIC_CLASS_INFO_FAILED,
        data: response.data.data
    })
}

//absence



//attendance


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










