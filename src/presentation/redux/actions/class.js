import actionTypes from "./actionTypes";
import * as apis from '../../../data/api'
import { responseCodes } from "../../../utils/constants/responseCodes"
import { days } from "../../../utils/format";

export const getClassList = (payload) => async (dispatch) => {
    const response = await apis.apiGetClassList(payload)
    if (response?.data.meta.code === responseCodes.statusOK) {
        dispatch({
            type: actionTypes.GET_CLASS_LIST,
            data: response.data.data
        })
    }
    else {
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
        console.log('failed to get class info with status code: " + response.status')
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


