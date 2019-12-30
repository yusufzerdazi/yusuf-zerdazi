
import React from 'react';
import Tense from '../../tiles/tense';
import Everydays from '../../tiles/everydays';
import styles from './styles.module.css';
import { Element } from 'react-scroll'

function Releases(props) {
    return (
      <Element id='releases' name='releases'>
      <div id="releases" className="App" style={{ display: props.hidden ? 'none' : 'block'}}>
        <div className={styles.title}>
          <h1>Projects</h1>
        </div>
        <Tense/>
        <Everydays/>
      </div>
      </Element>
    );
}

export default Releases;