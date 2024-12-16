import axiosConfig from '../../../axiosConfig'

export const apiGetUserInfo = async (payload) => {
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
    console.log("get user info response: " + JSON.stringify(response.data))
    return response;
}

export const apiSearchAccount = async (payload) => {
    try {
        return await axiosConfig({
            method: 'post',
            url: '/it5023e/search_account',
            data: {
                search: payload.search,
                pageable_request: payload.pageable_request
            }
        })
    } catch (error) {
        if (!error.response) {
            return console.error("failed to search account: " + error)
        }
        return error.response
    }
}