import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import requests from '../../utils/requests';
import styles from './episodes.module.css';
import InfiniteScroll from 'react-infinite-scroll-component';

function Episodes({show_id}) {
    const [episodes, setEpisodes] = useState([]);
    const [settings, setSettings] = useState(false);

    useEffect(() => {
        const updateEpisodes = async () => {
            if(episodes.length === 0){
                const response = await axios.get(`${requests.fetchEpisodes}?show_id=${show_id}`);
                setEpisodes(response.data);
                return response;
            }
        }
        updateEpisodes();
    });

    const fetchMoreData = () => {
        
    }

    return (
        <div className={styles.episodes}>
            <div
            id="scrollable_div"
            className={styles.scrollable_div}
            >
            {/*Put the scroll bar always on the bottom*/}
            <InfiniteScroll
                dataLength={episodes.length}
                next={fetchMoreData}
                style={{ display: 'flex', flexDirection: 'column' }} //To put endMessage and loader to the top.
                inverse={false} //
                hasMore={true}
                loader={<h4>Loading...</h4>}
                scrollableTarget="scrollable_div"
            >
                {episodes.map((_, index) => (
                <div className= {styles.scrollable_div} key={index}>
                    div - #{index}
                </div>
                ))}
            </InfiniteScroll>
            </div>
        </div>
    )
}

export default Episodes;
