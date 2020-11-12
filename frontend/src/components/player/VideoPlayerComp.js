import React, { useEffect, useState,useRef, createElement } from 'react';
import VideoComponent from 'react-video-js-player';
import styles from './VideoPlayerComp.module.css';
import videojs from 'video.js';
import 'videojs-hotkeys';
import './videoPlayer.css';
import 'videojs-event-tracking';
import { useHistory } from 'react-router';
import player from './player';

function VideoPlayerComp({src}) {
  const videoSrc = "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8";
  const playerRef = useRef();
  const history = useHistory();

  const playerOptions = {
    autoplay: true, 
    muted: false,
    controls:true,
    controlBar: {
      volumeMenuButton: {
        inline: false,
        vertical: true
      },
      volumePanel: {inline: false},
      progressControl: {
        seekBar: true
      },
      textTrackSettings: false,
      currentTimeDisplay: true,
      timeDivider: true,
      durationDisplay: true,
      remainingTimeDisplay: false,
      subtitlesButton: false,
      captionsButton: true,
      audioTrackButton: true
    },
    playbackRates: [0.5, 1, 1.5, 2],
    responsive:true,
    html5: {
      hls: {
        enableLowInitialPlaylist: true,
        smoothQualityChange: true,
        overrideNative: true,
      }
    },
    plugins: {
      hotkeys: {},
      eventTracking: true
    }
  }

  const createButton = (el,text,id,styleClasses=[],onClick,reverse=false) => {
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

  const createPlayerButtons = (player) => {
    const el = document.getElementsByClassName('vjs-big-play-button')[0];
    console.log(el);
    createButton(el,"Skip Intro","skip_intro",[styles.skip_intro],() => {
        console.log("clicked");
        const stopTime = 22;
        player.currentTime(stopTime);
        removeButton('skip_intro');
    });
    createButton(el,"Back","back",[styles.back_btn, 'vjs-control-bar'],()=>{
        //removeButton("skip_intro");
      history.goBack();
    },true);
  }


  useEffect(()=>{
    //videojs.registerPlugin('hotkeys',this.hotkeys);
    const player = videojs(playerRef.current,playerOptions, () => {
      player.src(videoSrc);
    });

    player.on('tracking:firstplay', (e, data) => {
      console.log('Button');
      createPlayerButtons(player);
    });

    const checkTime = setInterval(function(){
       console.log(player?.currentTime()); 
    }, 3000);
    return () => {
      clearInterval(checkTime);
      player.dispose();
    };
  },[]);

  return (
      <div data-vjs-player className={styles.player}>
        <video ref={playerRef} className={` video-js ${styles.player} vjs-big-play-centered`} playsInline/>
      </div>  
  )
}

export default VideoPlayerComp
