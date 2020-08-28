import React ,{ useState, useEffect } from 'react';
import { FaUser } from "react-icons/fa";
import "./Nav.css";

const options = [
        { name: 'Option 1', value: '1234' },
        { name: 'Option 2', value: '5678' },
        { name: 'Option 2', value: '91011' }
      ];

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
            {/* <img 
                className='nav_logo'
                // src=""
                alt="ANIMEI LOGO"
            /> */}
            <h1 className={`nav_logo ${show && "logo_white"}`}>
                    ANIMEI
            </h1>
            {/* <img
                className="nav_avatar"
                // src=""
                alt="User Avatar"
            />   */}
            
            <FaUser className = "nav_avatar"></FaUser>
        </div>
    )
}

export default Nav
