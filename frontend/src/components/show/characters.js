import React, { useState, useEffect } from 'react'
import styles from './characters.module.css';
import axios from '../../utils/axios';
import requests from '../../utils/requests';
import { useParams } from 'react-router-dom'

function Characters({show_id}) {
    const [characters, setCharacters] = useState([]);
    const {id} = useParams();

    const updateCharacters = async () => {
        setCharacters([]);
        const response = await axios.get(`${requests.characters}?show_id=${id}`);
        if (response.data) {
            console.log(response.data);
            setCharacters(response.data);
            console.log(characters);
        } else {
            // Something went Wrong
        }
    }

    useEffect(() => {
        console.log(id);
        updateCharacters();
        return () => {
            setCharacters([]);
        }
    },[id]);
    return (
        <div className={styles.characters}>
            {
                characters?.map((character)=>{
                    return (
                    <div className={`${styles.character_card} `}>
                        <div className={`${styles.character_front} ${styles.neumorphism}`}>
                        </div>
                        <div className={`${styles.character_back} ${styles.neumorphism} `}>
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
