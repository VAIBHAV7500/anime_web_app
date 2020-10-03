import React,{useState,useEffect} from 'react'
import styles from './SignIn.module.css';
import Spinner from '../Spinner/index'
import { FaUnlock, FaEnvelope } from 'react-icons/fa';
import FormGroup from '../Form-Group/FormGroup'
import axios from '../../../utils/axios';
import qs from 'qs';
import sha256 from 'crypto-js/sha256';
import { Link } from 'react-router-dom';

const Login = ()=>{
    const appbaseurl = process.env.REACT_APP_BASE_URL;
    const [state,setState] = useState({
        loader : false,
        email:"",
        password:"",
        errorShow:false
    });
    useEffect(() => {
        document.body.classList.add(styles.body);
        return () => {
            document.body.classList.remove(styles.body);
        }
    }, []);
    const handleAccessToken = async (token)=>{
        var config = {
            method: 'post',
            url: appbaseurl + '/restrictedArea/enter',
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer '+ token
            }
        };
        var response = await axios(config);
        if(response.data.message === "Successfully Entered"){
            return true;
        }
        return false;
    }
    const stopLoader = ()=>{
        setState(prevState => ({
            ...prevState,
            loader:false
        }));
    }
    const startLoader = ()=>{
        setState(prevState => ({
            ...prevState,
            loader:true,
        }));
    }

    const handleSignIn = async (e)=>{  
        e.preventDefault();
        startLoader();
        setState(prevState=>({
            ...prevState,
            errorShow : false
        }));
        const payload = qs.stringify({
            'username': (state.email).trim(),
            'password': sha256(state.password + process.env.REACT_PRIVATE_KEY).toString(),
            'grant_type': 'password',
            'client_id': 'null',
            'client_secret': 'null'
        });
        var config = {
            method: 'post',
            url: appbaseurl + '/auth/login',
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            },
            data : payload
        };
        
        const response = await axios(config).catch(err=>{
            setState(prevState=>({
                ...prevState,
                errorShow : true
            }));
        });
        if(response){
            const status = await handleAccessToken(response.data.access_token);
            if(!status){
                setState(prevState=>({
                    ...prevState,
                    errorShow : true
                }));
            }
        }
        stopLoader();
    }

    const handleChange = (e)=>{
        const {id , value} = e.target
        setState(prevState => ({
            ...prevState,
            [id] : value
        }));
    }
    const errorAdd = ()=>{
        return (
            <div className={styles.error}>
                <strong>Invalid Credentials</strong>
            </div>
        )
    }

    return (
        <div className={styles.sign_in_form}>
        <h1 className={styles.title_name}><strong>Sign In</strong></h1>
        {state.errorShow? errorAdd() : ""}
        <form onSubmit={handleSignIn}>
          <FormGroup
              id="email"
              name="Email"
              component={<FaEnvelope/>}
              type="email"
              value={state.email}
              onChange={handleChange}
          />
          <FormGroup
              id="password"
              name="Password"
              component={<FaUnlock/>}
              type="password"
              value={state.password}
              onChange={handleChange}
          />
          <div className={styles.forgot}>
            <a className={styles.link} href="">Forgot Password?</a>
            <p className={styles.para}><input type="checkbox" />Remember Me</p>
          </div>
        <button className={styles.btn} type="submit" >{ state.loader? <Spinner/> : <strong>Sign In</strong>}</button>
        </form>
        <p className={`${styles.sign_up_p} ${styles.para}`}>Don't have an account? <Link className={`${styles.sign_up} ${styles.link}`} to="/signup"><strong>Sign Up</strong></Link> </p>
      </div>
    )
}

export default Login; 
