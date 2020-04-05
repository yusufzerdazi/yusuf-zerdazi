import React from 'react';
import Releases from './pages/releases';
import Values from './pages/values';
import Header from './components/header';
import Footer from './components/footer'
import './App.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { Link, DirectLink, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import Projects from './pages/projects';
import background from './assets/background.mp4';

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
        <video autoPlay muted loop id="myVideo">
          <source src={background} type="video/mp4" />
        </video>
        <Header/>
        <Releases/>
        <Projects/>
        <Values/>
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
