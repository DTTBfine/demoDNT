import actionTypes from "./actionTypes";
import * as apis from '../../../data/api'
import { responseCodes } from "../../../utils/constants/responseCodes";

export const login = (payload) => async (dispatch) => {
    const response = await apis.apiLogin(payload)
    if (response?.data.message) {
        if (response?.data.message === responseCodes.statusOK) {
            if (response?.data.data.role === 'STUDENT') {
                dispatch({
                    type: actionTypes.LOGIN_WITH_STUDENT_SUCCESS,
                    data: response.data.data
                })
            }
            else {
                dispatch({
                    type: actionTypes.LOGIN_WITH_TEACHER_SUCCESS,
                    data: response.data.data
                })
            }
        }
        else {
            dispatch({
                type: actionTypes.LOGIN_FAIL,
                data: response.data.message
            })
        }
    } else {
        console.error("failed to login with status code: " + response.status)
        dispatch({
            type: actionTypes.LOGIN_FAIL,
            data: null
        })
    }
}