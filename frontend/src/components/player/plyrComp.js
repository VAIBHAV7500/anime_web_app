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

    player.on('progress', (event)=>{
        //console.log(event);
        console.log(player.currentTime);
    });

    useEffect(() => {

        const elements = document.getElementsByClassName('plyr');
        if(elements[0]?.innerHTML){
           // elements[0].innerHTML = <button>SKIP VIDEO</button> + elements[0].innerHTML;
           //elements[0].insertAdjacentHTML('beforeend', `<button style="transform: translate(600px, -50px);">SKIP VIDEO</button>`);
        }

        return () => {
            player.destroy();
        }
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
