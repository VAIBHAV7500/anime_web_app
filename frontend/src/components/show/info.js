import React, { useEffect, useState } from 'react';
import styles from './info.module.css';
import {useHistory} from "react-router-dom";
import axios from '../../utils/axios';
import requests from '../../utils/requests';
import { useSelector } from 'react-redux';

function Info({movie}) {
    const [moreSyn, setSynopsis] = useState(false);
    const [watchStatus, setWatchStatus] = useState('Add to List');
    const [latest, setLatest] = useState({});
    const history = useHistory();
    const userId = useSelector(state => state.user_id);

    function truncate(str , n){
        return str?.length > n ? str.substr(0 , n-1) + " ... ": str;
    }

    const toggleSyn = () => {
        setSynopsis(!moreSyn);
    }
    
    const changeGroupSize = (size, blur = false) => {
        let element = document.getElementById('season-group');
        element.size = size;
        if(blur){
            element.blur();
            goToShow(element.value);
        }
    }

    useEffect(() => {
        if(movie?.name){
            document.title = movie.name + ' - Animei TV';
        }
        setWatchStatus(movie?.watchlist ? 'remove from list' : 'Add to List');
        if(movie?.recent){
            setLatest(movie.recent);
        }
        return () => {
            document.title = 'Animei TV - An Anime Streaming Platform';
        }
    }, [movie])

    const goToShow = (id) => {
        if(id){
            history.push(`/show/${id}`);
        }
    }

    const goToPlayer = (id) =>{
        if(id){
            history.push(`/player/${id}`);
        }
    }

    const createMarkup = (description) => {
        return {
            __html: description
        };
    }

    const handleWatchList = async () => {
        if(!['Adding','Removing'].includes(watchStatus)){
          const body = {
            user_id: userId,
            show_id: movie.id
          };
          let finalStatus = '';
          const axiosInstance = axios.createInstance();
          if(watchStatus.toLowerCase() === 'add to list'){
            setWatchStatus('Adding');
            await axiosInstance.post(requests.postWatchlist,body).catch((err)=>{
              console.log(err);
              //show error...
            });
            finalStatus = 'Remove from List';
          }else if(watchStatus.toLowerCase() === 'remove from list'){
            setWatchStatus('Removing');
            await axiosInstance.delete(`${requests.removeWatchlist}?show_id=${movie.id}&user_id=${userId}`).catch((err)=>{
                console.log(err);
                //show error...
            });
            finalStatus = 'Add to List';
          }
          setWatchStatus(finalStatus);
        }
    }
 

    return (
        <div className={styles.body}>
            <div className={`${styles.poster}`}>
                {movie?.poster_portrait_url && <img loading="lazy" draggable="false" alt="poster" src={movie?.poster_portrait_url.replace('medium','large')} className={styles.poster_img} onError={(event)=>{console.log(event);}} />}
            </div>
            <div className={`${styles.info}`}>
                <div name={movie?.age_category ? movie.age_category : 13} className={`${styles.show_title}`}><span style={{marginRight:"11px"}}>{movie?.name}</span></div>
                <div className={styles.genre}>
                    {movie?.genres?.map((genre,index)=>{
                        return <div className={styles.genre_card}  key={index}>{genre}</div>
                    })}
                </div>
                <div className={styles.synopsis} dangerouslySetInnerHTML={createMarkup(movie?.description)}>
                </div>
            </div>
            <div className={`${styles.group_change}`}>
                <select id="season-group" className={`${styles.select} ${styles.neumorphism}`} value={movie?.id} onFocus={()=>{changeGroupSize(5)}} size={`1`} onBlur={()=>{changeGroupSize(1)}} onChange={()=>{changeGroupSize(1,true)}}>        
                    {
                        movie?.groups?.map((group)=>{
                            return <option className={styles.option} key={group.id} value={group.id}>
                                {group.name}
                            </option>
                        })
                    }
                </select> 
                <div className={`${styles.btn_wrapper}`}>
                    <div className={`${styles.play_btn} `} onClick={()=>{goToPlayer(latest?.id)}}>
                        {latest?.episode_number && (latest.episode_number === 1 && latest.user_id === null ? 'Start Watching' : 'Continue Watching Ep ' + latest.episode_number)}
                    </div>
                    <div className={`${styles.watch_list_btn} ${watchStatus.toLowerCase() === 'remove from list' ? styles.remove: ""}`} onClick={handleWatchList}>
                        {watchStatus}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Info
