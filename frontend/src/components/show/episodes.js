import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import requests from '../../utils/requests';

function Episodes({show_id}) {
    const [episodes, setEpisodes] = useState([]);
    const cleanup = () => {
        setEpisodes([]);
    }
    useEffect(() => {
        const updateEpisodes = async () => {
            if(!episodes.length){
                const response = await axios.get(`${requests.fetchEpisodes}?show_id=${show_id}`);
                console.log(response.data);
                setEpisodes(response.data);
                console.log(episodes);
                console.log(episodes.length);
            }
        }
        updateEpisodes();
        return () => {
           //cleanup();
        }
    }, [show_id]);
    return (
        <div>
            
        </div>
    )
}

export const EpisodeMemo = Episodes;
