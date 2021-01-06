import React, {useEffect} from 'react';
import checkAdBlocker from '../../utils/adBlocker';
import Nav from '../services/Nav';
import styles from './adBlocked.module.css';
import { useLocation, useHistory, Link } from 'react-router-dom';
import { FaSadCry } from 'react-icons/fa';


function AdBlocked() {
  const history = useHistory();
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
      <Nav type="dark"></Nav>
      <div className={styles.body}>
        <div className={styles.container}>
            <p><h2 className={styles.heading}>Don't Like Ads ?</h2></p>
            <section>
              <Link to={'/pricing'} className={styles.plan_btn}>GO PREMIUM</Link>
              <p className={styles.or}>
                <h3>OR</h3>
              </p>
              <p className={styles.para}>Turn Off the Ad Blocker and Refresh the page</p>
              <div onClick={reloadPage} className={styles.refresh_btn}>Refresh</div>
            </section>
          </div>
        <p mailTo={"support@animei.tv"} className={styles.notice}>If it's wrong, please raise an issue at <a className={styles.link} href={"mailto:support@animei.tv"}>support@animei.tv</a></p>
      </div>
    </div>
  )
}

export default AdBlocked