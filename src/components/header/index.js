
import React from 'react';
import logo from '../../assets/yusuf.svg';
import styles from './styles.module.css';

function Header(props) {
    return (
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <img onClick={props.exitSite} className={styles.headerImage + ' ' + styles.grow} src={logo} alt="Header"></img>
        </div>
      </header>
    );
}

export default Header;