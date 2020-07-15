import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";
import styles from './styles.module.css';

import Releases from '../releases';
import Values from '../values';
import Header from '../../components/header';
import Footer from '../../components/footer'
import Projects from '../projects';
import blm from '../../assets/blm.png';

const darkTheme = createMuiTheme({
    palette: {
      type: 'dark',
    },
  });

function Home(props){
    return (<ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <div className="appContainer">
        <div className="videoContainer">
            <video autoPlay muted loop id="myVideo">
            <source src="background.mp4" type="video/mp4" />
            </video>
        </div>
        <Header/>
        <div className={styles.blmContainer}>
          <a href="https://blacklivesmatters.carrd.co">
            <img className={styles.blm} src={blm}></img>
          </a>
        </div>
        <Releases/>
        <Projects/>
        <Values/>
        <Footer/>
        </div>
    </ThemeProvider>);
}

export default Home;