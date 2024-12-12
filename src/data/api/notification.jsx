import axiosConfig from '../../../axiosConfig'
import axios from "axios";

export const apiSendNotification = async (payload) => {
    const formData = new FormData();

    formData.append('token', payload.token);
    formData.append('message', payload.message);
    formData.append('toUser', Number(payload.toUser)); 
    formData.append('type', payload.type);
    console.log(formData)

    const response = await axios({
        method: 'post',
        url: '/it5023e/send_notification',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
    });

    return response;
};

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
            notification_id: payload.notification_id
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
            index: payload.index,
            count: payload.count
        }
    })
    return response
}
