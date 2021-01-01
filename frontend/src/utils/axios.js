import axios from "axios";

const createInstance = () => {
    const value = `; ${document.cookie}`;
    const name = 'token';
    const parts = value.split(`; ${name}=`);
    let token;
    if (parts.length === 2) token = parts.pop().split(';').shift();

    return axios.create({
        baseURL: process.env.REACT_APP_SERVER_URL,
        headers: {
            'Content-Type': 'application/JSON',
            'Authorization': 'Bearer ' + token,
            }
    });
}

export default {createInstance};