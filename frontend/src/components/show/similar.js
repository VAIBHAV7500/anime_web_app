import React, {useState, useEffect} from 'react';
import styles from './similar.module.css';
import axios from '../../utils/axios';
import requests from '../../utils/requests';
import {useHistory} from "react-router-dom";

function Similar({show_id}) {
    const [similar, setSimilar] = useState([]);
    const history = useHistory();

    const getSimilarShows = async () => {   
        const endPoint = `${requests.relatedShows}?id=${show_id}`;
        const response = await axios.get(endPoint);
        setSimilar(response.data);
    }
    
    useEffect(() => {
        if(show_id){
            getSimilarShows();
        }

        return () => {
        
        }
    }, [show_id]);

    const goToShow = (id) => {
        history.push(`/show/${id}`);
    }

    return (
        <div className={styles.similar}>
            {
                similar.map((show)=>{
                    return <div className={`${styles.show} ${styles.neumorphism}`} onClick={()=>{goToShow(show.id)}}>
                        <div className={styles.wrap_description}>
                            <img src={show.poster_portrait_url} className={styles.character_image}></img>
                        </div>
                        <div className={styles.name}>{show.name}</div>
                    </div>
                })
            } 
        </div>
    )
}

export default Similar
