import React, {Component} from 'react'
import ReactPlayer from 'react-player/lazy'
import Comments from './comments';
import {getVideoLink} from '../utils/api'
import './player.css';
import play from './play.svg';
import {RiCloseCircleFill} from "react-icons/ri";
import {TiArrowBack} from "react-icons/ti";
import {
    Redirect,
    useHistory
} from "react-router-dom";

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

    sendBack = () => {
        let path = this.props.backUrl ? this.props.backUrl : "/";
    }

    render() {
        return (
                <div className="player-wrapper">
                    <div className='player-header'>
                         < TiArrowBack className = 'back-btn btn' onClick={this.sendBack} />
                         Korukuno Basket S02E06
                        < RiCloseCircleFill className= 'close-btn btn'/>
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
                        playing = {false}
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
