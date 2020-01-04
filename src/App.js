import React from 'react';
import Releases from './pages/releases';
import Home from './components/home';
import Values from './pages/values';
import Header from './components/header';
import Footer from './components/footer'
import './App.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { Link, DirectLink, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import { isMobile } from 'react-device-detect';
import Projects from './pages/projects';

library.add(fab);

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {home:true};
    this.hideHome = this.hideHome.bind(this);
    this.showHome = this.showHome.bind(this);
  }

  render(){
    return (
      <div className="appContainer">
        {this.state.home && !isMobile ? <Home enterSite={this.hideHome}/> : ''}
        <Header exitSite={this.showHome}/>
        <Releases hidden={this.state.home && !isMobile}/>
        <Projects hidden={this.state.home && !isMobile}/>
        <Values hidden={this.state.home && !isMobile}/>
        <Footer/>
      </div>
    );
  }

  hideHome(page){
    this.setState({home:false});
    setTimeout(function() { scroller.scrollTo(page, {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart'
    })}, 1);
  }

  showHome(){
    this.setState({home:true});
  }
}

export default App;
