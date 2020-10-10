import React, { useState } from 'react';
import styles from './info.module.css';
import {useHistory} from "react-router-dom";

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
        }
    }

    const goToShow = (id) => {
        history.push(`/show/${id}`);
    }

    return (
        <div className={styles.info}>
            <div>
                <img draggable="false" alt="poster" src={movie?.poster_portrait_url} className={styles.poster}/>
            </div>
            <div className={styles.description}>
            <div className={styles.make_flex}>
                <div className={styles.wrapper}>
                    <div className={styles.make_flex}>
                        <div className={styles.name}>{movie?.name}</div>
                        { movie?.age_category  && <div className={styles.age}>{movie?.age_category}+</div>}
                    </div>
                    <br className={styles.break}/>
                
                    <div >
                        <div className={styles.genre}>
                            {movie?.genres?.map((genre,index)=>{
                                return <div className={styles.genre_card} key={index}>{genre}</div>
                            })}
                        </div>
                        <br className={styles.break}/>
                        <div className={styles.synopsis}>
                            {moreSyn ? movie?.description : truncate(movie?.description,400)}<p className={styles.see_more} onClick={toggleSyn} >{moreSyn? " See Less" : "See More"}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <select id="season-group" className={`${styles.select} ${styles.neumorphism}`} value={movie?.id} onFocus={()=>{changeGroupSize(5)}} size={`1`} onBlur={()=>{changeGroupSize(1)}} onChange={()=>{changeGroupSize(1,true)}}>
                        {/*Load options */}
                        {
                            movie?.groups?.map((group)=>{
                                return <option className={styles.option} key={group.id} value={group.id} onClick={()=>{goToShow(group.id)}}>
                                    {group.name}
                                </option>
                            })
                        }
                    </select> 
                    <div className={`${styles.play_btn} ${styles.neumorphism}`}>
                        Start
                    </div>
                </div>    
            </div>     
        </div>
        </div>
    )
}

export default Info
