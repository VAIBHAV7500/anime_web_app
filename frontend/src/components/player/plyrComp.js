import React, {useEffect, useState} from 'react';
import Plyr from 'plyr';
import 'plyr-react/dist/plyr.css';
import styles from './plyrComp.module.css';
import {useHistory} from "react-router-dom";
import Hls from "hls.js";


function PlyrComp() {
    let el;
    //const player = new Plyr('#player');
    const history = useHistory();
    //const [player, setPlayer] = useState(new player('#player'));
    // player.source = {
    //     type: 'video',
    //     title: 'Some Title',
    //     sources: [{
    //             src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    //             type: 'video/mp4',
    //             size: 720,
    //         },
    //         {
    //             src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    //             type: 'video/mp4',
    //             size: 1080,
    //         },
    //     ],
    // }

    const source = 'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8';
	const video = document.querySelector('video');
	
	// For more options see: https://github.com/sampotts/plyr/#options
	// captions.update is required for captions to work with hls.js
	const player = new Plyr('#player', {
        controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
        captions: {
            active: true,
            update: true,
            language: 'en'
        },
        quality: {
            default: 480,
            options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240]
        },
        settings: ['captions', 'quality', 'speed', 'loop'],
        autoplay: true,
        keyboard: { focused: true, global: true }
    });

    player.source = {
        title: 'Demo Player'
    }
	
	if (!Hls.isSupported()) {
		video.src = source;
	} else {
        // For more Hls.js options, see https://github.com/dailymotion/hls.js
		const hls = new Hls();
		hls.loadSource(source);
		hls.attachMedia(video);
        window.hls = hls;
        player.on('languagechange', () => {
            // Caption support is still flaky. See: https://github.com/sampotts/plyr/issues/994
            setTimeout(() => hls.subtitleTrack = player.currentTrack, 50);
        });
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
    });

    player.on('seeked', ()=>{
        console.log('Seeked');
    });
    
    useEffect(() => {
        var findEl = setInterval(() => {
            el = document.querySelector('.plyr__captions');
            if(el){
                clearInterval(findEl);
                createPlayerButtons();
            }
        },200);
        return () => {
            player.destroy();
        }
    });

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
