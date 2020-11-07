import React from "react";
import styles from './banner.module.css';

function Banner({movie}) {

    // function truncate(str , n){
    //     return str?.length > n ? str.substr(0 , n-1) + " ... ": str;
    // }
    return (
      <header
        className = {styles.banner}
        style={{
          backgroundSize: "cover",
          backgroundImage: `url(
                "${movie?.poster_landscape_url}"
            )`,
          backgroundPosition: "center",
        }}
      >
      <div className={styles.banner_fadeBottom}/>
      </header>
    );
}

export default Banner

