const axios = require('axios');
require('dotenv').config();

//Change this thing later
const getVideoLink = () => {
    const body = {
        message: 'Something'
    };
    console.log('In apI CALL');
    return new Promise((res,rej)=>{
        const endPoint = `http://localhost:4200/video`;
        console.log(endPoint);
        axios.post(endPoint, body).then((response)=>{
            res(response);
        });
    });
}

module.exports = {
    getVideoLink
}