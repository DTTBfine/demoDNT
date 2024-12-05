const actionTypes = {
    REGISTER_SUCCESS: 'REGISTER_SUCCESS',
    REGISTER_FAIL: 'REGISTER_FAIL',

    LOGIN_WITH_STUDENT_SUCCESS: 'LOGIN_WITH_STUDENT_SUCCESS',
    LOGIN_WITH_TEACHER_SUCCESS: 'LOGIN_WITH_TEACHER_SUCCESS',

    LOGIN_FAIL: 'LOGIN_FAIL',

    LOGOUT: 'LOGOUT',
    //USER
    GET_USER_INFO: 'GET_USER_INFO',

    //CLASS
    GET_CLASS_LIST: 'GET_CLASS_LIST',
    GET_CLASS_INFO: 'GET_CLASS_INFO',
    REGISTER_CLASS_SUCCCESS: "REGISTER_CLASS_SUCCESS",
    REGISTER_CLASS_FAILED: "REGISTER_CLASS_FAILED",
    GET_BASIC_CLASS_INFO_SUCCESS: 'GET_BASIC_CLASS_INFO_SUCCESS',
    GET_BASIC_CLASS_INFO: "GET_BASIC_CLASS_INFO",

    //ABSENCE

    //FCM_TOKEN
    SAVE_FCM_TOKEN: 'SAVE_FCM_TOKEN',

    //ATTENDANCE
    GET_ATTENDANCE_RECORD: 'GET_ATTENANCE_RECORD',

    //ASSIGNMENT
    GET_STUDENT_ASSIGNMENTS: 'GET_STUDENT_ASSIGNMENTS',
    GET_UPCOMING_ASSIGNMENTS: 'GET_UPCOMING_ASSIGNMENTS',
    GET_COMPLETED_ASSIGNMENTS: 'GET_COMPLETED_ASSIGNMENTS',
    GET_PAST_DUE_ASSIGNMENTS: 'GET_PAST_DUE_ASSIGNMENTS',
    GET_STUDENT_ASSIGNMENTS_BY_CLASS_ID: 'GET_STUDENT_ASSIGNMENTS_BY_CLASS_ID',
    GET_SUBMISSION: 'GET_SUBMISSION',

    GET_SURVEYS_OF_CLASS: 'GET_SURVEYS_OF_CLASS',

    //NOTIFICATION
    GET_UNREAD_NOTIFICATION_COUNT: 'GET_UNREAD_NOTIFICATION_COUNT',

    //MATERIAL
    GET_MATERIAL_LIST: 'GET_MATERIAL_LIST',
    GET_MATERIAL_INFO: 'GET_MATERIAL_INFO'

    //MESSAGE

}

export default actionTypes