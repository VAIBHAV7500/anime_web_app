import React, { useState, useEffect } from 'react'
import styles from './characters.module.css';
import axios from '../../utils/axios';
import requests from '../../utils/requests';
import { useParams } from 'react-router-dom';
import PulseLoader from "react-spinners/PulseLoader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Characters = React.memo(({show_id, toastConfig, getRecent}) => {
    const [characters, setCharacters] = useState([]);
    const [rotateCard, setRotateCard] = useState([]);
    const [loading, setLoading] = useState(true);
    const {id} = useParams();

    const sortCharacters = (characters,recent) => {
        const revealed = [];
        const notRevealed = [];
        characters.forEach((character) => {
            if(character.revealed_in != null && character.revealed_in <= recent){
                revealed.push(character);
            }else{
                notRevealed.push(character);
            }
        });
        return revealed.concat(notRevealed);   
    }

    const updateCharacters = async () => {
        setCharacters([]);
        const response = await axios.get(`${requests.characters}?show_id=${id}`).catch((err)=>{
            toast.error(`O'Oh, looks like there's some issue. Please try again later`);
        });
        if (response?.data) {
            const recentData = getRecent();
            let recent = 0;
            if(recentData && recentData.user_id){
                recent = recentData?.episode_number || 0;
            }
            const data = sortCharacters(response.data,recent);
            setCharacters(data);
            let dummyArr = [];
            data.forEach((character)=>{
                dummyArr.push((character.revealed_in <= recent && character.revealed_in != null && recent != null));
            });
            setRotateCard(dummyArr);
        }
        setLoading(false);
    }

    useEffect(() => {
        updateCharacters();
        return () => {
            setCharacters([]);
        }
    },[id]);


    const rotateOnClick = (index)=>{
        const character = characters[index];
        const recentData = getRecent();
        let recent = 0;
        if(recentData && recentData.user_id){
            recent = recentData?.episode_number || 0;
        }
        console.log(recent);
        const dummyArr = [];
        characters.forEach((each) => {
            if(each === character){
                dummyArr.push(true);
            }else if(each.revealed_in != null && each.revealed_in <= recent){
                dummyArr.push(true);
            }else{
                dummyArr.push(false);
            }
        });
        //let dummyArr = new Array(rotateCard.length).fill(false);
        //dummyArr[index] = !rotateCard[index]
        setRotateCard(dummyArr);
    }
    
    return (
        <div className={styles.characters}>
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
            <div className={styles.character_guideline}>
                <p>Characters will be shown as the story continues, or you can also reveal a card by clicking on it.</p>
            </div>
            {
                characters?.map((character,i)=>{
                    return (    
                    <div key={i} onClick={()=>{rotateOnClick(i)}} className={`${styles.character_card} `}>
                        <div className={`${styles.character_front} ${styles.neumorphism} ${rotateCard[i] ? styles.front_rotated : ""}`}>
                        </div>
                        <div className={`${styles.character_back} ${styles.neumorphism} ${rotateCard[i] ? styles.back_rotated : ""} `}>
                            <div className={styles.wrap_description}>
                                <img alt={character.name} src={character.image_url} className={styles.character_image}></img>
                                <div className={styles.description}>
                                    <h1>{character.role === "MC" ? "Main Character" : "Side Character"}</h1>
                                    <p className={styles.character_description}>{character.description}</p>
                                </div>
                            </div>
                            <div className={styles.name}>{character.name}</div>    
                        </div>
                    </div>
                )})
            }
        </div>
    )
});

export default Characters;
