import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link
} from 'react-router-dom';
import player from './components/player';
import showRoom from './components/showRoom';
require('dotenv').config();

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={showRoom}/>
          <Route path="/player" component={player} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
