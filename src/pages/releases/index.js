
import React from 'react';
import styles from './styles.module.css';
import { Element } from 'react-scroll'
import tense from '../../assets/tense.svg';
import mondaysbg from '../../assets/mondays.jpg';
import vibe from '../../assets/Vibe.jpg';
import Tiles from '../../components/tiles';

function Releases(props) {
    return (
      <Element id='releases' name='releases'>
      <div className="App" style={{ display: props.hidden ? 'none' : 'block'}}>
        <div className="container">
          <div className={styles.title}>
            <h1>Releases</h1>
          </div>
          <Tiles>
            <div title="Vibe" image={vibe}>
              <iframe width="100%" height="166" scrolling="no" frameBorder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/762911440&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>
            </div>
            <div title="Tense" image={tense}>
              <iframe className="row-full" width="100%" height="280" scrolling="no" frameBorder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/909691150&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>
            </div>
            <div title="The Mondays" image={mondaysbg}>
              <p className="row-full">The Mondays were a rock and roll group from Bingham, Nottinghamshire. They performed covers of songs by artists such as Oasis, 
              The Libertines, The Rolling Stones, The Eagles, Led Zeppelin, Lynyrd Skynrd and many more, as well as writing their own material. They were composed 
              of Andrew Hemmings, Devon Adams, Yusuf Zerdazi, Alex Rickells and Scott Rice.</p>
              <iframe width="100%" height="310" scrolling="no" frameBorder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/143903857&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>
            </div>
          </Tiles>
        </div>
      </div>
      </Element>
    );
}

export default Releases;