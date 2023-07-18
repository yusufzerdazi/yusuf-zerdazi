
import React from 'react';
import logo from '../../assets/yusuf.svg';
import logoDark from '../../assets/yusuf_dark.svg';
import styles from './styles.module.css';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { reactPlugin, appInsights } from '../../AppInsights';

function Header(props) {
    return (
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <img onClick={props.exitSite} className={styles.headerImage + ' ' + styles.grow} src={props.dark ? logoDark : logo} alt="Header"></img>
        </div>
      </header>
    );
}

export default withAITracking(reactPlugin, Header);