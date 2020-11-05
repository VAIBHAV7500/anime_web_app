import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import requests from '../../utils/requests';
import styles from './episodes.module.css';
import {useHistory} from "react-router-dom";
import { useLocation, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import InfiniteScroll from 'react-infinite-scroll-component';

let episodeArray = [];

function Episodes() {
    const {id} = useParams();
    const [episodes, setEpisodes] = useState([]);
    const [cookies,setCookie] = useCookies(['order-track']);
    let [latest, setLatest] = useState(cookies['order-track'] === 'true' ? true : false);
    const [hasMore, setMore] = useState(true);
    const history = useHistory();
    let location = useLocation();
    let chunkSize = 10;

    const updateEpisodes = async () => {
        setEpisodes([]);
        setMore(true);
        episodeArray = [];
        let endPoint = `${requests.fetchEpisodes}?show_id=${id}`;
        if(latest){
            endPoint += `&offset=${chunkSize}&latest=true`;
        }else{
            endPoint += `&from=${0}&offset=${chunkSize}`;
        }   
        const response = await axios.get(endPoint);
        setEpisodes(response.data.result);
        episodeArray = response.data.result;
        return response.data.result;
    }

    useEffect(() => {
        updateEpisodes();
        return () => {}   
    },[]);

    useEffect(()=>{
        console.log('Updated');
        updateEpisodes();
    },[id]);

    const fetchEps = async (from) => {
        let endPoint = `${requests.fetchEpisodes}?show_id=${id}&from=${from}&offset=${chunkSize}`;
        if(latest){
            endPoint += `&latest=true`;
        }
        const response = await axios.get(endPoint);
        return response.data.result;
    }

    const fetchMoreData = async () => {
        let from = 0;
        if(!latest){
            from = episodeArray?.length ? episodeArray[episodeArray.length-1].episode + 1 : 0;
            const response = await fetchEps(from);
            setEpisodes(episodeArray?.concat(response));
            episodeArray = episodeArray.concat(response);
        }else if(latest && episodeArray[episodeArray.length-1]?.episode > 1){
            from = episodeArray?.length ? episodeArray[episodeArray.length-1].episode - 1 : 0;
            const response = await fetchEps(from);  
            setEpisodes(episodeArray?.concat(response));
            episodeArray = episodeArray.concat(response);
            if(from - chunkSize <= 1){
                setMore(false);
            }
        }
    }

    const setNewRange = async () =>{
        const epNum = document.getElementsByClassName(styles.number_input)[0].value;
        setEpisodes([]);
        if(epNum){
            const from = epNum;
            const response = await fetchEps(from);
            episodeArray = response;
        }else{
            const from = 1;
            const response = await fetchEps(from);
            setEpisodes(response);
            episodeArray = response;
        }
    }

    const goToPlayer = (id) =>{
        console.log(id);
        history.push(`/player/${id}`);
    }

    const setOrderCookie = () => {
        latest = !latest;
        setLatest(latest);
        updateEpisodes();
        setCookie('order-track', latest , { path: '/' });
    }

    return (
        <div className={styles.episodes}>
            <div className={styles.toggle_switch}>
                <label className={styles.switch}>
                    <input type="checkbox" checked={latest} onClick={setOrderCookie}/>
                    <span className={`${styles.slider} ${styles.round} `}></span>
                </label>
            </div>
            <div className={`${styles.number} ${styles.neumorphism}`}>
                <input type="number" placeholder="Episode to Start From" min="1" max="99999" className={`${styles.number_input}`} onChange={setNewRange}/>
            </div>
            <div
            id="scrollable_div"
            className={styles.scrollable_div}
            >    
                <InfiniteScroll
                    dataLength={episodes.length} //This is important field to render the next data
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
                    endMessage={
                      <p style={{ textAlign: 'center' }}>
                        <b>Yay! You have seen it all</b>
                      </p>
                    }
                >
                    {episodes?.map((episode, index) => (
                        <div className= {`${styles.episode_card} ${styles.neumorphism}`} key={index} onClick={()=>{goToPlayer(episode.id)}}>
                            <img draggable="false" alt={episode.name} className={styles.episode_thumbnail} src={episode.thumbnail_url}/>
                            <div className={styles.episode_name}>{episode.episode} - {episode.name}</div>
                            <div className={`${styles.type} ${episode.type.toLowerCase() === "filler" ? styles.red : ( episode.type.toLowerCase() === 'manga canon' ? styles.green : styles.orange)  }`}>{episode.type}</div>
                            <div className={styles.episode_description}>{"Asta and Yuno were abandoned at the same church on the same day. Raised together as children, they came to know of the 'Wizard King'—a title given to the strongest mage in the kingdom—and promised that they would compete against each other for the position of the next Wizard King."}</div>
                            <div className={styles.progress} style={{width: `${Math.floor(Math.random() * 100)}%`}}/>
                        </div>
                    ))}
                </InfiniteScroll>
            </div>
        </div>
    )
}

export default Episodes;
