import React, {Component,useRef} from 'react'
import styles from './player.module.css';
import VideoPlayerComp from './VideoPlayerComp';
import axios from '../../utils/axios';
import requests from '../../utils/requests';
import PageLoader from '../services/page_loader';
import { connect } from 'react-redux';
import Discussion from './discussion';
import checkAdBlocker from '../../utils/adBlocker';
import { useHistory } from 'react-router-dom';

const URL = process.env.REACT_APP_WEBSOCKET_URL;

export class player extends Component {

    ws = new WebSocket(URL);
    prevTime;
    messageInterval;
    //history = useHistory();

    goToAdBlockPage = (playerId) => {
        this.props.history.push(`/ad-blocked?redirect=/player/${playerId}`);
    }
    getCurrentTime = ()=>{
        return this?.state?.player?.currentTime() || 0;
    }

    fetchData = async () => {
        this.setState({
            loading: true
        });
        if(this.props.user_id){
            window.scrollTo(0, 0);
            const playerId = this.props.match.params.id;
            try {
                const adBlock = await checkAdBlocker();
                const endPoint = `${requests.fetchVideoDetails}?player_id=${playerId}&user_id=${this.props.user_id}`;
                const axiosInstance = axios.createInstance();
                const result = await axiosInstance.get(endPoint);
                if(result.data){
                    result.data.intro_start_time = 0;
                    result.data.intro_end_time = 22;
                    result.data.closing_start_time = 828;
                    result.data.closing_end_time = 880;
                    result.data.next_show = 20;
                    this.setState({
                        player: result.data,
                        premium: result.data.premium || false,
                        loading: false
                    });
                    if(result?.data?.name){
                        document.title = result.data.name + '- Animei TV';
                    }
                    if(!result?.data?.premium){
                        if(adBlock){
                            console.log("Using Ad Blocker");
                            this.goToAdBlockPage(playerId);
                        }else{
                            console.log("Not Using Ad Blocker");
                        }
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    setPlayer = (player) => {
        this.state.player = player;
        this.setState(this.state);
    }

    getSockets = () => {
        if(this.ws){
            this.ws.onopen = () => {
                // on connecting, do nothing but log it to the console
                console.log('connected');
                const playerId = this.props.match.params.id;
                const userId = this.props.user_id;
                const body = {
                    time: 0,
                    type: "discussion",
                    id: playerId,
                    user_id: userId
                };
                this.ws.send(JSON.stringify(body));
            }
          
            this.ws.onmessage = evt => {
                // on receiving a message, add it to the list of messages
                const data = JSON.parse(evt.data)
                if(data.type === "discussion"){
                    this.state.messages = data.messages;
                    this.setState(this.state);
                }
            }
        
            this.ws.onclose = () => {
                console.log('disconnected');
                // automatically try to reconnect on connection loss
                this.setState({
                    ws: new WebSocket(URL),
                })
            }
        }   
    }

    async componentDidMount() {
        window.addEventListener('beforeunload', ()=>{
            if(this.ws){
                this.ws.close();
            }
        });
        this.getSockets();
        this.fetchData();
        this.messageInterval = setInterval(()=>{
            const prevTime = this.prevTime || 0;
            let currTime = 0;
            try{
                currTime = this?.state?.player?.currentTime();
            }catch(er){
                currTime = 0;
            }
            if(currTime > prevTime){
               const filter =  this?.state?.messages?.filter(x => x.time > prevTime && x.time <= currTime);
               this.state.discussion = filter;
               this.setState(this.state);
               this.prevTime = currTime;
            }
        },1000);
    }

    componentWillUnmount(){
        if(this.ws){
            this.ws.close();
        }
        document.title =  'Animei TV - An Anime Streaming Platform';
        window.removeEventListener('beforeunload', ()=>{
            if(this.ws){
                this.ws.close();
            }
        });
    }

    updateVideoStatus = (data) => {
        data.type = "sessions";
        if(this.ws){
            this.ws.send(JSON.stringify(data));
        }
    }

    updateDiscussion = (currTime) => {
        //console.log(currTime);
        const videoId = this.props.match.params.id;
        const userId = this.props.user_id;
        const body = {
            type: "discussion",
            time: currTime,
            user_id: userId,
            id: videoId
        };
        if(this.ws){
            this.ws.send(JSON.stringify(body));
        }
    }

    sendMessage = (message,userId) => {
        const videoId = this.props.match.params.id;
        let time = 0;
        try{
            time = this.state.player?.currentTime();
        }catch(e){
            time = 0;
        }
        const body = {
            type: "sender",
            message,
            user_id: userId,
            id: videoId,
            time
        };
        if(this.ws){
            this.ws.send(JSON.stringify(body));
        }
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
                    {this.state?.player !== undefined && <VideoPlayerComp 
                        src={this.state?.player}
                        setPlayer = {this.setPlayer}
                        className={styles.player} 
                        updateVideoStatus={this.updateVideoStatus} 
                        updateDiscussion = {this.updateDiscussion}
                        isPremium = {this.state?.premium}
                    />}
                    <Discussion 
                        discussion = {this?.state?.discussion} 
                        sendMessage={this.sendMessage} 
                        getCurrentTime={this.getCurrentTime}
                        isPremium = {this.state?.premium} 
                    />
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
