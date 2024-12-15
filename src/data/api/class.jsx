import axiosConfig from '../../../axiosConfig'

export const apiGetClassList = async (payload) => {
    const response = await axiosConfig({
        method: 'post',
        url: '/it5023e/get_class_list',
        data: {
            token: payload.token,
            role: payload.role,
            account_id: payload.account_id
        }
    })
    return response
}

export const apiGetClassInfo = async (payload) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/it5023e/get_class_info',
            data: {
                token: payload.token,
                // role: payload.role,
                // account_id: payload.account_id,
                class_id: payload.class_id
            }
        })
        return response
    } catch (error) {
        if (!error.response) {
            return console.error("failed to get class info: " + error)
        }
        return error.response
    }
   
}

export const apiCreateClass = async (payload) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/it5023e/create_class',
            data: {
                token: payload.token,
                class_id: payload.class_id,
                class_name: payload.class_name,
                class_type: payload.class_type,
                start_date: payload.start_date,
                end_date: payload.end_date,
                max_student_amount: payload.max_student_amount
            }
        })
        return response
    } catch (error) {
        if (!error.response) {
            return console.error("failed to create class: " + error)
        }
        return error.response
    }
    
}

export const apiEditClass = async (payload) => {
    const response = await axiosConfig({
        method: 'post',
        url: '/it5023e/edit_class',
        data: {
            token: payload.token,
            class_id: payload.class_id,
            class_name: payload.class_name,
            status: payload.status, //ACTIVE, COMPLETED, UPCOMING
            start_date: payload.start_date,
            end_date: payload.end_date
        }
    })
    return response
}

export const apiDeleteClass = async (payload) => {
    const response = await axiosConfig({
        method: 'post',
        url: '/it5023e/delete_class',
        data: {
            token: payload.token,
            role: payload.role,
            account_id: payload.account_id,
            class_id: payload.class_id
        }
    })
    return response
}

export const apiAddStudent = async (payload) => {
    const response = await axiosConfig({
        method: 'post',
        url: '/it5023e/add_student',
        data: {
            token: payload.token,
            class_id: payload.class_id,
            account_id: payload.account_id
        }
    })
    return response
}

export const apiRegisterClass = async (payload) => {
    try{
        const response = await axiosConfig({
            method: 'post',
            url: '/it5023e/register_class',
            data: {
                token: payload.token,
                class_ids: payload.class_ids //mảng các class_id vd: [699216, 000002, 000010]
            }
        })
        return response
    } catch (error) {
        if (!error.response) {
            return console.error("register class failed: " + error)
        }
        console.log("error register class: " + JSON.stringify(error.response.data))
        return error.response
    }
    
}

export const apiGetBasicClassInfo = async (payload) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/it5023e/get_basic_class_info',
            data: {
                token: payload.token,
                role: payload.role,
                account_id: payload.account_id,
                class_id: payload.class_id
            }
        })
        return response
    } catch (error) {
        if (!error.response) {
            return console.error("get basic class info failed")
        }
        return error.response
    }
    
}

export const apiGetOpenClasses = async (payload) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/it5023e/get_open_classes',
            data: {
                token: payload.token,
                pageable_request: payload.pageable_request
            }
        })
        return response
    } catch (error) {
        if (!error.response) {
            return console.error("get open classes failed: " + error)
        }
        return error.response
    }
}

export const apiGetClassesByFilter = async (payload) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/it5023e/get_classes_by_filter',
            data: {
                token: payload.token,
                class_id: payload.class_id,
                status: payload.status,
                class_name: payload.class_name,
                class_type: payload.class_type,
                pageable_request: payload.pageable_request
            }
        })
        return response
    } catch (error) {
        if (!error.response) {
            return console.error("get classes by filter failed: " + error)
        }
        return error.response
    }
}