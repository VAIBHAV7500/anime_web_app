import React from 'react';
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
import {useSelector} from 'react-redux';
import { useCookies } from 'react-cookie';
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
      return true;
  }
  return false;
}

const isLogin = (loginStatus,token)=>{
  let status = false;
  if((token && handleAccessToken(token)) || loginStatus){
    status = true;
  }
  if(status){
    // have to check the ip of the user
  }
  return status;
}

const App = ()=>{
  const loginStatus = useSelector(state=>state.login);
  const [cookies] = useCookies(['loginCookie']);
  return (
    <div className="App">
      {isLogin(loginStatus,cookies['loginCookie'])? 
      <Router>
        <Switch>
          <Route exact path="/" component={showRoom}/>
          <Route path="/show/:id" component={show}></Route>
          <Route path="/player" component={player} props="{name: 'Helllo'}"></Route>
          <Redirect to={showRoom}></Redirect>
        </Switch>
      </Router>
      :
      <Router>
        <Switch>
          <Route exact path="/signup" component={SignUp}></Route>
          <Route exact path="/" component={SignIn}></Route>
          <Redirect to={SignIn}></Redirect>
        </Switch>
      </Router>
      }
    </div>
  );
}

export default App;
