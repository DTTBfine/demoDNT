import actionTypes from './actionTypes'
import * as apis from '../../../data/api'
import { responseCodes } from "../../../utils/constants/responseCodes";

export const getUserInfo = (payload) => async (dispatch) => {
    const response = await apis.apiGetUserInfo(payload)
    if (response?.data?.code) {
        if (response?.data.code === responseCodes.statusOK) {
            dispatch({
                type: actionTypes.GET_USER_INFO,
                data: response.data.data
            })
        }
        else {
            dispatch({
                type: actionTypes.GET_USER_INFO,
                data: response.data.message
            })
        }
    } else {
        console.error("failed to get user info with status code: " + response.status)
        dispatch({
            type: actionTypes.GET_USER_INFO,
            data: null
        })
    }
}
