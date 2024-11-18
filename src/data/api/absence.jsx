import axiosConfig from '../../../axiosConfig'

export const apiRequestAbsence = async (payload) => {
    var formDataBody = new FormData()
    formDataBody.append('token', payload.token)
    formDataBody.append('classId', payload.class_id)
    formDataBody.append('date', payload.date)
    formDataBody.append('reason', payload.reason)
    formDataBody.append('file', payload.file)



    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/it5023e/request_absence',
            data: formDataBody,
            headers: { "Content-Type": "multipart/form-data" },
        })

        return response
    } catch (error) {
        if (!error.response) {
            console.log("send absence request failed: " + error)
        }
        return error.reponse
    }
}

export const apiReviewAbsenceRequest = async (payload) => {
    const response = await axiosConfig({
        method: 'post',
        url: '/it5023e/review_absence_request',
        data: {
            token: payload.token,
            request_id: payload.request_id,
            status: payload.status // ACCEPTED, PENDING, REJECTED
        }
    })
    return response
}

export const apiGetAbsenceRequests = async (payload) => {
    const response = await axiosConfig({
        method: 'post',
        url: '/it5023e/get_absence_requests',
        data: {
            token: payload.token,
            class_id: payload.class_id,
            status: payload.status
        }
    })
    return response
}