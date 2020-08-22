import React, { Component } from 'react'
import ReactPlayer from 'react-player'
import Comments from './comments';
import {
    getVideoLink
} from '../utils/api'
import './player.css';
import play from './play.svg'
export class player extends Component {

    async componentDidMount(){
        try{
            let response = {};
            response = await getVideoLink();
            if(response.status===200){
                const videoUrl = response.data.videoUrl;
                this.setState({videoUrl});
            }
            else
            {
                throw new Error(response.data);
            }
        }
        catch(error){
            console.log(error.message);
        }
    }
    render() {
        return (
            <div className="player">
                < ReactPlayer 
                    url = {this.state=== null ? '' : this.state.videoUrl}
                    height = '100%'
                    width = '100%'
                    controls = {true}
                    playIcon = {play}
                />
                <Comments/>
            </div>
        )
    }
}

export default player
