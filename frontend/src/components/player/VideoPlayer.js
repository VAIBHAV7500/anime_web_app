import React, { useEffect, useRef, useState } from 'react';
import styles from './VideoPlayer.module.css';
import './VideoPlayer.css';
import PropTypes from 'prop-types';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-hotkeys';
import '@videojs/http-streaming';

// eslint-disable-next-line import/prefer-default-export
const usePlayer = ({ src, controls }) => {
  const options = {
    techOrder: ['html5','flash'],
    controls: true,
    fill: true,
    preload: 'auto',
    muted: false,
    playbackRates: [0.5, 1, 1.5, 2],
    autoplay: true,
    responsive: true,
    html5: {
      hls: {
        enableLowInitialPlaylist: false,
        smoothQualityChange: true,
        overrideNative: true,
      },
    }
  };
  const videoRef = useRef(null);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    //videojs.registerPlugin('hotkeys',hotkeys);
    const vjsPlayer = videojs('video', {
      ...options,
      controls: true,
      sources: [src],
    }, function onPlayerReady(){
      console.log('Ready');
      this.hotkeys({
        volumeStep: 0.1,
        seekStep: 5,
        enableModifiersForNumbers: false
      });
    });
    setPlayer(vjsPlayer);

    return () => {
      if (player !== null) {
        player.dispose();
      }
    };
  }, []);
  useEffect(() => {
    if (player !== null) {
      player.src({ src });
    }
  }, [src]);

  console.log(videoRef);
  return videoRef;
};

const VideoPlayer = ({src}) => {
  const controls = true;
  const playerRef = usePlayer({ src, controls });

  return (
    <div data-vjs-player>
      <video ref={playerRef} id='video' className="video-js vjs-matrix vjs-big-play-centered" controls={true}/>
    </div>
  );
};

VideoPlayer.propTypes = {
  src: PropTypes.string.isRequired
};

export default VideoPlayer;