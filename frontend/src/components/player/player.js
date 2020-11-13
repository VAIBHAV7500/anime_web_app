import React, {Component} from 'react'
import Description from './description';
import styles from './player.module.css';
import VideoPlayerComp from './VideoPlayerComp';
import axios from '../../utils/axios';
import requests from '../../utils/requests';
import PageLoader from '../services/page_loader';

export class player extends Component {

    fetchData = async () => {
        window.scrollTo(0, 0);
        const playerId = this.props.match.params.id;
        this.setState({
            loading: true
        });
        
        try {
            const endPoint = `${requests.fetchVideoDetails}?player_id=${playerId}`;
            const result = await axios.get(endPoint);
            console.log(result);
            if(result.data){
                this.setState({
                    player: result.data,
                    loading: false
                });
            }
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
                <div className={styles.player_wrapper}>
                    {this.state?.loading && <PageLoader />}
                    {this.state?.player && <VideoPlayerComp src={this.state?.player} />}
                 </div>
        )
    }
}

export default player
