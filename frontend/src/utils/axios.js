import axios from "axios";

const value = `; ${document.cookie}`;
const name = 'token';
const parts = value.split(`; ${name}=`);
let token;
if (parts.length === 2) token = parts.pop().split(';').shift();
console.log(token);

const instance = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
    headers: {
        'Content-Type': 'application/JSON',
        'Authorization': 'Bearer ' + token,
        }
});
console.log(document.cookie);

export default instance;