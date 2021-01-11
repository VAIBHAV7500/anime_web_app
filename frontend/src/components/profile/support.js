import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import styles from './support.module.css'

function Support() {
    return (
        <div className={styles.body}>
            <div className={styles.container}>
                <select className={styles.select}>
                    <option selected disabled hidden>What's this About ?</option>
                    <option>Billing Issues</option>
                    <option>Video Player Issues</option>
                    <option>Website Issues</option>
                </select>
                <textarea placeholder={"How can we help?"}></textarea>
                <div className={styles.submit_btn}>Submit</div>
            </div>
        </div>
    )
}

export default Support
