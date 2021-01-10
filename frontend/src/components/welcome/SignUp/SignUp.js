import React,{useEffect,useState} from 'react'
import styles from './signup.module.css'
import styles2  from '../SignIn/SignIn.module.css'
import FormGroup from '../Form-Group/FormGroup'
import { FaUnlock, FaMobile, FaEnvelope, FaUser} from 'react-icons/fa';
import axios from '../../../utils/axios';
import qs from 'qs';
import Spinner from '../Spinner/index'
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

export default function SignUp(props) {
    const [,setActive] = props.activeArray;
    const [email,setEmail] = props.emailDetail;
    const passwordRegex = "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[@#!$%^&*~]).{8,}$"
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
            'password': state.regPassword,
            'email': (state.regEmail).trim(),
            'plan_id' : 0,
            //'mobile' : (state.regMobileNo).trim().substr(-10),
            'name' : (state.name).trim()
        });
        var config = {
            method: 'post',
            url: appbaseurl + 'auth/register',
            headers: { 
            'Content-Type': 'application/x-www-form-urlencoded'
            },
            data : data
        };
        const axiosInstance = axios.createInstance();
        const response = await axiosInstance(config)
        .catch(function (error) {
            console.log(error.response);
            const data = error.response.data;
            let message = 'Something went wrong!';
            if(data.details){
                message = data.details[0].message;
            }else if(data.message){
                message = data.message;
            }
            toast.error(message);
        }); 
        stopLoader();
        if(response){
            if(response.data.message === "Registration Successfull"){
                setEmail(state.regEmail);
                setActive(2);
            }else{
                setState(prevState =>({
                    ...prevState,
                    error : response.data.message,
                    showerror : true
                }));
            }
        }
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
        // {
        //     id : "regMobileNo",
        //     name : "Mobile No.",
        //     component : <FaMobile/>,
        //     type : "tel",
        //     value : state.regMobileNo,
        //     onChange : handleChange,
        //     pattern : "^(\+\d{1,3}[- ]?)?\d{10}$",
        // }
    ]

    return (
        <div className={styles.sign_up_form}>
            <ToastContainer
            position="top-right"
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            />
            <h1 className={styles2.title_name}><strong>Sign Up</strong></h1>
            {state.showerror? errorAdd() : ""}
            <form onSubmit={handleSignUp}>
                {signUpFields.map((field,index) => (
                    <FormGroup
                        key={index}
                        fieldData={field} 
                    />
                ))}
                <p className={styles.check_para}><input type="checkbox" required /><span className={styles.checkbox}>I agree to the <Link to="/terms-and-conditions" className={styles.tandc}>terms and condition and privacy policy</Link> </span></p>
                <button className={styles2.btn} type="submit">{ state.loader? <Spinner/> : <strong>Sign Up</strong>}</button>
                <p className={`${styles.sign_in_p} ${styles2.para}`}>Already have an account? <span onClick={()=>{setActive(0)}} className={`${styles.sign_in} ${styles2.link}`} ><strong>Sign In</strong></span></p>
            </form>
        </div>
    )
}


