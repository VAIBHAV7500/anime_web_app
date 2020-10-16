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
import {useDispatch} from 'react-redux';
import {LoginSuccess,LoginFailure} from './redux/Auth/authAction';
import axios from './utils/axios';
import qs from 'qs';
require('dotenv').config();


const getUserId = async (token)=>{
  var data = qs.stringify({
    'token': token 
   });
   var config = {
     method: 'post',
     url: process.env.REACT_APP_BASE_URL + 'api/accessToken/getID',
     headers: { 
       'Content-Type': 'application/x-www-form-urlencoded'
     },
     data : data
   };
  const response = await axios(config);
  return response.data.id;
}

const check = (token,dispatch)=>{
  if(token){
    getUserId(token).then((id)=>{
      dispatch(LoginSuccess(id));
    }); 
    return true;
  }else{
    return false;
  }
}

const App = ()=>{
  const [cookies] = useCookies(['token']);
  const dispatch = useDispatch();
  const loginStatus = useSelector(state=>state.login) || check(cookies['token'],dispatch);
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
          <Route exact path="/signup" component={SignUp}></Route>
          <Route exact path="/signin" component={SignIn}></Route>
          <Redirect to='/signin'></Redirect>
        </Switch>
      </Router>
      }
    </div>
  );
}

export default App;
