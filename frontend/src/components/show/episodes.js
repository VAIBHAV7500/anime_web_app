import React, { useState, useEffect, useRef } from 'react';
import { FaArrowRight } from "react-icons/fa";
import axios from '../../utils/axios';
import requests from '../../utils/requests';
import styles from './episodes.module.css';
import {useHistory} from "react-router-dom";
import { useLocation, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';
import PulseLoader from "react-spinners/PulseLoader";

let episodeArray = [];

function Episodes() {
    const {id} = useParams();
    const userId = useSelector(state => state.user_id);
    let prevUserId = null;
    const [episodes, setEpisodes] = useState([]);
    const [cookies,setCookie] = useCookies([id]);
    let [latest, setLatest] = useState(cookies[id] === 'true' ? true : false);
    const [hasMore, setMore] = useState(true);
    const history = useHistory();
    let loading = false;
    let chunkSize = 10;

    const updateEpisodes = async () => {
        if(userId){
            setEpisodes([]);
            setMore(true);
            episodeArray = [];
            const epNum = document.getElementsByClassName(styles.number_input)[0].value;
            
            let endPoint = `${requests.fetchEpisodes}?show_id=${id}&user_id=${userId}`;
            if(latest){
                endPoint += `&offset=${chunkSize}&latest=true`;
                if(epNum){
                    endPoint += `&from=${epNum}`;
                }
            }else{
                endPoint += `&offset=${chunkSize}`;
                if(epNum){
                    endPoint += `&from=${epNum}`;
                }else{
                    endPoint += `&from=${0}`
                }
            }
            const response = await finalfetchSource(endPoint);
            if(response?.data){
                setEpisodes(response.data.result);
                episodeArray = response.data.result;
            }
        }
    }

    useEffect(() => {
        updateEpisodes();
        return () => {}   
    },[]);

    useEffect(()=>{
        updateEpisodes();
    },[id]);

    useEffect(() => {
        if(prevUserId !== userId){
            prevUserId = userId;
            updateEpisodes();
        }
    }, [userId])

    const fetchEps = async (from) => {
        if(userId){
            let endPoint = `${requests.fetchEpisodes}?show_id=${id}&user_id=${userId}&offset=${chunkSize}`;
            if(latest){
                endPoint += `&latest=true`;
            }
            if(from){
                endPoint += `&from=${from}`;
            }
            const response = await finalfetchSource(endPoint);
            return response?.data;
        }
    }

    const finalfetchSource = async (endPoint) => {
        if(userId && !loading){
            loading = true;
            const result = await axios.get(endPoint);
            console.log(result);
            loading = false;
            return result;
        }
    }

    const fetchMoreData = async () => {
        let from = 0;
        if(!latest){
            from = episodeArray?.length ? episodeArray[episodeArray.length-1].episode + 1 : 0;
            const response = await fetchEps(from);
            if(response){
                setEpisodes(episodeArray?.concat(response.result));
                episodeArray = episodeArray.concat(response.result);
                if(response.total_episodes === episodeArray.length){
                    setMore(false);
                }
            }
        }else if(latest && episodeArray[episodeArray.length-1]?.episode >= 1){
            from = episodeArray?.length ? episodeArray[episodeArray.length-1].episode - 1 : 0;
            const response = await fetchEps(from);
            if(response){
                setEpisodes(episodeArray?.concat(response.result));
                episodeArray = episodeArray.concat(response.result);
                if(episodeArray.length >= response.total_episodes){
                    setMore(false);
                }
            }
        }
    }

    const setNewRange = async () =>{
        const epNum = document.getElementsByClassName(styles.number_input)[0].value;
        let from = 1;
        let response = {};
        setEpisodes([]);
        if(epNum){
            from = epNum;
            response = await fetchEps(from);
            console.log('Range');
            console.log(response);
            if(response?.result){
                setEpisodes(response.result);
                episodeArray = response.result;
            }
        }else{
            from = 1;
            if(!latest){
                response = await fetchEps(from);
            }else{
                response = await fetchEps();
            }
            if(response?.result){
                setEpisodes(response.result);
                episodeArray = response.result;
            }
        }
        if(response.total_episodes === parseInt(from) + episodeArray.length -1){
            setMore(false);
        }
        if(response?.result && response.result.length){
            let last = 1;
            if(!latest){
                last = response.total_episodes;
            }
            if(response.result[response.result.length - 1].episode === last){
                setMore(false);
            }
        }else{
            setMore(false);
        }
    }

    const goToPlayer = (id) =>{
        history.push(`/player/${id}`);
    }

    const setOrderCookie = () => {
        latest = !latest;
        setLatest(latest);
        updateEpisodes();
        setCookie(id, latest , { path: '/' });
    }

    const [switchToggle,setSwitchToggle] = useState(true);

    return (
        <div className={styles.episodes}>
           <div className={styles.wrap}>
                {/* <div className={styles.toggle_switch}>
                    <label className={styles.switch}>
                        <input type="checkbox" checked={latest} onClick={setOrderCookie}/>
                        <span className={`${styles.slider} ${styles.round} `}></span>
                    </label>
                </div> */}
                <div className={styles.switch}>
                    <span  onClick={setOrderCookie} className={`${latest ? styles.pressed : styles.not_pressed}`}>Latest</span>
                    <span  onClick={setOrderCookie} className={`${!latest ? styles.pressed : styles.not_pressed}`}>Oldest</span>
                </div>
                <div className={`${styles.number} ${styles.neumorphism}`}>
                    <input type="number" placeholder="Episode to Start From" min="1" max="99999" className={`${styles.number_input}`} required/>
                    <div className={styles.go_btn} onClick={setNewRange}><FaArrowRight/></div>
                </div>
           </div>
            <div
            id="scrollable_div"
            className={styles.scrollable_div}
            >    
                <InfiniteScroll
                    className={styles.inf_scroll}
                    dataLength={episodes.length} //This is important field to render the next data
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={<PulseLoader color="#ffff"/>}
                    endMessage={
                      <p style={{ textAlign: 'center' }}>
                        <b>Yay! You have seen it all</b>
                      </p>
                    }
                >
                    {episodes?.map((episode, index) => (
                        <div className= {`${styles.episode_card} ${styles.neumorphism}`} key={index} onClick={()=>{goToPlayer(episode.id)}}>
                            <img draggable="false" alt={episode.name} className={styles.episode_thumbnail} src={episode.thumbnail_url}/>
                            <div className={styles.wrapper}>
                                <div className={styles.episode_name}>{episode.episode} - {episode.name}</div>
                                {episode?.type ? <div className={`${styles.type} ${episode.type.toLowerCase() === "filler" ? styles.red : ( episode.type.toLowerCase() === 'manga canon' ? styles.green : styles.orange)  }`}>{episode?.type}</div> : ""}
                            </div>
                            
                            <div className={styles.episode_description}>{"Asta and Yuno were abandoned at the same church on the same day. Raised together as children, they came to know of the 'Wizard King'—a title given to the strongest mage in the kingdom—and promised that they would compete against each other for the position of the next Wizard King.Asta and Yuno were abandoned at the same church on the same day. Raised together as children, they came to know of the 'Wizard King'—a title given to the strongest mage in the kingdom—and promised that they would compete against each other for the position of the next Wizard King.Asta and Yuno were abandoned at the same church on the same day. Raised together as children, they came to know of the 'Wizard King'—a title given to the strongest mage in the kingdom—and promised that they would compete against each other for the position of the next Wizard King.Asta and Yuno were abandoned at the same church on the same day. Raised together as children, they came to know of the 'Wizard King'—a title given to the strongest mage in the kingdom—and promised that they would compete against each other for the position of the next Wizard King.Asta and Yuno were abandoned at the same church on the same day. Raised together as children, they came to know of the 'Wizard King'—a title given to the strongest mage in the kingdom—and promised that they would compete against each other for the position of the next Wizard King.Asta and Yuno were abandoned at the same church on the same day. Raised together as children, they came to know of the 'Wizard King'—a title given to the strongest mage in the kingdom—and promised that they would compete against each other for the position of the next Wizard King.Asta and Yuno were abandoned at the same church on the same day. Raised together as children, they came to know of the 'Wizard King'—a title given to the strongest mage in the kingdom—and promised that they would compete against each other for the position of the next Wizard King.Asta and Yuno were abandoned at the same church on the same day. Raised together as children, they came to know of the 'Wizard King'—a title given to the strongest mage in the kingdom—and promised that they would compete against each other for the position of the next Wizard King."}</div>
                            <div className={styles.progress} style={{width: `${episode.progress}%`}}/>
                        </div>
                    ))}
                </InfiniteScroll>
            </div>
        </div>
    )
}

export default Episodes;
