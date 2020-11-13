import React, { useEffect, useState,useRef, createElement } from 'react';
import VideoComponent from 'react-video-js-player';
import styles from './VideoPlayerComp.module.css';
import videojs from 'video.js';
import 'videojs-hotkeys';
import './videoPlayer.css';
import 'videojs-event-tracking';
import { useHistory } from 'react-router';
import axios from '../../utils/axios';
import requests from '../../utils/requests';
import { useSelector } from 'react-redux';

function VideoPlayerComp({src}) {
  const videoSrc = "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8"
  const playerRef = useRef();
  const history = useHistory();
  let prevTime = 0;
  const userId = useSelector(state => state.user_id);

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
      audioTrackButton: true,
      qualitySelector: true
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
      console.log('SRc: ' + src.progress);
      console.log('Duration: ' + player?.duration());
      createPlayerButtons(player);

      const currentTime = ((src?.progress || 0) * (player?.duration() || 0)) /100;
      console.log('Current Time: ' + currentTime);
      player.currentTime(currentTime);
    });

    const checkTime = setInterval(function(){
       console.log(player?.currentTime()); 
       const currTime = player?.currentTime() || 0;
       if((currTime - prevTime)>= 10){
          const covered = (player?.currentTime() / player?.duration())*100;
          console.log(userId);
          const body = {
            user_id: userId,
            show_id: src.show_id,
            video_id: src.id,
            covered
          }
          const endPoint = requests.postVideoSessions;
          axios.post(endPoint,body);
          prevTime = currTime;
       }

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
