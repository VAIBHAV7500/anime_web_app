import React, { Component } from 'react';
import Banner from './banner';
import Nav from '../services/Nav';
import requests from '../../utils/requests';
import axios from '../../utils/axios';

export class show extends Component {
    async componentDidMount(){
        console.log('Params');
        this.setState({});
        console.log(this.props.match.params);
        console.log('Starting');
        const showId = this.props.match.params.id
        console.log(showId);
        const showDetails = await axios.get(`${requests.fetchShowDetails}?id=${showId}`);
        console.log(showDetails);
        const request = await axios.get(`${requests.fetchEpisodes}?show_id=${1}`);
        console.log('Request');
        console.log(request);
        this.state.episodes = request.data;
        this.setState(this.state);
    }
    
    render() {
        return (
            <div>
                <Nav/>
                <Banner movie={this.state?.episodes}/>
                {
                    this.state && this.state.episodes && this.state.episodes.map((episode)=>{
                        return <div key={episode.id}>
                            {episode.id}
                        </div>
                    })
                }
            </div>
        )
    }
}

export default show
