import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import Banner from './banner';
import Nav from '../services/Nav';
import Episodes from './episodes';
import requests from '../../utils/requests';
import axios from '../../utils/axios';

export class show extends Component {

    async componentDidMount(){
        console.log('Params');
        console.log(this.props.match.params);
        try{
            const showId = this.props.match.params.id
            
            const request = await axios.get(`${requests.fetchEpisodes}?show_id=${1}`);
            console.log('Request');
            console.log(request);
        }catch(err){

        }
    }
    
    render() {
        return (
            <div>
                <Nav/>
                <Banner/>
                < Episodes/>
            </div>
        )
    }
}

export default show


const data = {
    "episodes": [
        1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19
    ]
}
