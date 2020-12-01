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
            window.scrollTo(0, 0);
            const playerId = this.props.match.params.id;
            
            try {
                const endPoint = `${requests.fetchVideoDetails}?player_id=${playerId}&user_id=${this.props.user_id}`;
                const result = await axios.get(endPoint);
                if(result.data){
                    result.data.intro_start_time = 0;
                    result.data.intro_end_time = 22;
                    result.data.closing_start_time = 828;
                    result.data.closing_end_time = 880;
                    result.data.next_show = 20;
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
        if (this.props.match.params.id !== prevProps.match.params.id) {
            this.fetchData();
        }
        if(this.props.user_id !== prevProps.user_id){
            this.fetchData();
        }
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
                    {this.state?.player !== undefined && <VideoPlayerComp src={this.state?.player} className={styles.player} />}
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
