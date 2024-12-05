import actionTypes from "./actionTypes";
import * as apis from '../../../data/api'
import { responseCodes } from "../../../utils/constants/responseCodes";

export const login = (payload) => async (dispatch) => {
    try {
        const response = await apis.apiLogin(payload)
        if (response?.data.code === responseCodes.statusOK) {
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

export const saveFcmToken = (fcmToken) => {
    return {
      type: actionTypes.SAVE_FCM_TOKEN,
      token: fcmToken,
    };
  };