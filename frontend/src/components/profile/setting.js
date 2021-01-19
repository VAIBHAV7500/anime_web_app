import React, { useState } from 'react';
import PulseLoader from "react-spinners/PulseLoader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './setting.module.css'
import Account from './setting_components/account';
import Player from './setting_components/player';

const Setting = () => {
  const [active,setActive] = useState(0);
  const settingNavItems = [
    {
      title : "Account",
      component : <Account/>,
    },
    {
      title : "Player",
      component : <Player/>,
    },
  ]
  
  return (
    <div className={styles.body}>
      <div className={styles.field_container}>
        {settingNavItems.map((fieldNode,index) => (
          <div className={active === index ? styles.active_nav : ""} onClick={()=>{setActive(index)}}>
            {fieldNode.title}
          </div>
        ))}
      </div>
      <div className={styles.container}>
        {settingNavItems[active].component}
      </div>
    </div>
  )
}

export default Setting
