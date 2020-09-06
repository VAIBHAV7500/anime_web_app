import React, {Component} from 'react'
import ReactPlayer from 'react-player'
import Description from './description'
import {getVideoLink} from '../../utils/api'
import './player.css';
import play from './play.svg';
import {ImHome} from "react-icons/im";
import RouterButton from './homeButton';

const watchProgress = (event) => {
    console.log(event);
}

export class player extends Component {
    async componentDidMount(){
        try{
            document.body.style = 'background: rgb(43, 42, 42);';
            this.disableRightClick();
            let response = {};
            response = await getVideoLink();
            if(response.status===200){
                const data = response.data;
                console.log(data);
                this.setState(data);
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
                <div className="player-wrapper">
                    <div className='player-header'>
                         < RouterButton path="/" />
                         {this.state=== null ? 'Loading...' : this.state.title}
                        <div className='close-button btn'>
                            <svg width="10" height="10" viewBox = "0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L10 10M19 19L10 10M10 10L19 1M10 10L1 19" stroke ='#FFAEC8' strokeWidth='2' />
                            </svg>
                        </div>
                    </div>
                    < ReactPlayer 
                        className = 'react-player' 
                        url = {this.state=== null ? '' : this.state.videoUrl}
                        height = '100%'
                        width = '100%'
                        controls = {true}
                        playIcon = {play}
                        onProgress = {watchProgress}
                        playing = {false}
                        pip = {true}
                        config= {{ file: { 
                                    attributes: {
                                    controlsList: 'nodownload'
                                    }
                                 }}}
                    />
                    < Description className = 'description' />
                 </div>
        )
    }
}

export default player
