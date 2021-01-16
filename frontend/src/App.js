import React,{useEffect} from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import player from './components/player/player';
import showRoom from './components/showRoom/showRoom';
import show from './components/show/show';
import Pricing from './components/pricing';
import Terms from './components/footer/Terms';
import { useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { LoginFailure, LoginSuccess } from './redux/Auth/authAction';
import axios from './utils/axios';
import Profile from './components/profile';
import AdBlocked from './components/adBlocked';
import Welcome from './components/welcome';
import GeoBlock from './components/geoblock';
import ScrollTop from './components/ScrollToTop';
require('dotenv').config();

const handleAccessToken = async (token)=>{
  var config = {
      method: 'post',
      url: process.env.REACT_APP_BASE_URL + 'restrictedArea/enter',
      headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer '+ token
      }
  };
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

const check = (token,dispatch,removeCookie)=>{
  if(token){
    return handleAccessToken(token).then((result)=>{
      if(result.check){
        dispatch(LoginSuccess(result.user_id,result.plan_id));
      }else{
        removeCookie('token', { path: '/' });
        dispatch(LoginFailure());
      }
    }).catch(e=>{
      removeCookie('token', { path: '/' });
      dispatch(LoginFailure());
      console.log(e);
    }); 
  }else{
    removeCookie('token', { path: '/' });
    dispatch(LoginFailure());
  }
}

const App = () => {
  const tokenName = 'token';
  const [cookies,,removeCookie] = useCookies([tokenName]);
  const dispatch = useDispatch();
  let loginStatus = useSelector(state=>state.login) || check(cookies[tokenName],dispatch,removeCookie);
  useEffect(() => {
    const token = cookies[tokenName];
    if(token){
      loginStatus = check(cookies[tokenName],dispatch,removeCookie);
    }
  },[cookies[tokenName]]);
  return (
    <div className="App">
      {loginStatus ? 
      <Router>
        <ScrollTop/>
        <Switch>
          <Route exact path="/" component={showRoom}/>
          <Route path="/show/:id" component={show}></Route>
          <Route path="/player/:id" component={player}></Route>
          <Route path="/user" component={Profile}></Route>
          <Route path="/pricing" component={Pricing}></Route>
          <Route path="/terms-and-conditions" component={Terms}></Route>
          <Route path="/ad-blocked" component={AdBlocked}></Route>
          <Route path="/geo-block" component={GeoBlock}></Route>
          <Redirect to='/'></Redirect>
        </Switch>
      </Router>
      :
      <Router>
        <Switch>
          <Route exact path="/welcome" component={Welcome}></Route>
          <Route path="/terms-and-conditions" component={Terms}></Route>
          <Redirect to='/welcome'></Redirect>
        </Switch>
      </Router>
      }
    </div>
  );
}

export default App;
