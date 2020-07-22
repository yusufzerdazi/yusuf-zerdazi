import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import ScopedCssBaseline from "@material-ui/core/CssBaseline";
import StarfieldAnimation from 'react-starfield-animation'
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
    overrides: {
      MuiCssBaseline: {
        '@global': {
          body: {
            backgroundColor: 'black',
          },
        },
      },
    },
  });

function Home(props){
    return (<ThemeProvider theme={darkTheme}>
        <div className="appContainer">
        <div className="videoContainer">
          <StarfieldAnimation
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%'
            }}
          />
        </div>
        <Header/>
        <div className={styles.blmContainer}>
          <a href="https://blacklivesmatters.carrd.co">
            <img className={styles.blm} src={blm}></img>
          </a>
        </div>
        <Releases/>
        <ScopedCssBaseline>
          <Projects/>
        </ScopedCssBaseline>
        <Values/>
        <Footer/>
        </div>
    </ThemeProvider>);
}

export default Home;