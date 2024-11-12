import axios from "axios";
import { authEndpoints } from "../../constants/endpoints";

export const getUserInfoRequest = async (payload) => {
    const response = await axios.post(authEndpoints.getUserInfo, {
        token: payload.token,
        user_id: payload.userId
    });
    return response;
};