import React from 'react'
import styles from './index.module.css';
import Nav from '../services/Nav';
const GeoBlock = () => {
    return (
        <>
        <Nav type="dark" />
        <div className={styles.body}>
            <div className={styles.container}>
                <h1 className={styles.heading}>Sorry!</h1>
                <section>
                    <h3>We're currently not available in your region</h3>   
                    <p>Enter you Email to know when we are available in your region</p>
                    <input className={styles.email_input} placeholder={"Enter your Email Address"} type="text"/>
                    <div className={styles.submit_btn}>Submit</div> 
                </section>
                
            </div>
        </div>
        </>
    )
}

export default GeoBlock
