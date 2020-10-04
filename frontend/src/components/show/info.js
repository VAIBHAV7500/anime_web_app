import React, { useState } from 'react';
import { MdDescription } from 'react-icons/md';
import styles from './info.module.css';

function Info({movie}) {
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
                { movie?.age_category  && <div className={styles.age}>{movie?.age_category}+</div>}
                <br className={styles.break}/>
                <div className={styles.genre}>
                    {movie?.genres?.map((genre)=>{
                        return <div className={styles.genre_card}>{genre}</div>
                    })}
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
