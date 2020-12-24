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
      eventTracking: true,
    },
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
  const mobileCheck = function() {
    let check = false;
    // eslint-disable-next-line
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };

  
  useEffect(()=>{
    document.querySelector("input").blur();
    player = videojs(playerRef.current,playerOptions, () => {
      player.src(videoSrc);
      //player.ima(imaOptions);
      //player.skippy();
      if(!mobileCheck()){
        const videoElement = document.querySelector(".video-js");
        const commentElement = document.querySelector(`.${discussionStyles.body}`);
        videoElement.classList.add("shrink_video");
        commentElement.classList.add(discussionStyles.discussion_show);
      }

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

    //player.mobileUi();

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
