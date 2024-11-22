import axios from "axios";

axios.defaults.baseURL = "http://157.66.24.126:8080";
axios.defaults.headers.common['Content-Type'] = 'application/json';

export default axios
