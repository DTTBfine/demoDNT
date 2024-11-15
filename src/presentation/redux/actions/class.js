import actionTypes from "./actionTypes";
import * as apis from '../../../data/api'
import { responseCodes } from "../../../utils/constants/responseCodes"

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


