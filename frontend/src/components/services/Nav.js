import React ,{ useState, useEffect } from 'react';
import { FaUser, FaSearch, FaBell} from "react-icons/fa";
import "./Nav.css";
import {useHistory} from "react-router-dom";
import {useDispatch} from 'react-redux';
import {LoginFailure} from '../../redux/Auth/authAction';
import { useCookies } from 'react-cookie';
import mainLogo from './logo_transparent.png';
import ModalGenerator, { showModal } from './modalGenerator';
import Search from './search';

function Nav() {
    const [show , handleShow] = useState(false);
    const [search, setSearch] = useState(false);
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

    const goToHome = () => {
        history.push('/');
    }

    const logout = () => {
        removeCookie('token', { path: '/' });
        dispatch(LoginFailure());
    }

    const goToProfile = () => {
        history.push(`/user`);
    }

    const dropdownContent = [
        {
            name : "Profile",
            onclick : goToProfile,
            class : null,
        },
        {
            name : "Sign Out",
            onclick : logout,
            class : "signOut_Button",
        },
    ]
    
    const notifications = [
        "Your comment has been approved",
        "WooHoo! You have watched 1000 episodes"
    ]

    return (
        <div className="nav_wrapper">
        <div className={`nav ${!search && show && "nav_black"}`}>
            <span>
                <img draggable="false" className={`nav_logo ${!search && show  && "logo_white"}`} onClick={goToHome} src={mainLogo} />
            </span>
            < FaSearch 
                className="search_icon" 
                onClick={()=>{
                    showModal("searchModal",setSearch); 
                }} 
            />
            <span className="notification_icon">
                <FaBell className="bell_icon ring"/>
                <span className="notification_number">1</span>
            </span>
            <div className="notification_dropdown">
                {notifications?.map(notification_message => (
                    <div className="notification_node">
                        {notification_message}
                    </div>
                ))}
            </div>
            <span className="avatar_span" >
                <FaUser className = "nav_avatar"></FaUser>
            </span>
            <div className="dropdown_wrapper" >
                <div className={`dropdown_content `} >
                    <div className={`dropdown_container`}>
                        {
                            dropdownContent.map((field,index) =>(
                                <button key={index} className={`dropdown_button ${field.class}`} onClick={field.onclick}>{field.name}</button>
                            ))
                        }
                    </div>
                </div>
            </div>
            {ModalGenerator(<Search searchHook={[search, setSearch]} />,"searchModal",setSearch)}
        </div>
        </div>
    )
}

export default Nav
