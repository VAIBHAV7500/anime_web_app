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
import SignIn from './components/welcome/SignIn/SignIn'
import SignUp from './components/welcome/SignUp/SignUp'
import { useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { LoginFailure, LoginSuccess } from './redux/Auth/authAction';
import axios from './utils/axios';
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
  var response = await axios(config);
  if(response.data.message === "Successfully Entered"){
      return {
          check : true,
          user_id : response.data.user_id,
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
        dispatch(LoginSuccess(result.user_id));
        return true;
      }else{
        removeCookie('token', { path: '/' });
        dispatch(LoginFailure());
        return false;
      }
    }).catch(e=>{
      removeCookie('token', { path: '/' });
      dispatch(LoginFailure());
      console.log(e);
    }); 
  }else{
    removeCookie('token', { path: '/' });
    dispatch(LoginFailure());
    return false;
  }
}

const App = ()=>{
  const [cookies,,removeCookie] = useCookies(['token']);
  const dispatch = useDispatch();
  const loginStatus = useSelector(state=>state.login) || check(cookies['token'],dispatch,removeCookie);
  useEffect(() => {
    check(cookies['token'],dispatch,removeCookie);
  },[cookies['token']]);
  return (
    <div className="App">
      {loginStatus ? 
      <Router>
        <Switch>
          <Route exact path="/" component={showRoom}/>
          <Route path="/show/:id" component={show}></Route>
          <Route path="/player" component={player} props="{name: 'Helllo'}"></Route>
          <Redirect to='/'></Redirect>
        </Switch>
      </Router>
      :
      <Router>
        <Switch>
          <Route exact path="/signin" component={SignIn}></Route>
          <Route exact path="/signup" component={SignUp}></Route>
          <Redirect to='/signin'></Redirect>
        </Switch>
      </Router>
      }
    </div>
  );
}

export default App;
