import axios from "../../../axiosConfig";
import { classEndpoints } from "../../utils/constants/endpoints";

export const getClassListRequest = async (payload) => {
    return await axios.post(classEndpoints.getClassList, {
        token: payload.token,
        role: payload.role,
        account_id: payload.account_id
    });
}