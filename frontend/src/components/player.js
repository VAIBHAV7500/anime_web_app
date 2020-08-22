import React, { Component } from 'react'
import ReactPlayer from 'react-player'
import comments from './comments';
import {
    getVideoLink
} from '../utils/api'
import './player.css';
export class player extends Component {
    constructor(props){
        super(props);
        this.videoUrl = '';
        this.isLoaded = false;
    }
    async componentDidMount(){
        try{
            let response = {};
            response = await getVideoLink();
            if(response.status===200){
                this.videoUrl = response.data.videoUrl;
                this.videoUrl.setState = response.data.videoUrl;
                console.log(this.videoUrl)
            }
            else
            {
                throw new Error(response.data);
            }
            this.isLoaded = true;
        }
        catch(error){
            console.log(error.message);
        }
    }
    render() {
        return (
            <div className="player">
                < ReactPlayer 
                    url = 'http://localhost:4200/videos/anniversary2.mp4'
                    height = '100%'
                    width = '100%'
                    controls = 'true'
                />
                <comments/>
            </div>
        )
    }
}

export default player
