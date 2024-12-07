import axiosConfig from '../../../axiosConfig'


//get all conversations
export const apiGetListConversation = async (payload) => {
    try {
        return await axiosConfig(
            {
                method: 'post',
                url: '/it5023e/get_list_conversation',
                data: {
                    token: payload.token,
                    index: payload.index,
                    count: payload.count
                }
            }
        );
    } catch (error) {
        if (!error.response) {
            return console.error("error get list conversation: " + error)
        }
        return error.response
    }
}

export const apiGetConversation = async (payload) => {
    
}
