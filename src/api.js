import axios from "axios"
import { ACCESS_TOKEN } from "./varibales"

const api = axios.create({
    baseURL : 'http://localhost:8000',
});


api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (errors) => {
        return Promise.reject(errors)
    }
)


export default api;