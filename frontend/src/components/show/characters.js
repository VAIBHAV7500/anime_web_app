import React, { useState, useEffect } from 'react'
import styles from './characters.module.css';
import axios from '../../utils/axios';
import requests from '../../utils/requests';
import { useParams } from 'react-router-dom'

function Characters({show_id}) {
    const [characters, setCharacters] = useState([]);
    const [rotateCard, setRotateCard] = useState([]);
    const {id} = useParams();

    const updateCharacters = async () => {
        setCharacters([]);
        const response = await axios.get(`${requests.characters}?show_id=${id}`);
        if (response.data) {
            setCharacters(response.data);
            let dummyArr = new Array(response.data.length).fill(false);
            setRotateCard(dummyArr);
            console.log(dummyArr);
        } else {
            // Something went Wrong
        }
    }

    useEffect(() => {
        updateCharacters();
        return () => {
            setCharacters([]);
        }
    },[id]);


    const rotateOnClick = (index)=>{
        let dummyArr = new Array(rotateCard.length).fill(false);
        dummyArr[index] = !rotateCard[index]
        setRotateCard(dummyArr);
    }
    
    return (
        <div className={styles.characters}>
            <div className={styles.character_guideline}>
                <p>Characters will be shown as the story continues, or you can also reveal a card by clicking on it.</p>
            </div>
            {
                characters?.map((character,i)=>{
                    return (    
                    <div onClick={()=>{rotateOnClick(i)}} className={`${styles.character_card} `}>
                        <div className={`${styles.character_front} ${styles.neumorphism} ${rotateCard[i] ? styles.front_rotated : ""}`}>
                        </div>
                        <div className={`${styles.character_back} ${styles.neumorphism} ${rotateCard[i] ? styles.back_rotated : ""} `}>
                            <div className={styles.wrap_description}>
                                <img src={character.image_url} className={styles.character_image}></img>
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
}

export default Characters;
