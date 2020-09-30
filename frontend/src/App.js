import React from 'react';
import './App.css';
import Header from './components/header';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link
} from 'react-router-dom';
import player from './components/player/player';
import showRoom from './components/showRoom/showRoom';
import show from './components/show/show';

require('dotenv').config();

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={showRoom}/>
          <Route path="/show/:id" component={show}></Route>
          <Route path="/player" component={player} props="{name: 'Helllo'}"></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
