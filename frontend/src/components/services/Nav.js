import React ,{ useState, useEffect } from 'react';
import { FaUser, FaSearch, FaSlidersH } from "react-icons/fa";
import axios from '../../utils/axios';
import requests from '../../utils/requests';
import "./Nav.css";
import Filter from './filter'
import {useHistory} from "react-router-dom";
import {useDispatch} from 'react-redux';
import {LoginFailure} from '../../redux/Auth/authAction';
import { useCookies } from 'react-cookie';

function Nav() {
    const [show , handleShow] = useState(false);
    const [search, setSearch] = useState(false);
    const [searchSet, setSearchSet] = useState([]);
    const [filter,setFilter] = useState(false);
    const [dropDown,setDropdown] = useState(false);
    const history = useHistory();
    const [, , removeCookie] = useCookies(['loginCookie']);
    const dispatch = useDispatch();
    
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
    

    useEffect(() => {
        if(search === true){
            document.querySelector(".search-input").focus();
            document.body.style.overflow="hidden";
        }else{
            document.body.style.overflow="auto";
        }
    },[search])

    const handleSearch = () => {
        setSearch(!search);
        if(!search){
            setSearchSet([]);
        }
    }

    const goToShow = (id) => {
        setSearch(false);
        history.push(`/show/${id}`);
    }

    const goToHome = () => {
        history.push('/');
    }

    const getSuggestions = async (fiter = false,data) => {
        const word = document.getElementsByClassName('search-input')[0].value;
        let baseUrl = requests.fetchSuggestions;
        let body = {};
        if(word){
            body = {
                key: word,
            }
        }
        if(filter){
            baseUrl += '?filter=true';
            body = Object.assign(body,data);
        }
        let request = await axios.post(baseUrl, body);
        setSearchSet(request.data);
    }
    const getData = (data)=>{
        getSuggestions(true,data);
    }

    const generateSearchModal = () => {
        return <div className={`search-modal`}>
           <div className={`search-box slide-in-top`}>
                <input type="text" placeholder="Search" className="search-input" onChange={getSuggestions}></input>
                <FaSlidersH onClick={()=>{setFilter(!filter)}} className="filter-svg"></FaSlidersH>
           </div>
           <div className={`filter_box ${filter ? "show_filter" :"" }`} >
                <Filter showFilter={setFilter} submit={getData} />
           </div>
           <div className={`suggestions`}>
               <div className="suggestion-dialog">
                {
                    searchSet?.map((suggestion)=>{
                        return <div className="suggestion-card" key={suggestion.id} onClick={()=>{ goToShow(suggestion.id)}}>
                        <img draggable="false" src={suggestion.poster_portrait_url} alt={suggestion.name} className="suggestion-image" ></img>
                        <div className="card-details">
                        <div className="card-name">{suggestion.name}</div>
                        </div> 
                    </div>
                    })
                }
                </div>
           </div>
        </div>
    }
    const showSignOutButton = () => {
        if(dropDown === strue){
            document.querySelector('.dropdown_content').classList.remove('slide-in-right')
            document.querySelector('.dropdown_content').className += " slide-out-right";
            setTimeout(()=>{setDropdown(!dropDown)},500);
        }else{
            setDropdown(!dropDown);
        }
    };
    const logout = () => {
        removeCookie('token', { path: '/' });
        dispatch(LoginFailure());
    }
    return (
        <div className={`nav ${!search && show && "nav_black"}`}>
            <h1 className={`nav_logo ${!search && show  && "logo_white"}`} onClick={goToHome}>
                    ANIMEI TV
            </h1>
            <div className="nav_rights">
                < FaSearch className="search_icon" onClick={handleSearch} />
                <span onClick={showSignOutButton} ><FaUser className = "nav_avatar"></FaUser><span className="arrow-down"></span></span>
            </div>
            <div className={`dropdown_content  ${dropDown? "show_block slide-in-right" : ""}`} >
                    <button className="signOut_Button" onClick={logout}><strong>Sign Out</strong></button>
            </div>
            {search && generateSearchModal()}
            {search && <div className="shadow" onClick={handleSearch}></div>}
        </div>
    )
}

export default Nav
