import React, { useState, useEffect } from 'react'
import styles from './characters.module.css';
import axios from '../../utils/axios';
import requests from '../../utils/requests';

function Characters({show_id}) {
    const [characters, setCharacters] = useState([]);

    const updateCharacters = async () => {
        const response = await axios.get(`${requests.characters}?show_id=${show_id}`);
        if (response.data) {
            console.log(response.data);
            setCharacters(response.data);
            console.log(characters);
        } else {
            // Something went Wrong
        }
    }

    useEffect(() => {
        updateCharacters();
        return () => {
            setCharacters([]);
        }
    }, [show_id])
    return (
        <div className={styles.characters}>
            {
                characters?.map((character)=>{
                    return <div className={`${styles.character} ${styles.neumorphism}`}>
                        <div className={styles.wrap_description}>
                            <img src={character.image_url} className={styles.character_image}></img>
                            <div className={styles.description}>
                                <h1>{character.role === "MC" ? "Main Character" : "Side Character"}</h1>
                                <p className={styles.character_description}>{character.description}</p>
                            </div>
                        </div>
                        <div className={styles.name}>{character.name}</div>
                        
                    </div>
                })
            }
        </div>
    )
}

export default Characters;
