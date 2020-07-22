import React from 'react';

import './App.css';

import Home from './pages/home';
import Vibe from './pages/vibe';
import Tense from './pages/tense';
import Actualise from './pages/actualise';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/pro-solid-svg-icons'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

library.add(fab);
library.add(fas);

class App extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return (
      <Router>
        <Switch>
          <Route path="/vibe">
            <Vibe />
          </Route>
          <Route path="/tense">
            <Tense />
          </Route>
          <Route path="/actualise">
            <Actualise />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
