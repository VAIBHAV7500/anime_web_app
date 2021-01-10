import React,{useState,useEffect} from 'react'
import styles from './SignIn.module.css';
import Spinner from '../Spinner/index'
import { FaUnlock, FaEnvelope } from 'react-icons/fa';
import FormGroup from '../Form-Group/FormGroup'
import axios from '../../../utils/axios';
import qs from 'qs';
import sha256 from 'crypto-js/sha256';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LoginSuccess } from '../../../redux/Auth/authAction';
import { useCookies } from 'react-cookie';
const Login = (props)=>{
    const appbaseurl = process.env.REACT_APP_BASE_URL;
    const [,setActive] = props.activeArray;
    const dispatch = useDispatch();
    const [state,setState] = useState({
        loader : false,
        email:"",
        password:"",
        errorShow:false
    });
    
    const [ _ , setCookie] = useCookies(['token']);

    const handleAccessToken = async (token)=>{
        var config = {
            method: 'post',
            url: appbaseurl + 'restrictedArea/enter',
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer '+ token
            }
        };
        console.log('Enter call from Sigin.js');
        const axiosInstance = axios.createInstance();
        var response = await axiosInstance(config);
        if(response.data.message === "Successfully Entered"){
            return {
                check : true,
                user_id : response.data.user_id,
                plan_id : response.data.plan_id
            };
        }
        return {
            check : false,
        };
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
            'password': state.password,
            'grant_type': 'password',
            'client_id': 'null',
            'client_secret': 'null'
        });
        var config = {
            method: 'post',
            url: appbaseurl + 'auth/login',
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            },
            data : payload
        };
        const axiosInstance = axios.createInstance();
        const response = await axiosInstance(config).catch(err=>{
            //console.log(err.response.data);
            let message = 'Something went Wrong!';
            if(err?.response?.data?.error_description){
                message = err.response.data.error_description;
            }
            console.log(message);
            setState(prevState=>({
                ...prevState,
                errorShow : true
            }));
        });
        if(response){
            const status = await handleAccessToken(response.data.access_token);
            if(!status.check){
                setState(prevState=>({
                    ...prevState,
                    errorShow : true
                }));
            }else{
                const userId = status.user_id;
                const planId = status.plan_id;
                stopLoader();
                setCookie('token', response.data.access_token , { path: '/' });
                dispatch(LoginSuccess(userId,planId));
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

    const signInFields = [
        {
            id : "email",
            name : "Email",
            component : <FaEnvelope/>,
            type : "email",
            value : state.email,
            onChange : handleChange,
        },
        {
            id : "password",
            name : "Password",
            component : <FaUnlock/>,
            type : "password",
            value : state.password,
            onChange : handleChange,
        }
    ]


    return (
        <div className={styles.sign_in_form}>
        <h1 className={styles.title_name}><strong>Sign In</strong></h1>
        {state.errorShow? errorAdd() : ""}
        <form onSubmit={handleSignIn}>
          {signInFields.map((field,index) => (
              <FormGroup
                key ={index}
                fieldData={field} 
              />
          ))}
        <button className={styles.btn} type="submit" >{ state.loader? <Spinner/> : <strong>Sign In</strong>}</button>
        </form>
        <p className={`${styles.sign_up_p} ${styles.para}`}>Don't have an account? <span onClick={()=>{setActive(1)}} className={`${styles.sign_up} ${styles.link}`} ><strong>Sign Up</strong></span> </p>
        <div className={`${styles.link} ${styles.forgot_password}`}>Forgot Password?</div>
      </div>
    )
}

export default Login; 
