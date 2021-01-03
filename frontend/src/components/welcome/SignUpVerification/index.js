import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import styles from './index.module.css'
import moment from 'moment';

const SignUpVerification = (props) => {
    const [, setActive] = props.activeArray;
    const [email, setEmail] = props.emailDetail;
    const [showResend, setShowResend] = useState(false);
    const resendTime = 120;
    let interval;
    let [timer, setTimer] = useState(resendTime);
    
    useEffect(() => {
        handleResend();
        return () => {
            clearInterval(interval);
        }
    }, [])

    useEffect(()=>{
        if(timer==0){
            setTimer(resendTime);
        }
    },[timer]);

    const handleResend = async () => {
        setShowResend(false);
        interval = setInterval(() => {
            if(timer==1){
                setShowResend(true);
                clearInterval(interval);
            }
            timer = timer - 1;
            setTimer(timer);
        }, 1000);
    }

    return (
        <div className={styles.body}>
            <FaArrowLeft className={styles.back} onClick={()=>{setActive(1)}}/>
            <div className={styles.container}>
                <h1 className={styles.heading}>OTP Verification</h1>    
                <div className={styles.info}>We've sent a verification code to your email - {email}</div>
                <div className={styles.time}>{moment.utc(timer * 1000).format("mm:ss")}</div>
                <input type="number" className={styles.input} required placeholder="Enter verification code"/>
                <div className={styles.submit}>Submit</div>
                {showResend && <div className={styles.submit} onClick={handleResend}>Resend</div>}
            </div>
            
        </div>
    )
}

export default SignUpVerification
