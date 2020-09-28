import React ,{ useState, useEffect } from 'react';
import { FaUser, FaSearch } from "react-icons/fa";
import "./Nav.css";

const options = [
        { name: 'Option 1', value: '1234' },
        { name: 'Option 2', value: '5678' },
        { name: 'Option 2', value: '91011' }
      ];

function Nav() {
    const [show , handleShow] = useState(false);
    const [search, setSearch] = useState(false);

    useEffect(() => {
        window.addEventListener("scroll",() => {
            if(window.scrollY > 100){
                handleShow(true);
            }else handleShow(false);
        });
        return() => {
            window.removeEventListener("scroll");
        }

        
    }, []);

    const handleSearch = () => {
        console.log('Clicked');
        setSearch(true);
    }

    const generateSearchModal = () => {
        return <div className="search-modal">
           <div className="search-box">
                <input type="text" placeholder="Search" className="search-input"></input>
           </div>
        </div>
    }

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
            <div className="nav_rights">
                < FaSearch className="search_icon" onClick={handleSearch} />
                <FaUser className = "nav_avatar"></FaUser>
            </div>
            {search && generateSearchModal() }
        </div>
    )
}

export default Nav
