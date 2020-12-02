import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './discussion.module.css';
import { FaArrowLeft, FaGrinAlt, FaPaperPlane, FaUnlock } from "react-icons/fa";
import Picker from 'emoji-picker-react';
import './emoPickerStyle.css'

function Discussion() {
    const {id} = useParams();
    const [picker,setPicker] = useState(false);
    
    const closeDiscussion = () => {
        let videoElement = document.querySelector(".video-js");
        let commentElement = document.querySelector("." + styles.body);
        videoElement.classList.remove("shrink_video");
        commentElement.classList.remove(styles.discussion_show);
        /* COMMENT HOOK NEEDED TO MAKE COMMENT HOOK FALSE */
    }
    const addSenderMessage = (message) => {
        document.getElementsByClassName(styles.discussion_container)[0].innerHTML+=`<div class="${styles.bubble} ${styles.sender_bubble}">${message} </div>`; 
    }
    const addRecieverMessage = (message) => {
        document.getElementsByClassName(styles.discussion_container)[0].innerHTML+=`<div class="${styles.bubble} ${styles.receiver_bubble}">${message} </div>`; 
    }
    const send = () => {
        let message = document.getElementById("send_message");
        if(message.value)
        addSenderMessage(message.value);
        message.value="";
        message.focus();
    }
    const handleSend = (e) => {
        if(e.which === 13){
            send();
        }
    }

    const onEmojiClick = (event, emojiObject) => {
        let message = document.getElementById("send_message");
        message.value += emojiObject.emoji;
        message.focus();
    };

    const openPicker = () => {
        setPicker(!picker);
    }

    return (
        <div className={`${styles.body} `}>
            <div className={styles.header}>
                <FaArrowLeft onClick={closeDiscussion} className={styles.back_icon}/>
                <h3>Discussion</h3>
            </div>
            <div className={`${styles.discussion_container} ${picker ? styles.discussion_container_translate : ""}`}>
                <div className={`${styles.bubble} ${styles.receiver_bubble}`}>
                    hey
                </div>
                <div className={`${styles.bubble} ${styles.sender_bubble}`}>
                    hey
                </div>
            </div>
            <div className={`${styles.footer} ${picker ? styles.footer_translate : "" }`}>
                <div className={styles.footer_wrapper}>
                <FaGrinAlt onClick={openPicker} className={styles.emo_selector_icon}/>
                <input onKeyPress={handleSend}  id="send_message" placeholder="Enter your Message"/>
                <FaPaperPlane onClick={send} className={styles.send_icon}/>
                </div>
                <Picker onEmojiClick={onEmojiClick} />
            </div>
        </div>
    )
}

export default Discussion;
