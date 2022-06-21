import axios from 'axios';

export default axios.create({
    baseURL: "http://localhost:5000/",
    withCredentials:true,
    headers: {
        "Content-type":"application/json",
    }
})