import React, {useState, useEffect} from 'react';
import styles from './similar.module.css';
import axios from '../../utils/axios';
import requests from '../../utils/requests';
import {useHistory, useParams} from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Similar({show_id, toastConfig, getCache, setState}) {
    const [similar, setSimilar] = useState([]);
    const [loading, setLoading] = useState(true);
    const history = useHistory();
    const {id} = useParams();

    const getSimilarShows = async () => {   
        let finalData;
        const cachedData = getCache(3);
        if(cachedData){
            finalData = cachedData;
        }else{
            const endPoint = `${requests.relatedShows}?id=${id}`;
            const axiosInstance = axios.createInstance();
            const response = await axiosInstance.get(endPoint).catch((err)=>{
                toast.error(`O'Oh, looks like there's some issue. Please try again later`);
            });
            setState(3,response?.data);
            finalData = response?.data;
        }
        if(finalData){
            setSimilar(finalData);
        }
        setLoading(false);
    }
    
    useEffect(() => {
        if(show_id){
            getSimilarShows();
        }

        return () => {
        
        }
    }, [id,show_id]);

    const goToShow = (id) => {
        history.push(`/show/${id}`);
    }

    return (
        <div className={styles.similar}>
            {loading && <div className = {styles.loader}><PulseLoader color="#ffff"/></div>}
            <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            />
            {
                similar.map((show, index)=>{
                    return <div className={`${styles.show} ${styles.neumorphism}`} key={index} onClick={()=>{goToShow(show.id)}}>
                        <div className={styles.wrap_description}>
                            <img src={show.poster_portrait_url} className={styles.show_image}></img>
                        </div>
                        <div className={styles.name}>{show.name}</div>
                    </div>
                })
            } 
        </div>
    )
}

export default Similar
