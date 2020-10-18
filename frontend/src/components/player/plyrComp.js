import React, {useEffect, useState} from 'react';
import Plyr from 'plyr';
import 'plyr-react/dist/plyr.css';
import styles from './plyrComp.module.css';

function PlyrComp() {

    const player = new Plyr('#player');
    console.log(player);
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
    console.log(player);
    return (
        <div className={styles.player}>
            <video id="player" playsinline controls data-poster="/path/to/poster.jpg">

                <track kind="captions" label="English captions" src="/path/to/captions.vtt" srclang="en" default />
            </video>
        </div>
    )
}

export default PlyrComp
