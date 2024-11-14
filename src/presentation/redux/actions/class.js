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
        console.log('failed to get class list with status code: " + response.status')
        dispatch({
            type: actionTypes.GET_CLASS_LIST,
            data: null
        })
    }
}