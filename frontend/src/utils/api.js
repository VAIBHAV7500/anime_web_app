const axios = require('axios');
require('dotenv').config();

//Change this thing later
const getVideoLink = () => {
    const body = {
        message: 'Something'
    }
    return new Promise((res,rej)=>{
        const endPoint = `http://localhost:4200/video`;
        axios.post(endPoint, body).then((response)=>{
            res(response);
        });
    });
}

async function getEpisodeList(show_id = undefined) {
    return await axios.get('https://run.mocky.io/v3/fd2d49f3-7213-4162-813f-3b415902c10a');
}

module.exports = {
    getVideoLink,
    getEpisodeList
}