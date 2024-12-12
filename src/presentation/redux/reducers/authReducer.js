import actionTypes from '../actions/actionTypes'

const initState = {
    isLoggedIn: false,
    token: null,
    userId: '',
    role: '',
    msg: '',
    password:'',
    update: false
}

const authReducer = (state = initState, action) => {
    switch (action.type) {
        //case actionTypes.REGISTER_SUCCESS:
        case actionTypes.LOGIN_WITH_STUDENT_SUCCESS:
        case actionTypes.LOGIN_WITH_TEACHER_SUCCESS:
            console.log('Đã đăng nhập vào rùi')
            return {
                ...state,
                isLoggedIn: true,
                token: action.data.token,
                userId: action.data.id,
                role: action.data.role,
                password:action.data.password,
                msg: ''
            }

        case actionTypes.LOGIN_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                msg: action.message,
                token: null,
                userId: '',
                role: '',
                password:'',
                update: !state.update
            }

        case actionTypes.LOGOUT:
            console.log('Logging out, resetting state...');
            return {
                ...state,
                isLoggedIn: false,
                token: null,
                userId: '',
                role: '',
                msg: '',
                password:''
            }

        default:
            return state;
    }
}

export default authReducer