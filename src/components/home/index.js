import React from 'react';
import yusuf from '../../assets/yusuf.svg';
import styles from './styles.module.css';

function Home(props){
    return (
        <div className={styles.container}>
          <img className={styles.logo + ' ' + styles.grow} src={yusuf} onClick={props.enterSite}></img>
          <span className={styles.values}>
            <span className={styles.iconContainer}>
              <img onClick={() => props.enterSite('releases')} className={styles.iconLogo + ' ' + styles.grow}  src="values/presence.svg"></img>
              <h3 className={styles.pageTitle}>Releases</h3>
            </span>
            <span className={styles.iconContainer}>
              <img onClick={() => props.enterSite('projects')} className={styles.iconLogo + ' ' + styles.grow} src="values/persistence.svg"></img>
              <h3 className={styles.pageTitle}>Projects</h3>
            </span>
            <span className={styles.iconContainer}>
              <img onClick={() => props.enterSite('values')} className={styles.iconLogo + ' ' + styles.grow} src="values/balance.svg"></img>
              <h3 className={styles.pageTitle}>Values</h3>
            </span>
            <span className={styles.iconContainer}>
              <img className={styles.iconLogo} src="values/humanity.svg"></img>
              <h3 className={styles.pageTitle}></h3>
            </span>
            <span className={styles.iconContainer}>
              <img className={styles.iconLogo} src="values/skepticism.svg"></img>
              <h3 className={styles.pageTitle}></h3>
            </span>
            <span className={styles.iconContainer}>
              <img className={styles.iconLogo} src="values/realism.svg"></img>
              <h3 className={styles.pageTitle}></h3>
            </span>
            <span className={styles.iconContainer}>
              <img className={styles.iconLogo} src="values/explore.svg"></img>
              <h3 className={styles.pageTitle}></h3>
            </span>
            <span className={styles.iconContainer}>
              <img className={styles.iconLogo} src="values/create.svg"></img>
              <h3 className={styles.pageTitle}></h3>
            </span>
            <span className={styles.iconContainer}>
              <img className={styles.iconLogo} src="values/bond.svg"></img>
              <h3 className={styles.pageTitle}></h3>
            </span>
          </span>
        </div>
    )
}

export default Home;