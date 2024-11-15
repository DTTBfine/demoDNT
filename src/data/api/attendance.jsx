import axiosConfig from '../../../axiosConfig'

export const apiGetAttendanceList = async (payload) => {
    const response = await axiosConfig({
        method: 'post',
        url: '/it5023e/get_attendance_list',
        data: {
            token: payload.token,
            class_id: payload.class_id,
            date: payload.date //vd: 2024-11-13
        }
    })
    return response
}

export const apiGetAttendanceRecord = async (payload) => {
    const response = await axiosConfig({
        method: 'post',
        url: '/it5023e/get_attendance_record',
        data: {
            token: payload.token,
            class_id: payload.class_id
        }
    })
    return response
}

export const apiTakeAttendance = async (payload) => {
    const response = await axiosConfig({
        method: 'post',
        url: '/it5023e/take_attendance',
        data: {
            token: payload.token,
            class_id: payload.class_id,
            date: payload.date,
            attendance_list: payload.attendance_list //mảng các id
        }
    })
    return response
}

export const apiSetAttendanceStatus = async (payload) => {
    const response = await axiosConfig({
        method: 'post',
        url: '/it5023e/set_attendance_status',
        data: {
            token: payload.token,
            status: payload.status,
            attendance_id: payload.attendance_id
        }
    })
    return response
}