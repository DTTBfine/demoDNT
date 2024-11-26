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
    var formDataBody = new FormData()
    for (const key in payload) {
        if (payload[key]) {
            formDataBody.append(key, payload[key])
        } 
    }

    console.log("body: " + JSON.stringify(formDataBody))
    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/it5023e/create_survey',
            data: formDataBody,
            headers: { "Content-Type": "multipart/form-data" },
        })
    
        console.log("response: " + JSON.stringify(response.data))
        return response
    } catch (error) {
        if (!error.response) {
            return console.error("failed to create survey: " + error)
        }
        return error.response
    }
    
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
    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/it5023e/delete_survey',
            data: {
                token: payload.token,
                survey_id: payload.survey_id
            }
        })
        return response
    } catch (error) {
        if (!error.response) {
            return console.error("delete survey failed: " + error)
        }
        return error.response
    }
    
}

export const apiSubmitSurvey = async (payload) => {
    let formDataBody = new FormData()
    for (const key in payload) {
        if (payload[key]) {
            formDataBody.append(key, payload[key])
        }
    }
    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/it5023e/submit_survey',
            data: formDataBody,
            headers: { "Content-Type": "multipart/form-data" },
        })
        return response
    } catch (error) {
        if (!error.response) {
            return console.error("failed to submit survey: " + error)
        }
        return error.response
    }
    
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
    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/it5023e/get_student_assignments',
            data: {
                token: payload.token,
                type: payload.type ? payload.type : null,
                class_id: payload.class_id ? payload.class_id : null
            }
        })
        return response
    } catch (error) {
        if (!error.response) {
            return console.error("get student assignments failed: " + error)
        }
        return error.response
    }
    
}

export const apiGetStudentAssignmentsByClassId = async (payload) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/it5023e/get_student_assignments',
            data: {
                token: payload.token,
                classId: payload.classId
            }
        })
        return response
    } catch (error) {
        if (!error.response) {
            return console.error("failed to get student assignments by class id: " + error)
        }
        return error.response
    }
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