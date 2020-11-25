import React, { useEffect, useState,useRef, createElement } from 'react';
import VideoComponent from 'react-video-js-player';
import styles from './VideoPlayerComp.module.css';
import videojs from 'video.js';
import 'videojs-hotkeys';
import './videoPlayer.css';
import 'videojs-event-tracking';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom'
import axios from '../../utils/axios';
import requests from '../../utils/requests';
import { useSelector } from 'react-redux';

function VideoPlayerComp({src}) {
  const videoSrc = "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8"
  //const videoSrc = "https://test-animei.s3.ap-south-1.amazonaws.com/The+Simpsons+Movie+-+1080p+Trailer.mp4";
  const playerRef = useRef();
  const history = useHistory();
  let prevTime = 0;
  const userId = useSelector(state => state.user_id);
  const {id} = useParams();

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
      },
      nativeAudioTracks: false,
      nativeTextTracks: false,
    },
    plugins: {
      hotkeys: {},
      eventTracking: true
    }
  }

  const createButton = (el,text,id,styleClasses=[],onClick,reverse=false) => {
    let element = document.querySelector('#' + id);
    if(!element){
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
      if(el){
        el.insertAdjacentElement('afterend',btn);
      }
    }
  }

  const removeButton = (id) => {
      let el = document.querySelector('#' + id);
      if(el){
        el.remove();
      }
  }

  const removeAllButton = () => {
    const buttons = ["back","discussion","filler","manga","anime","skip_intro"];
    buttons.forEach((button)=>{
      removeButton(button);
    });
  }

  const goToPlayer = (id, player) => {
    if(id){
      player.dispose();
      history.push(`/player/${id}`);
      window.location.reload();
    }
  }

  const createPlayerButtons = (player) => {
    const el = document.getElementsByClassName('vjs-big-play-button')[0];
    console.log(el);
    createButton(el,"Back","back",[styles.back_btn, 'vjs-control-bar'],()=>{
        //removeButton("skip_intro");
      //history.goBack();
      console.log(src.show_id);
      if(src.show_id){
        history.push(`/show/${src.show_id}`);
      }
    },true);
    createButton(el,"Discussion","discusson", [styles.discussion, 'vjs-control-bar'],()=>{
      if(player.isFullscreen()){
        player.exitFullscreen();
      }
      var el = document.getElementsByClassName(styles.player)[0];
      console.log(el.scrollHeight);
      window.scrollBy(0,el.scrollHeight);
    });
    const type = src?.type;
    if(type){
      if(type == "filler"){
        createButton(el,"FILLER", "filler", [styles.type, styles.red, 'vjs-control-bar'],()=>{});
      }else if(type === "manga" || type === "manga canon"){
        createButton(el,"MANGA CANON", "manga", [styles.type, styles.green, 'vjs-control-bar'],()=>{});
      }else if(type === "anime"){
        createButton(el,"ANIME CANON", "anime",[styles.type, styles.green, 'vjs-control-bar'],()=>{});
      }else if(type === "mixed" || type === "mixed canon"){
        createButton(el, "MIXED CANON", "mixed", [styles.type, styles.orange, 'vjs-control-bar'],()=>{});
      }
    }
  }


  useEffect(()=>{
    //videojs.registerPlugin('hotkeys',this.hotkeys);
    const player = videojs(playerRef.current,playerOptions, () => {
      player.src(videoSrc);
      if(document.documentElement.offsetHeight > 0)
      document.querySelector('.video-js').style.height = document.documentElement.offsetHeight + "px";
      window.addEventListener("resize",()=>{
        if(document.documentElement.offsetHeight > 0)
        document.querySelector('.video-js').style.height = document.documentElement.offsetHeight + "px";
      });
    });

    player.on('tracking:firstplay', (e, data) => {
      console.log('SRc: ' + JSON.stringify(src));
      console.log('Duration: ' + player?.duration());
      createPlayerButtons(player);
      checkButtons();
      const currentTime = ((src?.progress || 0) * (player?.duration() || 0)) /100;
      console.log('Current Time: ' + currentTime);
      player.currentTime(currentTime);
    });

    const checkSessionDetails = () => {
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
    }

    const checkButtons = (player) => {
      const el = document.getElementsByClassName('vjs-big-play-button')[0];
      const currTime = player?.currentTime() || 0;
      const buffer = 5;
      console.log('Time: ' + currTime);
      console.log('Buff time: ' + currTime + buffer);

      if(src.intro_end_time != null && src.intro_start_time != null){
        if(currTime + buffer >= src.intro_start_time && currTime <= src.intro_end_time){
          console.log('Creating Skip Button');
          createButton(el,"Skip Intro","skip_intro",[styles.skip_intro],() => {
            console.log("clicked");
            const stopTime = src.intro_end_time;
            if(stopTime){
              player.currentTime(stopTime);
            }
            removeButton('skip_intro');
          });
        }
        else if(currTime + buffer >= src.intro_end_time){
          console.log('Removing Button');
           removeButton('skip_intro');
        }
      }

      if(src.closing_start_time && src.closing_end_time && src.next_show){
        if(currTime + buffer >= src.closing_start_time && currTime <= src.closing_end_time){
          createButton(el,"Next Episode","skip_intro",[styles.skip_intro],() => {
            goToPlayer(src.next_show, player);
          });
        }
        else if(currTime + buffer >= src.closing_end_time){
           removeButton('skip_intro');
        }
      }
    }

    const checkTime = setInterval(function(){
      checkSessionDetails();
      checkButtons(player);
    }, 3000);
    return () => {
      clearInterval(checkTime);
      checkSessionDetails();
      window.removeEventListener("resize", () => {});
      removeAllButton();
      player.dispose();
    };
  },[id]);

  return (
      <div className="videoPlayer">
        <div data-vjs-player className={styles.player}>
          <video ref={playerRef} className={` video-js ${styles.player} vjs-big-play-centered`} playsInline />
        </div> 
      </div> 
  )
}

export default VideoPlayerComp
