import React,{useEffect,useState} from 'react'
import styles from './signup.module.css'
import styles2  from '../SignIn/SignIn.module.css'
import FormGroup from '../Form-Group/FormGroup'
import { FaUnlock, FaMobile, FaEnvelope, FaUser} from 'react-icons/fa';
import axios from '../../../utils/axios';
import qs from 'qs';
import sha256 from 'crypto-js/sha256';
import Spinner from '../Spinner/index'
import { Link } from 'react-router-dom';

export default function SignUp() {
    useEffect(() => {
        document.body.classList.add(styles2.body);
        return () => {
            document.body.classList.remove(styles2.body);
        }
    }, []);
    const passwordRegex = "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[@#!$%^&*~]).{8,}$"
    console.log(new RegExp(passwordRegex).test("Hello@123") ? "match" : "not match");
    const appbaseurl = process.env.REACT_APP_BASE_URL;
    const [state,setState] = useState({
        loader : false,
        regEmail:"",
        regPassword:"",
        regConfirmPassword:"",
        regMobileNo:"",
        error:"",
        name:"",
        showerror: false
    });

    const handleChange = (e)=>{
        const {id , value} = e.target
        setState(prevState => ({
            ...prevState,
            [id] : value
        }));
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

    const errorAdd = ()=>{
        return (
            <div className={styles2.error}>
                <strong>{state.error}</strong>
            </div>
        )
    }

    const errorHandler = ()=>{
        if(state.regPassword!==state.regConfirmPassword){
            setState(prevState=>({
                ...prevState,
                error : "Both password must be same",
                showerror : true
            }));
            return false;
        }
        return true;
    }

    const handleSignUp = async (e)=>{
        e.preventDefault();
        startLoader();
        const statusOfError = await errorHandler();
        if(!statusOfError){
            stopLoader();
            return;
        }
        var data = qs.stringify({
            'password': sha256(state.regPassword + process.env.REACT_PRIVATE_KEY).toString(),
            'email': (state.regEmail).trim(),
            'plan_id' : 0,
            'mobile' : (state.regMobileNo).trim().substr(-10),
        });
        var config = {
            method: 'post',
            url: appbaseurl + 'auth/register',
            headers: { 
            'Content-Type': 'application/x-www-form-urlencoded'
            },
            data : data
        };
        axios(config)
        .then(function (response) {
            stopLoader();
            if(response.data.message === "Registration Successfull"){
                window.open("/signin","_self");
            }else{
                setState(prevState =>({
                    ...prevState,
                    error : response.data.message,
                    showerror : true
                }));
            }
        })
        .catch(function (error) {
            console.log(error);
        }); 
    }
    
    const signUpFields = [
        {
            id : "name",
            name : "Name",
            component : <FaUser/>,
            type : "text",
            value : state.name,
            onChange : handleChange,
        },
        {
            id : "regEmail",
            name : "Email",
            component : <FaEnvelope/>,
            type : "email",
            value : state.regEmail,
            onChange : handleChange,
        },
        {
            id : "regPassword",
            name : "Password",
            component : <FaUnlock/>,
            type : "password",
            value : state.regPassword,
            onChange : handleChange,
            pattern : passwordRegex,
            title : "must be 8 letters [A-Z,a-z,0-9,special characters]"
        },
        {
            id : "regConfirmPassword",
            name : "Confirm Password",
            component : <FaUnlock/>,
            type : "password",
            value : state.regConfirmPassword,
            onChange : handleChange,
            pattern : passwordRegex,
            title : "must be 8 letters [A-Z,a-z,0-9,special characters]"
        },
        {
            id : "regMobileNo",
            name : "Mobile No.",
            component : <FaMobile/>,
            type : "tel",
            value : state.regMobileNo,
            onChange : handleChange,
            pattern : "^(\+\d{1,3}[- ]?)?\d{10}$",
        }
    ]

    return (
        <div className={styles.sign_up_form}>
            <h1 className={styles2.title_name}><strong>Sign Up</strong></h1>
            {state.showerror? errorAdd() : ""}
            <form onSubmit={handleSignUp}>
                {signUpFields.map((field,index) => (
                    <FormGroup
                        key={index}
                        fieldData={field} 
                    />
                ))}
                <button className={styles2.btn} type="submit">{ state.loader? <Spinner/> : <strong>Sign Up</strong>}</button>
                <p className={`${styles.sign_in_p} ${styles2.para}`}>Already have an account? <Link  className={`${styles.sign_in} ${styles2.link}`} to="/signin"><strong>Sign In</strong></Link></p>
            </form>
        </div>
    )
}


