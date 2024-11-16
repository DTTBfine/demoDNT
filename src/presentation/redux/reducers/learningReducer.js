import actionTypes from '../actions/actionTypes'

const initState = {
    myClasses: [],
}

const learningReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.GET_CLASS_LIST:
            return {
                ...state,
                myClasses: action.data || []
            }
        // case actionTypes.REGISTER_CLASS_SUCCCESS:
        //     return {
        //         ...state,
        //         registerClassSuccess: true
        //     }
        // case actionTypes.REGISTER_CLASS_FAILED:
        //     return {
        //         ...state,
        //         registerClassSuccess: false
        //     }
        // case actionTypes.GET_BASIC_CLASS_INFO_SUCCESS:
        //     return {
        //         ...state,
        //         classInfo: action.data
        //     }
        // case actionTypes.GET_BASIC_CLASS_INFO_FAILED:
        //     return {
        //         ...state,
        //         classInfoErr: action.data
        //     }
        case actionTypes.LOGOUT:
            return {
                ...state,
                myClasses: []
            }
        default:
            return state;
    }
}

export default learningReducer