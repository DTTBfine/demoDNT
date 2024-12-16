import actionTypes from "./actionTypes";
import * as apis from '../../../data/api'
import { responseCodes } from "../../../utils/constants/responseCodes";

export const getListConversation = (payload) => async (dispatch) => {
    const response = await apis.apiGetListConversation(payload)
    if (response?.data?.meta?.code === responseCodes.statusOK) {
        return dispatch({
            type: actionTypes.GET_LIST_CONVERSATION,
            data: response.data.data.conversations
        })
    }
    return dispatch({
        type: actionTypes.GET_LIST_CONVERSATION,
        data: null
    })
}

export const getConversation = (payload) => async (dispatch) => {
    const response = await apis.apiGetConversation(payload)
    if (response?.data?.meta?.code === responseCodes.statusOK) {
        return dispatch({
            type: actionTypes.GET_CONVERSATION,
            data: response.data.data.conversation
        })
    }
    return dispatch({
        type: actionTypes.GET_CONVERSATION,
        data: null
    })
}