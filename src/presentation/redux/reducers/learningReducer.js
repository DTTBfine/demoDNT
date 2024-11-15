import actionTypes from '../actions/actionTypes'

const initState = {
    myClasses: [],
    classMaterial: []
}

const learningReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.GET_CLASS_LIST:
            return {
                ...state,
                myClasses: action.data || []
            }
        case actionTypes.GET_MATERIAL_LIST:
            return {
                ...state,
                classMaterial: action.data || []
            }
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