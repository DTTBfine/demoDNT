import actionTypes from '../actions/actionTypes'

const initState = {
    userInfo: {}
}

const userReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.GET_USER_INFO:
            return {
                ...state,
                userInfo: action.data || {}
            }
        case actionTypes.LOGOUT:
            return {
                ...state,
                userInfo: {}
            }

        default:
            return state;
    }
}

export default userReducer