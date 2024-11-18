import axiosConfig from '../../../axiosConfig'

export const apiGetAllSurveys = async (payload) => {
    const response = await axiosConfig({
        method: 'post',
        url: '/it5023e/get_all_surveys',
        data: {
            token: payload.token,
            class_id: payload.class_id
        }
    })
    return response
}

export const apiCreateSurvey = async (payload) => {
    const response = await axiosConfig({
        method: 'post',
        url: '',
        data: {
            file: payload.file,
            token: payload.token,
            class_id: payload.class_id,
            title: payload.title,
            deadline: payload.deadline, //định dạng: 2024-12-11T14:30:00
            description: payload.description
        }
    })
    return response
}

export const apiEditSurvey = async (payload) => {
    const response = await axiosConfig({
        method: 'post',
        url: '',
        data: {
            file: '', //lấy file từ params của url hả khum biết
            token: payload.token,
            assignmentId: payload.assignmentId,
            deadline: payload.deadline,
            description: payload.description
        }
    })
    return response
}

export const apiDeleteSurvey = async (payload) => {
    const response = await axiosConfig({
        method: 'post',
        url: '/it5023e/delete_survey',
        data: {
            token: payload.token,
            survey_id: payload.survey_id
        }
    })
    return response
}

export const apiSubmitSurvey = async (payload) => {
    const response = await axiosConfig({
        method: 'post',
        url: '',
        data: {
            file: '',
            token: payload.token,
            assignmentId: payload.assignmentId,
            textResponse: payload.textResponse
        }
    })
    return response
}

export const apiGetSurveyResponse = async (payload) => {
    const response = await axiosConfig({
        method: 'post',
        url: '/it5023e/get_survey_response',
        data: {
            token: payload.token,
            survey_id: payload.survey_id,
            grade: payload.grade //object gồm 2 tham số là score và submission_id
        }
    })
    return response
}

export const apiGetStudentAssignments = async (payload) => {
    const response = await axiosConfig({
        method: 'post',
        url: '/it5023e/get_student_assignments',
        data: {
            token: payload.token
        }
    })
    return response
}

export const apiGetSubmission = async (payload) => {
    const response = await axiosConfig({
        method: 'post',
        url: '/it5023e/get_submission',
        data: {
            token: payload.token,
            assignment_id: payload.assignment_id
        }
    })
    return response
}