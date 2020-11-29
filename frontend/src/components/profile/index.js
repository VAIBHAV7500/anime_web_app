import React, {useState, useEffect} from 'react';
import Nav from '../services/Nav';
import styles from './index.module.css';
import Watchlist from './watchlist';
import { useSelector } from 'react-redux';
import request from '../../utils/requests';
import Support from './support';
import MyReviews from './myReviews';
import userImg from '../../images/default_user_profile.png';
import axios from '../../utils/axios';
import requests from '../../utils/requests';

function Profile() {
    const [active, setActive] = useState(0);
    const [user,setUser] = useState({email:"",user_name:""});
    let id = useSelector(state=>state.user_id);
    const nav_items = [
      { 
        title : "currently Watching" ,
        component : <Watchlist userId={id} endPoint={request.fetchCurrentlyWatching}/>
      },
      { 
        title : "Watchlist",
        component: <Watchlist userId={id} endPoint={request.fetchWatchlist}/>
      },
      { 
        title : "Completed",
        component: <Watchlist userId={id} endPoint={request.fetchCompletedShows}/>
      },
      { 
        title : "Settings",
        component: null
      },
      { 
        title : "My Reviews",
        component: <MyReviews userId={id} endPoint={request.myReviews} />
      },
      {
        title: "Help & Support",
        component: <Support />
      }
    ];
    
    const generateNavField = (name, index) => {
        return (
            <div key={index} className={`${styles.nav_field_item} ${styles.neumorphism} ${active == index ? styles.active : ""}`} onClick={()=>{setActive(index)}}>
                {name}
            </div>
        );
    }

    const fetchUserDetails = async () => {
        const endPoint = `${requests.userDetails}?id=${id}`;
        const result = await axios.get(endPoint).catch((err)=>{
          console.log(err);
        });
        console.log(result);
        if(result && result.data){
           if(result.data.email){
              setUser(result.data);
           }
        }
    }

    useEffect(() => {
      if(id){
        fetchUserDetails();
      }
    }, [id])

    return (
        <>
        <Nav />
        <div className={styles.body}>
            <div className={styles.banner}>
                <img className={styles.user_img} src={userImg}></img>
                <h1 className={styles.user_name}>{user.user_name} {user.email}</h1>
            </div>
            <div className={`${styles.nav} ${styles.neumorphism}`}>
                {nav_items.map( (item,index) => generateNavField(item.title,index) )}
            </div>
            {nav_items[active].component}
        </div>
        </>
    )
}

export default Profile;
