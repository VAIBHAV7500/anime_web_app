import React, { useState } from 'react';
import styles from './info.module.css';
import {useHistory} from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";

function Info({movie}) {
    const [moreSyn, setSynopsis] = useState(false);
    const history = useHistory();
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

    const goToShow = (id) => {
        history.push(`/show/${id}`);
    }
 

    return (
        <div className={styles.body}>
            <div className={`${styles.poster}`}>
                {movie?.poster_portrait_url && <img loading="lazy" draggable="false" alt="poster" src={movie?.poster_portrait_url.replace('medium','large')} className={styles.poster_img} onError={(event)=>{console.log(event);}} />}
            </div>
            <div className={`${styles.info}`}>
                <div name={movie?.age_category} className={`${styles.show_title}`}>{movie?.name}</div>
                <div className={styles.genre}>
                    {movie?.genres?.map((genre,index)=>{
                        return <div className={styles.genre_card}  key={index}>{genre}</div>
                    })}
                </div>
                <div className={styles.synopsis}>
                    {moreSyn ? movie?.description : truncate(movie?.description,400)}<p className={styles.see_more} onClick={toggleSyn} >{moreSyn? " See Less" : "See More"}</p>
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
                    <div className={`${styles.play_btn} `}>
                        Start Watching
                    </div>
                    <div className={`${styles.watch_list_btn}`}>
                        <AiOutlinePlus className={styles.plus} /> Watch List
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Info
