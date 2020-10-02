import React, { useState } from 'react';
import { MdDescription } from 'react-icons/md';
import styles from './info.module.css';

function Info({movie}) {
    console.log('in Info');
    console.log(movie);
    console.log(movie?.id);
    const [moreSyn, setSynopsis] = useState(false);

    function truncate(str , n){
        return str?.length > n ? str.substr(0 , n-1) + " ... ": str;
    }

    const toggleSyn = () => {
        setSynopsis(!moreSyn);
    }

    return (
        <div className={styles.info}>
            <img src={movie?.poster_portrait_url} className={styles.poster}/>
            <div className={styles.description}>
                <div className={styles.name}>{movie?.name}</div>
                <div className={styles.age}>{movie?.age_category}+</div>
                <br className={styles.break}/>
                <div className={styles.genre}>
                    <div className={styles.genre_card}>Comedy</div>
                    <div className={styles.genre_card}>Action</div>
                    <div className={styles.genre_card}>Fantasy</div>
                </div>
                <br className={styles.break}/>
                <div className={styles.synopsis}>
                    {moreSyn ? movie?.description : truncate(movie?.description,400)}<a className={styles.see_more} onClick={toggleSyn} >{moreSyn? " See Less" : "See More"}</a>
                </div>
            </div>
        </div>
    )
}

export default Info
