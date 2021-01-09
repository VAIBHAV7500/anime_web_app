import React, { useState, useEffect } from 'react';
import styles from './discussion.module.css';
import { FaArrowLeft, FaGrinAlt, FaPaperPlane } from "react-icons/fa";
import Picker from 'emoji-picker-react';
import './emoPickerStyle.css';
import { useSelector } from 'react-redux';
import moment from 'moment';


function Discussion({discussion,sendMessage,getCurrentTime,isPremium}) {
    const [emoPicker,setPicker] = useState(false);
    const userId = useSelector(state => state.user_id);
    
    const closeDiscussion = () => {
        let videoElement = document.querySelector(".video-js");
        let commentElement = document.querySelector("." + styles.body);
        videoElement.classList.remove("shrink_video");
        commentElement.classList.remove(styles.discussion_show);
    }

    useEffect(()=>{
        document.querySelector("."+styles.body).scrollTop = 0; 
        let discussContainer = document.querySelector("." + styles.discussion_container);
        discussContainer.scrollTo(0,discussContainer.scrollHeight); 
    });

    useEffect(()=>{
        const messages = discussion;
        if(messages){
            messages.forEach((x)=>{
                const time = moment.utc(parseFloat(x.time)*1000).format('HH:mm:ss');
                console.log(x);
                x.time = time;
                console.log(time);
                console.log(x);
                if(x.id === userId){
                    addSenderMessage(x);
                }else{
                    addRecieverMessage(x);
                }
            });
        }
    },[discussion, userId]);

    const addSenderMessage = ({message,time}) => {
        let name = "You";
        document.getElementsByClassName(styles.discussion_container)[0].innerHTML+=`<div class="${styles.bubble} ${styles.sender_bubble}"> <div class="${styles.bubble_wrapper}"> <div><span class="${styles.name}">${name}</span></div> <div class="${styles.bubble_detail_wrapper}"> <span class="${styles.message}">${message}</span> <span class="${styles.timestamp}">${time}</span> </div> </div> </div>`;
        const discussContainer = document.querySelector("." + styles.discussion_container);
        discussContainer.scrollTo(0,discussContainer.scrollHeight); 
    }
    const addRecieverMessage = ({message,time,email}) => {
        let name = email;
        document.getElementsByClassName(styles.discussion_container)[0].innerHTML+=`<div class="${styles.bubble} ${styles.receiver_bubble}"> <div class="${styles.bubble_wrapper}"> <div><span class="${styles.name}">${name}</span></div> <div class="${styles.bubble_detail_wrapper}"> <span class="${styles.message}">${message}</span> <span class="${styles.timestamp}">${time}</span> </div> </div> </div>`;
        const discussContainer = document.querySelector("." + styles.discussion_container);
        discussContainer.scrollTo(0,discussContainer.scrollHeight);  
    }
    const send = () => {
        let message = document.getElementById("send_message");
        if(message?.value?.trim()){
            const messageData = message.value.trim();
            const time = moment.utc(parseFloat(getCurrentTime())*1000).format('HH:mm:ss');
            addSenderMessage({message: messageData, time});
            if(userId){
                sendMessage(messageData,userId);
            }
        }
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
        setPicker(!emoPicker);
    }

    const mobileCheck = function() {
        let check = false;
        // eslint-disable-next-line
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    };

    return (
        <div className={`${styles.body} `}>
            <div className={styles.header}>
                <FaArrowLeft onClick={closeDiscussion} className={styles.back_icon}/>
                <h3>Discussion</h3>
            </div>
            {!isPremium && <div className={styles.advertisement}>

            </div>}
            <div className={`${styles.discussion_container} ${emoPicker ? styles.discussion_container_translate : ""}`}>
                    {/* <div className={`${styles.bubble} ${styles.receiver_bubble}`}>
                        <div className={styles.bubble_wrapper}>
                            <div><span className={styles.name}>Anubhav</span></div>
                            <div className={styles.bubble_detail_wrapper}>
                                <span className={styles.message}>heyvxcccccccccccccccc</span>
                                <span className={styles.timestamp}>7:12 PM</span>
                            </div>                            
                        </div>
                    </div>
                    
                    <div className={`${styles.bubble} ${styles.sender_bubble}`}>
                        <div className={styles.bubble_wrapper}>
                            <div><span className={styles.name}>You</span></div>
                            <div className={styles.bubble_detail_wrapper}>
                                <span className={styles.message}>hey</span>
                                <span className={styles.timestamp}>7:12 PM</span>
                            </div>                            
                        </div>
                    </div> */}
            </div>
            <div className={`${styles.footer}  ${emoPicker || mobileCheck() ? styles.footer_translate : "" }`}>
                <div className={styles.footer_wrapper}>
                {!mobileCheck() && <FaGrinAlt onClick={openPicker} className={styles.emo_selector_icon}/>}
                <input onKeyPress={handleSend}  id="send_message" placeholder="Enter your Comment"/>
                <FaPaperPlane onClick={send} className={styles.send_icon}/>
                </div>
                {!mobileCheck() && <Picker onEmojiClick={onEmojiClick} />}
            </div>
        </div>
    )
}

export default Discussion;
