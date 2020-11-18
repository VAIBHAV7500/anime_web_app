import React, {Component} from 'react'
import Description from './description';
import styles from './player.module.css';
import VideoPlayerComp from './VideoPlayerComp';
import axios from '../../utils/axios';
import requests from '../../utils/requests';
import PageLoader from '../services/page_loader';
import { connect } from 'react-redux';

export class player extends Component {

    fetchData = async () => {
        this.setState({
            loading: true
        });
        if(this.props.user_id){
            console.log('Inside fetch Data');
            window.scrollTo(0, 0);
            const playerId = this.props.match.params.id;
            
            try {
                const endPoint = `${requests.fetchVideoDetails}?player_id=${playerId}&user_id=${this.props.user_id}`;
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
    }
    async componentDidMount() {
        this.fetchData();

    }

    async componentDidUpdate(prevProps) {
        console.log(this.props.user_id);
        console.log(prevProps.user_id);
        if (this.props.match.params.id !== prevProps.match.params.id) {
            this.fetchData();
        }
        if(this.props.user_id !== prevProps.user_id){
            console.log('Inside condition')
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
                    {this.state?.player !== undefined && <VideoPlayerComp src={this.state?.player} />}
                    <Description></Description>
                 </div>
        )
    }
}

const mapStatetoProps = (state) => {
    return {
      user_id : state.user_id,
    }
  }

export default connect(mapStatetoProps)(player)
