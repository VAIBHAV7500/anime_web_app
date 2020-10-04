import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import requests from '../../utils/requests';
import styles from './episodes.module.css';

function Episodes({show_id}) {
    const [episodes, setEpisodes] = useState([]);
    const chunkSize = 2;

    useEffect(() => {
        document.addEventListener('scroll', trackScrolling);
        const updateEpisodes = async () => {
            if(episodes.length === 0){
                const response = await axios.get(`${requests.fetchEpisodes}?show_id=${show_id}&from=0&to=${chunkSize}`);
                setEpisodes(response.data);
                console.log(episodes);
                return response;
            }
        }
        updateEpisodes();
        return () => {
            cleanup()
        }   
    });

    const cleanup = () => {
        document.removeEventListener('scroll', trackScrolling);
    }

    const isBottom = (el) => {
        return el.getBoundingClientRect().bottom <= window.innerHeight;
    }

    const trackScrolling = () => {
        const wrappedElement = document.getElementById('scrollable_div');
        if (isBottom(wrappedElement)) {
            console.log('header bottom reached');
            fetchMoreData();
            //document.removeEventListener('scroll', trackScrolling);
        }
    };

    const fetchEps = async (from, to) => {
        const response = await axios.get(`${requests.fetchEpisodes}?show_id=${show_id}&from=${from}&to=${to}`);
        return response;
    }

    const fetchMoreData = async () => {
        console.log('Fetching Data');
        const from = episodes.length ? episodes[episodes.length-1].episode + 1 : 0;
        const to = from + chunkSize;
        const response = await fetchEps(from,to);
        setEpisodes(episodes.concat(response.data));
        console.log(episodes);
        return response;
    }

    const setNewRange = async () =>{
        const epNum = document.getElementsByClassName(styles.number_input)[0].value;
        console.log(epNum);
        if(epNum){
            const from = epNum;
            const to = epNum + chunkSize;
            const response = await fetchEps(from, to);
            setEpisodes(response.data);
        }else{
            const from = 1;
            const to = epNum + chunkSize;
            const response = await fetchEps(from, to);
            setEpisodes(response.data);
        }
    }

    const goToPlayer = (id) =>{
        console.log(id);
    }

    return (
        <div className={styles.episodes}>
            <div className={`${styles.number} ${styles.neumorphism}`}>
                <input type="number" placeholder="Episode to Start From" min="1" max="999" className={`${styles.number_input}`} onChange={setNewRange}/>
            </div>
            <div
            id="scrollable_div"
            className={styles.scrollable_div}
            >    
                {episodes.map((episode, index) => (
                    <div className= {`${styles.episode_card} ${styles.neumorphism}`} key={index} onClick={()=>{goToPlayer(episode.id)}}>
                        <img className={styles.episode_thumbnail} src={episode.thumbnail_url}/>
                        <div className={styles.episode_name}>{episode.episode} - {episode.name}</div>
                        <div className={`${styles.type} ${episode.type == "filler" ? styles.red : styles.green }`}>{episode.type}</div>
                        <div className={styles.episode_description}>{"Asta and Yuno were abandoned at the same church on the same day. Raised together as children, they came to know of the 'Wizard King'—a title given to the strongest mage in the kingdom—and promised that they would compete against each other for the position of the next Wizard King."}</div>
                        <div className={styles.progress} style={{width: `${Math.floor(Math.random() * 100)}%`}}/>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Episodes;
