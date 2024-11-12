import axios from "axios";
import { authEndpoints } from "../../constants/endpoints";
import uuid from 'react-native-uuid'

export const loginRequest = async (payload) => {
    const response = await axios.post(authEndpoints.login, {
        email: payload.email,
        password: payload.password,
        deviceId: uuid.v4()
    });
    return response;
}