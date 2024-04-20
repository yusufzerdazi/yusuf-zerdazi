import React from 'react';

import './App.css';

import Home from './pages/home';
import Vibe from './pages/vibe';
import Tense from './pages/tense';
import Solace from './pages/solace';
import Tickets from './pages/tickets';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { reactPlugin, appInsights } from './AppInsights';

import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

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
          <Route path={["/solace", "/actualise"]}>
            <Solace />
          </Route>
          <Route path="/tickets">
            <Tickets />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default withAITracking(reactPlugin, App);
