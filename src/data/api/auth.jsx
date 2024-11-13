import axiosConfig from '../../../axiosConfig'
import uuid from 'react-native-uuid'

export const apiLogin = async (payload) => {
    const response = await axiosConfig(
        {
            method: 'post',
            url: '/it4788/login',
            data: {
                email: payload.email,
                password: payload.password,
                deviceId: uuid.v4()
            }
        });
    return response;
}