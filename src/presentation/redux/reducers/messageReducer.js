import actionTypes from "../actions/actionTypes";


const initState = {
    listConversations: [],
}

const messageReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.GET_LIST_CONVERSATION:
            return {
                ...state,
                listConversations: action.data || []
            }
        default:
            return state
    }
}

export default messageReducer