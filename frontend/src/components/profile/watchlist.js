import React, { useState,useEffect } from 'react';
import styles from './watchlist.module.css';
import {useHistory} from "react-router-dom";
import axios from '../../utils/axios';

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
        const body = {
            user_id: userId,
        }
        return axios.post(endPoint, body);
    }
    
    const generateWatchlist = async () => {
        const response = await getWatchlist();
        setWatchlist(response.data.result);
    }

    const gotoShow = (id) => {
        console.log(id);
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
                </div>
            ))}
            </div>
        </div>
    );
}

export default Watchlist;

