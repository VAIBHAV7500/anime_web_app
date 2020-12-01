import React, { useState,useEffect } from 'react';
import styles from './watchlist.module.css';
import {useHistory} from "react-router-dom";
import axios from '../../utils/axios';
import { MdPlayCircleOutline } from 'react-icons/md';

const Watchlist = ({userId, endPoint}) => {
    const [watchlist, setWatchlist] = useState([]);
    const history = useHistory();
    useEffect(() => {
        generateWatchlist();
        return ()=>{
            setWatchlist([]);
        }
    }, [endPoint,userId]);

    const getWatchlist = async () => {
        return axios.get(`${endPoint}?id=${userId}`);
    }
    
    const generateWatchlist = async () => {
        const response = await getWatchlist();
        setWatchlist(response.data.result);
    }

    const gotoShow = (id) => {
        history.push(`/show/${id}`)
    }

    return (
        <div className={styles.watchlist}>
            <div className={styles.container}>
            {watchlist?.map((show,index) => (
                <div onClick={()=>{gotoShow(show.id)}} key={index} className={`${styles.card} ${styles.neumorphism}` }  style={{backgroundImage:`url(${show.poster})`}}>
                    <div className={styles.wrapper}>
                        <h1 className={styles.show_title}>{show.name}</h1>
                        <p className={styles.show_description}>{show.description}</p>
                    </div>    
                    <MdPlayCircleOutline className={styles.play_icon}></MdPlayCircleOutline> 
                </div>
            ))}
            </div>
        </div>
    );
}

export default Watchlist;

