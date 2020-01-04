
import React from 'react';
import Tile from '../../components/tile';
import styles from './styles.module.css';
import { Element } from 'react-scroll'
import tense from '../../assets/tense.svg';
import everydays from '../../assets/everydays.svg';
import mondays from '../../assets/the-mondays.svg';
import soundcloud from '../../assets/soundcloud.svg';
import mondaysbg from '../../assets/themondaysbg.jpg';

function Releases(props) {
    return (
      <Element id='releases' name='releases'>
      <div className="App" style={{ display: props.hidden ? 'none' : 'block'}}>
        <div className={styles.title}>
          <h1>Releases</h1>
        </div>
        <Tile backgroundImage={tense} objectFit="contain" customStyles={{backgroundImage: 'linear-gradient(to right, black 50%, white 50%)'}}>
          <h2>Tense</h2>
          <iframe width="100%" height="280" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/909691150&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>
        </Tile>
        <Tile backgroundImage={mondaysbg} foregroundImage={mondays} objectFit="cover">
          <h2>The Mondays - Psyrex Session</h2>
          <p style={{color:'white'}}>The Mondays were a rock and roll group from Bingham, Nottinghamshire. They performed covers of songs by artists such as Oasis, 
          The Libertines, The Rolling Stones, The Eagles, Led Zeppelin, Lynyrd Skynrd and many more, as well as writing their own material. They were composed 
          of Andrew Hemmings, Devon Adams, Yusuf Zerdazi, Alex Rickells and Scott Rice.</p>
          <iframe width="100%" height="310" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/143903857&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>
        </Tile>
      </div>
      </Element>
    );
}

export default Releases;