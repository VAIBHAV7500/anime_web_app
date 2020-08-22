import React, {Component} from 'react'
import ReactPlayer from 'react-player/lazy'
import Comments from './comments';
import {getVideoLink} from '../utils/api'
import './player.css';
import play from './play.svg';

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
        console.log(event.key);
        if(['f','F'].includes(event.key)){
        }
    }

    disableRightClick = () => {
        document.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });
    }

    render() {
        return (
                <div className="player-wrapper" onKeyPress = {this.handleKeyPress}>
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
                    <Comments/>
                 </div>
        )
    }
}

export default player
