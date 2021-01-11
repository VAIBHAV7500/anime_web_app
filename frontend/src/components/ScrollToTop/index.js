import React, { useEffect, useState } from 'react'
import styles from './index.module.css'
import {FaArrowCircleUp, FaArrowUp, FaChevronUp} from 'react-icons/fa';

const ScrollTop = () => {
    const [showScroll, setShowScroll] = useState(false)
    const scrollLimit = 100;
    const checkScrollTop = () => {
        if (!showScroll && window.pageYOffset > scrollLimit){
            setShowScroll(true)
        } else if (showScroll && window.pageYOffset <= scrollLimit){
            setShowScroll(false)
        }
    };
    
    const scrollToTop = () =>{
        window.scrollTo({top: 0, behavior: 'smooth'});
    };
    
    window.addEventListener("scroll",checkScrollTop);
    
    return (
    <div className={` ${styles.scrollTop} ${showScroll ? "" : styles.scrollHide}`} onClick={scrollToTop}>
        <FaChevronUp/>
    </div>
    )
}

export default ScrollTop
