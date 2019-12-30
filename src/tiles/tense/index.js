import React from 'react';
import styles from './styles.module.css';
import tense from '../../assets/tense.svg';

function Tense() {
    return (
        <a className={styles.tenseLink} href="https://lnkfi.re/tense">
          <span className={styles.tenseContainer}>
            <img className={styles.tenseImage} src={tense} alt="Tense"></img>
          </span>
        </a>
        
    )
}

export default Tense;