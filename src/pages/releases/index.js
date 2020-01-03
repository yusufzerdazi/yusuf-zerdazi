
import React from 'react';
import Tile from '../../components/tile';
import styles from './styles.module.css';
import { Element } from 'react-scroll'
import tense from '../../assets/tense.svg';
import everydays from '../../assets/everydays.svg';
import underworld from '../../assets/underworld.jpg';
import soundcloud from '../../assets/soundcloud.svg';
import instagram from '../../assets/instagram.png';

function Releases(props) {
    return (
      <Element id='releases' name='releases'>
      <div id="releases" className="App" style={{ display: props.hidden ? 'none' : 'block'}}>
        <div className={styles.title}>
          <h1>Projects</h1>
        </div>
        <Tile backgroundImage={tense} objectFit="contain" customStyles={{backgroundImage: 'linear-gradient(to right, black 50%, white 50%)'}}>
          <h2>Tense</h2>
          <div className="video-container-50">
            <div className="video-container">
              <iframe width="560" height="315" src="https://www.youtube.com/embed/hjUWI69qUGc" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
          </div>
          <div className="video-container-50">
            <div className="video-container">
              <iframe width="560" height="315" src="https://www.youtube.com/embed/Q1gFRXi9hxw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
          </div>
          <a href="https://soundcloud.com/yusufzerdazi/sets/tense"><h4><img height="20px" className={styles.sourceLink} src={soundcloud}></img></h4></a>
        </Tile>
        <Tile backgroundImage={underworld} foregroundImage={everydays} objectFit="cover">
          <h2>Everydays</h2>
          <p style={{color:'white'}}>Inspired by Beeple's <a href="http://beeple-crap.com/everydays.php">Everydays</a> project, I plan to
            complete some piece of work — an image, a sound, a video, or some combination of these — every day. The aim of this project is 
            to get better at certain skills, and to make myself practice regularly. Of course, sometimes life will get in the way and I 
            will miss days, although I will try to catch up on the days I miss.</p>
          <a href="https://instagram.com/everyda.ys"><h4><img height="30px" className={styles.sourceLink} src={instagram}></img></h4></a>
        </Tile>
      </div>
      </Element>
    );
}

export default Releases;