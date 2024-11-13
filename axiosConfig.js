// axiosConfig.js
import axios from "axios";

const instance = axios.create({
    baseURL: 'http://160.30.168.228:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});


export default instance;
