import axiosConfig from '../../../axiosConfig'

export const apiGetUserInfo = () => async (payload) => {
    console.log(payload)
    const response = await axiosConfig(
        {
            method: 'post',
            url: '/it4788/get_user_info',
            data: {
                token: payload.token,
                userId: payload.userId
            }
        });
    return response;
}