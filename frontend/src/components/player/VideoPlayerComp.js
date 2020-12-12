import React, { useEffect, forwardRef, useRef, useImperativeHandle } from 'react';
//import VideoComponent from 'react-video-js-player';
import styles from './VideoPlayerComp.module.css';
import discussionStyles from './discussion.module.css';
import videojs from 'video.js';
import 'videojs-hotkeys';
import 'videojs-event-tracking';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import 'videojs-contrib-ads';
import 'videojs-ima';
import 'videojs-contrib-quality-levels';
import 'videojs-hls-quality-selector';
import 'videojs-errors';
import { MdAirportShuttle } from 'react-icons/md';
require('./videoPlayer.css');
/* eslint import/no-webpack-loader-syntax: off */
require('!style-loader!css-loader!video.js/dist/video-js.min.css');

const VideoPlayerComp = ({src,updateVideoStatus,updateDiscussion, setPlayer}) => {
  const videoSrc = "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8"
  //const videoSrc = "https://test-animei.s3.ap-south-1.amazonaws.com/The+Simpsons+Movie+-+1080p+Trailer.m3u8";
  const playerRef = useRef();
  const history = useHistory();
  let prevTime = 0;
  const userId = useSelector(state => state.user_id);
  const {id} = useParams();
  let player;
  let tempTime = 0;

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
      playbackRateMenuButton: false,
      currentTimeDisplay: true,
      timeDivider: true,
      durationDisplay: true,
      remainingTimeDisplay: false,
      subtitlesButton: false,
      captionsButton: true,
      qualitySelector: true,
      audioTrackButton: true
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

  var imaOptions = {
    adLabel: `Don't Like Ads? Switch to Premium`,
    adTagUrl: 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpremidpostpod&cmsid=496&vid=short_onecue&correlator='
  };

  var qualityOptions = {
    displayCurrentQuality: true,
    placementIndex: 6,
    vjsIconClass:  "vjs-icon-hd"
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
    createButton(el,"Back","back",[styles.back_btn, 'vjs-control-bar'],()=>{
      if(src.show_id){
        history.push(`/show/${src.show_id}`);
      }
    },true);
    createButton(el,"Discussion","discusson", [styles.discussion, 'vjs-control-bar'],()=>{
      let videoElement = document.querySelector(".video-js");
      let commentElement = document.querySelector(`.${discussionStyles.body}`);
      if(player.isFullscreen()){
        player.exitFullscreen();
      }

      if(videoElement && commentElement){
        if(videoElement.classList.contains("shrink_video")){
          videoElement.classList.remove("shrink_video");
          commentElement.classList.remove(discussionStyles.discussion_show);
        }else{
          videoElement.classList.add("shrink_video");
          commentElement.classList.add(discussionStyles.discussion_show);
        }
      }
    });
    const type = src?.type;
    if(type){
      if(type == "filler"){
        createButton(el,"", "filler", [styles.type, styles.red, 'vjs-control-bar'],()=>{});
      }else if(type === "manga" || type === "manga canon"){
        createButton(el,"", "manga", [styles.type, styles.green, 'vjs-control-bar'],()=>{});
      }else if(type === "anime"){
        createButton(el,"", "anime",[styles.type, styles.green, 'vjs-control-bar'],()=>{});
      }else if(type === "mixed" || type === "mixed canon"){
        createButton(el, "", "mixed", [styles.type, styles.orange, 'vjs-control-bar'],()=>{});
      }
    }
  }

  
  useEffect(()=>{
    document.querySelector("input").blur();
    player = videojs(playerRef.current,playerOptions, () => {
      player.src(videoSrc);
      //player.ima(imaOptions);
      const videoElement = document.querySelector(".video-js");
      const commentElement = document.querySelector(`.${discussionStyles.body}`);
      videoElement.classList.add("shrink_video");
      commentElement.classList.add(discussionStyles.discussion_show);
    

      player.hlsQualitySelector(qualityOptions);

      player.on("fullscreenchange",()=>{
        if(player.isFullscreen()){
          const videoElement = document.querySelector(".video-js");
          const commentElement = document.querySelector(`.${discussionStyles.body}`);
          if(videoElement.classList.contains("shrink_video")){
            videoElement.classList.remove("shrink_video");
            commentElement.classList.remove(discussionStyles.discussion_show);
          }
        }
      });

      player.errors();

    });

    let checkTime;

    setPlayer(player);

    player.on('tracking:firstplay', (e, data) => {
      createPlayerButtons(player);
      //checkButtons();
      const currentTime = ((src?.progress || 0) * (player?.duration() || 0)) /100;
      player.currentTime(currentTime);
      checkTime = setInterval(function(){
        checkSessionDetails();
        checkButtons(player);
      }, 3000);
    });

    const checkSessionDetails = () => {
      if(player){
        let currTime = 0;
        try{
          currTime = player?.currentTime();
        }catch(e){
          console.log(e);
        }
        if(currTime - prevTime >= 10){
          updateDiscussion(currTime);
        }
        if(Math.abs(currTime - prevTime)>= 10){
          const covered = (player?.currentTime() / player?.duration())*100;
          const body = {
            user_id: userId,
            show_id: src.show_id,
            video_id: src.id,
            covered
          }
          updateVideoStatus(body);
          prevTime = currTime;
        }
      }
    }

    const checkButtons = (player) => {
      const el = document.getElementsByClassName('vjs-big-play-button')[0];
      const currTime = player?.currentTime() || 0;
      tempTime = currTime;
      const buffer = 5;
      if(src.intro_end_time != null && src.intro_start_time != null){
        if(currTime + buffer >= src.intro_start_time && currTime <= src.intro_end_time){
          createButton(el,"Skip Intro","skip_intro",[styles.skip_intro],() => {
            const stopTime = src.intro_end_time;
            if(stopTime && player){
              player.currentTime(stopTime);
            }
            removeButton('skip_intro');
          });
        }
        else if(currTime + buffer >= src.intro_end_time){
           removeButton('skip_intro');
        }
      }

      if(src.closing_start_time && src.closing_end_time && src.next_show){
        if(currTime + buffer >= src.closing_start_time && currTime <= src.closing_end_time){
          createButton(el,"Next Episode","next",[styles.skip_intro],() => {
            goToPlayer(src.next_show, player);
          });
        }
        else {
           removeButton('next');
        }
      }
    }

    return () => {
      if(checkTime){
        clearInterval(checkTime);
      }
      checkSessionDetails();
      removeAllButton();
      console.log('Disposing Player...');
      player.dispose();
    };
  },[id]);

  return (
      <div className={styles.videoPlayer}>
        <div data-vjs-player className={styles.player}>
          <video ref={playerRef} className={` video-js ${styles.player} vjs-big-play-centered`} playsInline active />
        </div> 
      </div> 
  )
}

export default VideoPlayerComp
