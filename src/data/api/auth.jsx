import axiosConfig from '../../../axiosConfig'
import uuid from 'react-native-uuid'

export const apiLogin = async (payload) => {
    console.log('vào apiLogin')
    const deviceId = uuid.v4()
    console.log('deviceId: ' + deviceId)
    try {
        const response = await axiosConfig(
            {
                method: 'post',
                url: '/it4788/login',
                data: {
                    email: payload.email,
                    password: payload.password,
                    deviceId: deviceId
                }
            });
        console.log('gọi api xong và có response: ' + response)
        return response;
    } catch (error) {
        if (error.response) {
            // Nếu có response từ server
            if (error.response.status === 401) {
                console.log("Data from 401 error:", error.response.data);

            } else {
                console.error("Error with response:", error.response);

            }
            return error.response
        } 
        // Nếu không có response từ server (network error)
        console.error("Network error or request was not completed:", error.message);    
    }
}

export const apiSignUp = async (payload) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/it4788/signup',
            data: {
                ho: payload.ho,
                ten: payload.ten,
                email: payload.email,
                password: payload.password,
                uuid: uuid.v4(),
                role: payload.role
            }
        })
        return response
    } catch (error) {
        if (!error.response) {
            return console.error("signup failed: " + error)
        }
        return error.response;
    }
    
}

export const apiCheckVerifyCode = async (payload) => {
    const response = await axiosConfig({
        method: 'post',
        url: '/it4788/check_verify_code',
        data: {
            email: payload.email,
            verify_code: payload.verify_code
        }
    })
    return response
}

export const apiGetVerifyCode = async (payload) => {
    const response = await axiosConfig({
        method: 'post',
        url: '/it4788/get_verify_code',
        data: {
            email: payload.email,
            password: payload.password,
        }
    })
    return response
}


export const apiChangeInfoAfterSignUp = async (payload) => {
    let formDataBody = new FormData()
    formDataBody.append('token', payload.token)
    formDataBody.append('name', payload.name)
    formDataBody.append('file', payload.file)

    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/it4788/change_info_after_signup',
            data: formDataBody,
            headers: { "Content-Type": "multipart/form-data" },
        })
        return response
    } catch (error) {
        if (!error.response) {
            return console.error("change info after signup failed: " + error)
        }
        return error.response
    }

    
}

export const apiChangePassword = async (payload) => {

    const response = await axiosConfig({
        method: 'post',
        url: '/it4788/change_password',
        data: {
            token: payload.token,
            old_password: payload.old_password,
            new_password: payload.new_password,
        }
    })
    return response
}