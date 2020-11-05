import React, {Component} from 'react'
import ReactPlayer from 'react-player';
import Description from './description';
import {getVideoLink} from '../../utils/api';
import './player.css';
import VideoPlayerComp from './VideoPlayerComp';

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
                videoUrl: `https://multiplatform-f.akamaihd.net/i/multi/will/bunny/big_buck_bunny_,640x360_400,640x360_700,640x360_1000,950x540_1500,.f4v.csmil/master.m3u8`
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
                    <VideoPlayerComp src={this.state?.videoUrl} />
                 </div>
        )
    }
}

export default player
