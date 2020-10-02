import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import player from './components/player/player';
import showRoom from './components/showRoom/showRoom';
import show from './components/show/show';
import SignIn from './components/welcome/SignIn/SignIn'
import SignUp from './components/welcome/SignUp/SignUp'
require('dotenv').config();

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={showRoom}/>
          <Route path="/show/:id" component={show}></Route>
          <Route path="/player" component={player} props="{name: 'Helllo'}"></Route>
          <Route path="/signup" component={SignUp}></Route>
          <Route path="/signin" component={SignIn}></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
