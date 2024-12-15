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
    try {
        return await axiosConfig(
            {
                method: 'post',
                url: '/it5023e/get_conversation',
                data: {
                    token: payload.token,
                    index: payload.index,
                    count: payload.count,
                    partner_id: payload.partner_id,
                    conversation_id: payload.conversation_id,
                    mark_as_read: payload.mark_as_read
                }
            }
        )
    } catch (error) {
        if (!error.response) {
            return console.error("error get conversation: " + error)
        }
        return error.response
    }
}
