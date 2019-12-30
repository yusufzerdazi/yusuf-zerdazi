import React from 'react';
import styles from './styles.module.css';
import temptation from '../../assets/underworld.jpg';
import everydays from '../../assets/everydays.svg';

function Everydays() {
    return (
        <a className={styles.everydaysLink} href="https://instagram.com/everyda.ys">
          <span className={styles.everydaysContainer}>
            <img className={styles.everydaysImage} src={temptation} alt="Everydays"></img>
            <img className={styles.everydaysLogoImage} src={everydays} alt="Everydays"></img>
          </span>
        </a>
        
    )
}

export default Everydays;