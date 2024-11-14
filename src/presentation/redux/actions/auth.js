import actionTypes from "./actionTypes";
import * as apis from '../../../data/api'
import { responseCodes } from "../../../utils/constants/responseCodes";

export const login = (payload) => async (dispatch) => {
    console.log('gọi đến login() trong actions')
    console.log('payload của hàm login là: ' + JSON.stringify(payload))
    try {
        const response = await apis.apiLogin(payload)
        console.log('Đã gọi api để lấy response')
        console.log('response: ' + response)
        if (response?.data.code === responseCodes.statusOK) {
            console.log('login success')
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
                message: response.data.message
            })
        }
    } catch (error) {
        dispatch({
            type: actionTypes.LOGIN_FAIL,
            message: error
        })
    }
}

export const logout = () => ({
    type: actionTypes.LOGOUT
})
