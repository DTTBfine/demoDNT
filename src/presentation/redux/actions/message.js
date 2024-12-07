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