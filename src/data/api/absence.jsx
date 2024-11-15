import axiosConfig from '../../../axiosConfig'

export const apiRequestAbsence = async (payload) => {
    const response = await axiosConfig({
        method: 'post',
        url: '/it5023e/request_absence',
        data: {
            token: payload.token,
            class_id: payload.class_id,
            date: payload.date, //vd: 2024-11-13,
            reason: payload.reason,
            file: payload.file //định dạng file
        }
    })
    return response
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