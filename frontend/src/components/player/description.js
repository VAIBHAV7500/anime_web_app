import React, { useEffect } from 'react'
import './description.css'


function Description() {
    
    useEffect(() => {
        if(document.documentElement.offsetHeight > 0)
        document.querySelector('.page').style.marginTop = document.documentElement.offsetHeight + "px";
        window.addEventListener("resize",()=>{
            if(document.documentElement.offsetHeight > 0)
            document.querySelector('.page').style.marginTop = document.documentElement.offsetHeight + "px";        
        });

        return () => {
            if (window.removeEventListener) {                   // For all major browsers, except IE 8 and earlier
                window.removeEventListener("resize", ()=>{});
            } else if (window.detachEvent) {                    // For IE 8 and earlier versions
                window.detachEvent("resize", ()=>{});   
            }
        }
    }, []);
    return (
        <div className="page">
            <div className="title"> Vinland Saga </div>
            <div className="heading">Episode Description</div>
            <div className='description'>
                    Young Thorfinn grew up listening to the stories of old sailors that had traveled the ocean and reached the place of legend, Vinland.It 's said to be warm and fertile, a place where there would be no need for fighting—not at all like the frozen village in Iceland where he was born, and certainly not like his current life as a mercenary. War is his home now. Though his father once told him, "You have no enemies, nobody does. There is nobody who it'
                    s okay to hurt, " as he grew, Thorfinn knew that nothing was further from the truth.<br/>

                    The war between England and the Danes grows worse with each passing year.Death has become commonplace, and the viking mercenaries are loving every moment of it.Allying with either side will cause a massive swing in the balance of power, and the vikings are happy to make names
                    for themselves and take any spoils they earn along the way.Among the chaos, Thorfinn must take his revenge and kill Askeladd, the man who murdered his father.The only paradise
                    for the vikings, it seems, is the era of war and death that rages on.
            </div>
            <div className="heading">Producers</div>
            <div className="description">
                Production I.G, 
                Dentsu, 
                Kodansha, 
                Twin Enginer
            </div>
            <div className="heading">Studios</div>
            <div className="description">
                Wit Studio
            </div>
        </div>
    )
}

export default Description
