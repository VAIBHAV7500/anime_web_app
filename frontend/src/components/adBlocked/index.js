import React, {useEffect} from 'react';
import checkAdBlocker from '../../utils/adBlocker';
import Nav from '../services/Nav';
import styles from './adBlocked.module.css';
import { useLocation, useParams, useHistory } from 'react-router-dom';


function AdBlocked() {
  const history = useHistory();
  const params = useParams();
  const location = useLocation();
  useEffect(() => {
    (async () => {
      const adBlock = await checkAdBlocker();
      if(adBlock){
          console.log("Using Ad Blocker");
          //this.goToAdBlockPage();
      }else{
          console.log("Not Using Ad Blocker");
          checkRedirect();
      } 
    })(); 
  },[]);

  const reloadPage = () => {
    window.location.reload();
  }

  const checkRedirect = () => {
      const search = location.search;
      const redirectURL = new URLSearchParams(search).get('redirect');
      if(redirectURL){
        history.push(redirectURL);
      }
  }

  return (
    <div>
      <Nav type="dark" />
      <div className={styles.ad_block}>
        <p>We are detecting Ad blocker!!! Please remove it to continue the service
        If its wrong, please raise an issue at support@animei.tv</p>
          <div>
          <button onClick={reloadPage}> Retry </button>
        </div>
      </div>
    </div>
  )
}

export default AdBlocked