import React, { useEffect, useState,useRef, createElement } from 'react';
import VideoComponent from 'react-video-js-player';
import styles from './VideoPlayerComp.module.css';
import videojs from 'video.js';
import 'videojs-hotkeys';
import './videoPlayer.css';
function VideoPlayerComp({src}) {
  const videoSrc = "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8";
  const playerRef = useRef();
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
      hotkeys: {}
    }
  }

  useEffect(()=>{
    //videojs.registerPlugin('hotkeys',this.hotkeys);
    const player = videojs(playerRef.current,playerOptions, () => {
      player.src(videoSrc);
    });
    var Button = videojs.getComponent('Button');
    var MyButton = videojs.extend(Button, {
      constructor: function() {
        Button.apply(this, arguments);
        this.addClass(styles.sample);
        this.controlText("Next");

      },
      handleClick: function() {
        /* do something on click */
        console.log("hey");
      }
    });
    videojs.registerComponent('MyButton', MyButton);
    player.addChild('MyButton', {});
    return () => {
      player.dispose();
    };
  },[]);

  return (
    <div>	
      <div data-vjs-player>
        <video ref={playerRef} className={` video-js ${styles.player} vjs-big-play-centered`} playsInline/>
      </div>
    </div>  
  )
}

export default VideoPlayerComp
