import React ,{ useState, useEffect } from 'react';
import { FaUser, FaSearch } from "react-icons/fa";
import axios from '../../utils/axios';
import requests from '../../utils/requests';
import "./Nav.css";
import {useHistory} from "react-router-dom";

function Nav() {
    const [show , handleShow] = useState(false);
    const [search, setSearch] = useState(false);
    const [searchSet, setSearchSet] = useState([]);
    const history = useHistory();

    useEffect(() => {
        let isMounted = true; // note this flag denote mount status
        window.addEventListener("scroll",() => {
            if(isMounted){
                if (window.scrollY > 100) {
                    handleShow(true);
                } else
                    handleShow(false);
            }
        });
        return() => {
            //window.removeEventListener("scroll", handleMouseDown, true);
            isMounted = false; // note this flag denote mount status
        }

        
    }, []);

    const handleSearch = () => {
        console.log('Clicked');
        setSearch(!search);
    }

    const goToShow = (id) => {
        setSearch(false);
        history.push(`/show/${id}`);
    }

    const goToHome = () => {
        history.push('/');
    }

    const getSuggestions = async () => {
        const word = document.getElementsByClassName('search-input')[0].value;
        console.log(word);
        const request = await axios.get(`${requests.fetchSuggestions}?key=${word}`);
        console.log(JSON.stringify(request.data));
        setSearchSet(request.data.results);
        
    }

    const generateSearchModal = () => {
        return <div className="search-modal">
           <div className="search-box">
                <input type="text" placeholder="Search" className="search-input" onKeyDown={getSuggestions}></input>
                
           </div>
           <div className="suggestions">
                {
                    searchSet?.map((suggestion)=>{
                        return <div className="suggestion-card" key={suggestion.item.id} onClick={()=>{ goToShow(suggestion.item.id)}}>
                        <img src={suggestion.item.poster_portrait_url} alt={suggestion.item.name} className="suggestion-image" ></img>
                        <div className="card-details">
                    <div className="card-name">{suggestion.item.name}</div>
                        </div>
                    </div>
                    })
                }
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
            <h1 className={`nav_logo ${show && "logo_white"}`} onClick={goToHome}>
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
            {search && generateSearchModal()}
            {search && <div className="shadow" onClick={handleSearch}></div>}
        </div>
    )
}

export default Nav
