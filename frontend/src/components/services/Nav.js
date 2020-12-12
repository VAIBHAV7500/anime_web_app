import React ,{ useState, useEffect } from 'react';
import { FaUser, FaSearch, FaBell} from "react-icons/fa";
import styles from './Nav.module.css';
import {useHistory} from "react-router-dom";
import {useDispatch} from 'react-redux';
import {LoginFailure} from '../../redux/Auth/authAction';
import { useCookies } from 'react-cookie';
import mainLogo from './logo_transparent.png';
import ModalGenerator, { showModal } from './modalGenerator';
import Search from './search';
import axios from '../../utils/axios';
import requests from '../../utils/requests';
import { useSelector } from 'react-redux';

function Nav() {
    const [show , handleShow] = useState(false);
    const [search, setSearch] = useState(false);
    const [notifications, setNotifications] = useState([{body: "No New Notification",dummy:true}]);
    const [showNotification,setShowNotification] = useState(false);
    const [unread, setUnread] = useState(0);
    const history = useHistory();
    const [, , removeCookie] = useCookies(['loginCookie']);
    const userId = useSelector(state => state.user_id);
    const dispatch = useDispatch();

    const handleNotification = async () => {
        if(userId){
            const endpoint = `${requests.notification}?user_id=${userId}`;
            const result = await axios.get(endpoint).catch((err)=>{
                //do something
            });
            if(result){
                if(result?.data?.length){
                    setNotifications(result.data);
                    const unread = result.data.filter(x => x.read_reciept === 0).length;
                    setUnread(unread);
                }
            }
        }
    }

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
        handleNotification();
        return() => {
            //window.removeEventListener("scroll", handleMouseDown, true);
            isMounted = false; // note this flag denote mount status
        }    
    }, []);

    useEffect(()=>{
        if(userId){
            handleNotification();
        }
    },[userId]);

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
    ];

    const markNotificationAsRead = async () =>{
        if(userId && unread){
            const endPoint = `${requests.notificationRead}`;
            const body={
                user_id: userId
            };
            const result = await axios.patch(endPoint,body);
            if(result.status === 200){
                setUnread(0);
            }
        }
    }

    return (
        <div className={styles.nav_wrapper}>
            <div className={`${styles.nav} ${!search && show && styles.nav_black}`}>
                <span>
                    <img draggable="false" className={`${styles.nav_logo} ${!search && show  && styles.logo_white}`} onClick={goToHome} src={mainLogo} />
                </span>
                < FaSearch 
                    className={styles.search_icon} 
                    onClick={()=>{
                        showModal("searchModal",setSearch); 
                    }} 
                />
                <span className={styles.notification_icon} onClick={()=>{setShowNotification(!showNotification)}} onMouseEnter = {markNotificationAsRead}>
                    <FaBell className={`${styles.bell_icon} ${unread ? styles.ring : ""}`}/>
                {unread ? <span className={styles.notification_number}>{!notifications.dummy && (unread > 9 ? '9+' : unread)}</span> : ""}
                </span>
                <div className={`${styles.notification_dropdown} ${showNotification ? styles.show_notification : ""}`}>
                    {notifications?.map(notification_message => (
                        <div className={styles.notification_node}>
                            {notification_message?.body}
                        </div>
                    ))}
                </div>
                <span className={styles.avatar_span} >
                    <FaUser className = {styles.nav_avatar}></FaUser>
                </span>
                <div className={styles.dropdown_wrapper} >
                    <div className={`${styles.dropdown_content} `} >
                        <div className={`${styles.dropdown_container}`}>
                            {
                                dropdownContent.map((field,index) =>(
                                    <button key={index} className={`${styles.dropdown_button} ${field.class}`} onClick={field.onclick}>{field.name}</button>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
            {ModalGenerator(<Search searchHook={[search, setSearch]} />,"searchModal",setSearch)}
        </div>
    )
}

export default Nav
