import React ,{ useState, useEffect } from 'react';
import "./Nav.css"

function Nav() {
    const [show , handleShow] = useState(false);

    useEffect(() => {
        window.addEventListener("scroll",() => {
            if(window.scrollY > 100){
                handleShow(true);
            }else handleShow(false);
        });
        return() => {
            window.removeEventListener("scroll");
        }

        
    }, [])

    return (
        <div className={`nav ${show && "nav_black"}`}>
            <img 
                className='nav_logo'
                // src=""
                alt="ANIMEI LOGO"
            />
            <img
                className="nav_avatar"
                // src=""
                alt="User Avatar"
            />            
        </div>
    )
}

export default Nav
