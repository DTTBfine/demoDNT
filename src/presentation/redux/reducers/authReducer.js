import actionTypes from '../actions/actionTypes'

const initState = {
    isLoggedIn: false,
    token: null,
    userId: '',
    role: '',
    msg: '',
    update: false
}

const authReducer = (state = initState, action) => {
    switch (action.type) {
        //case actionTypes.REGISTER_SUCCESS:
        case actionTypes.LOGIN_WITH_STUDENT_SUCCESS:
        case actionTypes.LOGIN_WITH_TEACHER_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                token: action.data.token,
                userId: action.data.id,
                role: action.data.role,
                msg: ''
            }

        case actionTypes.LOGIN_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                msg: action.data,
                token: null,
                userId: '',
                role: '',
                update: !state.update
            }

        default:
            return state;
    }
}

export default authReducer