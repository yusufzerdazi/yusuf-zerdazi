import React from 'react';
import Releases from './pages/releases';
import Values from './pages/values';
import Header from './components/header';
import Footer from './components/footer'
import './App.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/pro-solid-svg-icons'
import { Link, DirectLink, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import Projects from './pages/projects';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";


library.add(fab);
library.add(fas);

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {home:true};
    this.hideHome = this.hideHome.bind(this);
    this.showHome = this.showHome.bind(this);
  }

  render(){
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <div className="appContainer">
          <div className="videoContainer">
            <video autoPlay muted loop id="myVideo">
              <source src="background.mp4" type="video/mp4" />
            </video>
          </div>
          <Header/>
          <Releases/>
          <Projects/>
          <Values/>
          <Footer/>
        </div>
      </ThemeProvider>
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
