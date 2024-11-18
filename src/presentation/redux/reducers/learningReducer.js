import actionTypes from '../actions/actionTypes'

const initState = {
    myClasses: [],
    classMaterial: [],
    allStudentAssignment: []
}

const learningReducer = (state = initState, action) => {
    switch (action.type) {
        //class
        case actionTypes.GET_CLASS_LIST:
            return {
                ...state,
                myClasses: action.data || []
            }
        //attendance

        //absence

        //assignment
        case actionTypes.GET_STUDENT_ASSIGNMENTS:
            return {
                ...state,
                allStudentAssignment: action.data || []
            }

        //material
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