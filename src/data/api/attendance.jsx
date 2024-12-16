import axiosConfig from '../../../axiosConfig'

export const apiGetAttendanceList = async (payload) => {
    // console.log("get attendance list payload: " + JSON.stringify(payload))
    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/it5023e/get_attendance_list',
            data: {
                token: payload.token,
                class_id: payload.class_id,
                date: payload.date, //vd: 2024-11-13
                pageable_request: payload.pageable_request
            }
        })
        return response
    } catch (error) {
        if (!error.response) {
            return console.error("get attendance list: " + error)
        }
        return error.response
    }
    
}


export const apiGetAttendanceRecord = async (payload) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/it5023e/get_attendance_record',
            data: {
                token: payload.token,
                class_id: payload.class_id
            }
        })
        return response
    } catch (error) {
        if (!error.response) {
            return console.error('failed to get attendance record: ' + error)
        }
        return error.response
    }

}

export const apiTakeAttendance = async (payload) => {
    try {
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
    } catch (error) {
        if (!error.response) {
            return console.error("take attendance: " + error)
        }
        return error.response
    }
    
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

export const apiGetAttendanceDates  = async (payload) => {
    try {
        return axiosConfig({
            method: 'post',
            url: '/it5023e/get_attendance_dates',
            data: {
                token: payload.token,
                class_id: payload.class_id
            }
        })
    } catch (error) {
        if (!error.response) {
            return console.error()
        }
        return error.response
    }
}