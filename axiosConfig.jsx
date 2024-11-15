import axios from "axios";

axios.defaults.baseURL = 'http://160.30.168.228:8080';
axios.defaults.headers.common['Content-Type'] = 'application/json';

export default axios