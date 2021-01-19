import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import styles from './index.module.css'
import moment from 'moment';
import requests from  '../../../utils/requests';
import axios from '../../../utils/axios';

const SignUpVerification = (props) => {
    const [, setActive] = props.activeArray;
    const [email, setEmail] = props.emailDetail;
    const [user,setUser] = props.userDetail;
    const [showResend, setShowResend] = useState(false);
    const resendTime = 120;
    let interval;
    let [timer, setTimer] = useState(resendTime);
    
    useEffect(() => {
        handleResendTimer();
        return () => {
            clearInterval(interval);
        }
    }, [])

    useEffect(()=>{
        if(timer==0){
            setTimer(resendTime);
        }
    },[timer]);

    const handleResendTimer = async () => {
        setShowResend(false);
        //await retry();
        interval = setInterval(() => {
            if(timer==1){
                setShowResend(true);
                clearInterval(interval);
            }
            timer = timer - 1;
            setTimer(timer);
        }, 1000);
    }

    const verifyUser = async () => {
        const otp = document.getElementById('otp').value;
        if(otp && user){
            const endPoint = requests.verify + `/${user}/${otp}`;
            const axiosInstance = axios.createInstance();
            const response = await axiosInstance.get(endPoint);
            if(response.status === 200){
                setActive(0);
            }else{
                //show error
            }
        }
    }

    const retry = async () => {
        const endPoint = requests.verifyResend + user.toString();
        const axiosInstance = axios.createInstance();
        const response = await axiosInstance.get(endPoint);
        if(response.status === 200){
            console.log('OTP Resent!');
        }else{
            //show error
        }
        handleResendTimer();
    }

    return (
        <div className={styles.body}>
            <FaArrowLeft className={styles.back} onClick={()=>{setActive(1)}}/>
            <div className={styles.container}>
                <h1 className={styles.heading}>OTP Verification</h1>    
                <div className={styles.info}>We've sent a verification code to your email - {email}</div>
                <div className={styles.time}>{moment.utc(timer * 1000).format("mm:ss")}</div>
                <input type="number" className={styles.input} id="otp" required placeholder="Enter verification code"/>
                <div className={styles.submit} onClick={verifyUser}>Submit</div>
                {showResend && <div className={styles.submit} onClick={retry}>Resend</div>}
            </div>
            
        </div>
    )
}

export default SignUpVerification
