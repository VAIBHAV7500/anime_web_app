import React, {Component} from 'react'
import ReactPlayer from 'react-player/lazy'
import Comments from './comments';
import {getVideoLink} from '../utils/api'
import './player.css';
import play from './play.svg';
import {RiCloseCircleFill} from "react-icons/ri";
import {TiArrowBack} from "react-icons/ti";

const watchProgress = (event) => {
    console.log(event);
}


export class player extends Component {
    async componentDidMount(){
        try{
            this.disableRightClick();
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

    handleKeyPress = (event) => {
        console.log(event);
    }

    disableRightClick = () => {
        document.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });
    }

    render() {
        return (
                <div className="player-wrapper" onMouseMove = {this.handleKeyPress}>
                    <div className='player-header'>
                        < TiArrowBack className = 'back-btn' / >
                        < RiCloseCircleFill className= 'close-btn'/>
                    </div>
                    < ReactPlayer 
                        className = 'react-player' 
                        url = {this.state=== null ? '' : this.state.videoUrl}
                        height = '100%'
                        width = '100%'
                        controls = {true}
                        playIcon = {play}
                        onProgress = {watchProgress}
                        wrapper = 'div'
                        playing = {true}
                        config= {{ file: { 
                                    attributes: {
                                    controlsList: 'nodownload'
                                    }
                                 }}}
                    />
                 </div>
        )
    }
}

export default player
