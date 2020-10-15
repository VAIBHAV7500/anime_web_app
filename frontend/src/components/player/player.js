import React, {Component} from 'react'
import ReactPlayer from 'react-player'
import Description from './description'
import {getVideoLink} from '../../utils/api'
import './player.css';
import play from './play.svg';
import RouterButton from './homeButton';

const watchProgress = (event) => {
    console.log(event);
}

export class player extends Component {

    fetchData = async () => {
        window.scrollTo(0, 0);
        const showId = this.props.match.params.id
        try {
            document.body.style = 'background: rgb(43, 42, 42);';
            this.disableRightClick();
            let response = {};
            // //response = await getVideoLink();
            // console.log('IN player')
            // console.log(response);
            // if (response.status === 200) {
            //     const data = response.data;
            //     this.setState(data);
            // } else {
            //     console.log(response);
            //     throw new Error(response.data);
            // }

            this.setState(prevState => ({
                ...prevState,
                videoUrl: `https://animeitv-vod-hls.cdnvideo.ru/animeitv-vod/_definst_/mp4:5f840e56ef3db5506ecfaada/playlist.m3u8`
            }));
        } catch (error) {
            console.log(error.message);
        }
    }
    async componentDidMount() {
        this.fetchData();
    }

    async componentDidUpdate(prevProps) {
        if (this.props.match.params.id !== prevProps.match.params.id) {
            this.fetchData();
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
