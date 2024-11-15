import axiosConfig from '../../../axiosConfig'

export const apiSendNotification = async (payload) => {
    const response = await axiosConfig({
        method: 'post',
        url: '/it5023e/send_notification',
        data: {
            token: payload.token,
            message: payload.message,
            to_user: payload.to_user,
            type: payload.type ////ABSENCE, ACCEPT_ABSENCE_REQUEST, REJECT_ABSENCE_REQUEST, ASSIGNMENT_GRADE
        }
    })
    return response
}

export const apiGetUnreadNotificationCount = async (payload) => {
    const response = await axiosConfig({
        method: 'post',
        url: '/it5023e/get_unread_notification_count',
        data: {
            token: payload.token
        }
    })
    return response
}

export const apiMarkNotificationAsRead = async (payload) => {
    const response = await axiosConfig({
        method: 'post',
        url: '/it5023e/mark_notification_as_read',
        data: {
            token: payload.token,
            notification_ids: payload.notification_ids //mảng các id
        }
    })
    return response
}

export const apiGetNotifications = async (payload) => {
    const response = await axiosConfig({
        method: 'post',
        url: '/it5023e/get_notifications',
        data: {
            token: payload.token,
            index: '', //cái này dfng để làm gì?
            count: '' //cái này nữa, là sao?
        }
    })
    return response
}
