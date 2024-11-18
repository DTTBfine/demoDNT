import actionTypes from '../actions/actionTypes'

const initState = {
    userInfo: {},
    unreadNotificationCount: 0,
}

const userReducer = (state = initState, action) => {
    switch (action.type) {
        //user
        case actionTypes.GET_USER_INFO:
            return {
                ...state,
                userInfo: action.data || {}
            }
        //notification
        case actionTypes.GET_UNREAD_NOTIFICATION_COUNT:
            return {
                ...state,
                unreadNotificationCount: action.data || 0
            }
        //message

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