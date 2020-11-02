import React, { useState,useEffect } from 'react';
import styles from './watchlist.module.css';

import axios from '../../utils/axios';

const Watchlist = ({userId, endPoint}) => {
    const [watchlist, setWatchlist] = useState([]);
    useEffect(() => {
        generateWatchlist();
        return ()=>{
            setWatchlist([]);
        }
    }, [endPoint,userId]);

    const getWatchlist = async () => {
        const body = {
            user_id: userId,
        }
        return axios.post(endPoint, body);
    }
    
    const generateWatchlist = async () => {
        const response = await getWatchlist();
        setWatchlist(response.data.result);
    }

    return (
        <div className={styles.watchlist}>
            <div className={styles.container}>
            {watchlist?.map((show,index) => (
                <div key={index} className={`${styles.card} ${styles.neumorphism}` }  style={{backgroundImage:`url(${show.poster})`}}>
                    <div className={styles.wrapper}>
                        <h1 className={styles.show_title}>{show.name}</h1>
                        <p className={styles.show_description}>{show.description}</p>
                    </div>   
                </div>
            ))}
            </div>
        </div>
    );
}

export default Watchlist;

