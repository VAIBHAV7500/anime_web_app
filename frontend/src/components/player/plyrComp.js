import React, {useEffect, useState} from 'react';
import Plyr from 'plyr';
import 'plyr-react/dist/plyr.css';
import styles from './plyrComp.module.css';
import {useHistory} from "react-router-dom";


function PlyrComp() {
    let el;
    const player = new Plyr('#player');
    const history = useHistory();
    //const [player, setPlayer] = useState(new player('#player'));
    player.source = {
        type: 'video',
        title: 'Some Title',
        sources: [{
                src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                type: 'video/mp4',
                size: 720,
            },
            {
                src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
                type: 'video/mp4',
                size: 1080,
            },
        ],
    }

    const createButton = (text,id,styleClasses=[],onClick,reverse=false) => {
        var btn = document.createElement("BUTTON");   
        btn.innerHTML = text; 
        btn.id = id;
        btn.classList.add(styles.player_btn);
        styleClasses.forEach(element => {
            btn.classList.add(element);
        });
        if(reverse){
            btn.classList.add(styles.slide_in_left);
        }else{
            btn.classList.add(styles.slide_in_right);
        }
        btn.onclick = onClick;
        el.insertAdjacentElement('afterend',btn);
    }

    const removeButton = (id) => {
        let el = document.querySelector('#' + id);
        el.remove();
    }

    const skipIntro = () => {
        console.log(player);
        player.currentTime = 10;
    }

    const backButton = () => {
        history.goBack();
    }

    const createPlayerButtons = () => {
        createButton("Skip Intro","skip_intro",[styles.click_me_player_btn],skipIntro);
        createButton("Back","back",[styles.back_player_btn],backButton,true);
    }

    player.on('controlsshown',()=>{
        let PlyrButtonArray = document.querySelectorAll('.' + styles.player_btn);
        PlyrButtonArray.forEach(btn => {
            if(!btn.classList.contains(styles.player_btn_show)){
                btn.classList.add(styles.player_btn_show);
            }
        });
    })
    
    player.on('controlshidden',()=>{
        let PlyrButtonArray = document.querySelectorAll('.' + styles.player_btn);
        PlyrButtonArray.forEach(btn =>{
            if(btn.classList.contains(styles.slide_in_left) && !btn.classList.contains(styles.slide_out_left)){
                btn.classList.add(styles.slide_out_left);
            }else if(btn.classList.contains(styles.slide_in_right) && !btn.classList.contains(styles.slide_out_right)){
                btn.classList.add(styles.slide_out_right);
            }
        });
        setTimeout(() => {
            PlyrButtonArray.forEach(btn => {
                if(btn.classList.contains(styles.slide_out_left)){
                    btn.classList.remove(styles.slide_out_left);
                }else if(btn.classList.contains(styles.slide_out_right)){
                    btn.classList.remove(styles.slide_out_right);
                }
                if(btn.classList.contains(styles.player_btn_show)){
                    btn.classList.remove(styles.player_btn_show);
                }
            });
        },50);
    })
    
    useEffect(() => {
        var findEl = setInterval(() => {
            el = document.querySelector('.plyr__captions');
            if(el){
                clearInterval(findEl);
                createPlayerButtons();
            }
        },200);
        
    },[]);

    player.on('progress', event => {
        const instance = event.detail.plyr;
        console.log(instance);
        //player.fullscreen.enter();
      });

    return (
        <div className={styles.player}>
            <video id="player" playsInline controls autoPlay={true} title={"Some Title"}>
                <track kind="captions" label="English captions" src="/path/to/captions.vtt" srcLang="en" default />
            </video>
        </div>
    )
}

export default PlyrComp
