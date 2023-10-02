
import React from 'react';
import styles from './styles.module.css';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { reactPlugin, appInsights } from '../../AppInsights';
import { Link } from 'react-router-dom';

function Footer() {
    return (
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <Link className={styles.footerLink} to="/cv" title="CV">
            <i className="fa fa-file-alt fa-2x" color="white"/>
          </Link>
          <a className={styles.footerLink} href="https://linkedin.com/in/yusufzerdazi" title="LinkedIn">
            <i className="fab fa-linkedin fa-2x" color="white"/>
          </a>
          <a className={styles.footerLink} href="https://github.com/yusufzerdazi" title="GitHub">
            <i className="fab fa-github fa-2x" color="white"/>
          </a>
          <a className={styles.footerLink} href="https://www.youtube.com/channel/UCTZsbno68JdiCQbL_6sjdzg" title="YouTube">
            <i className="fab fa-youtube fa-2x" color="white"/>
          </a>
          <a className={styles.footerLink} href="https://yusufzerdazi.bandcamp.com" title="Bandcamp">
            <i className="fab fa-bandcamp fa-2x" color="white"/>
          </a>
          <a className={styles.footerLink} href="https://soundcloud.com/yusufzerdazi" title="Soundcloud">
            <i className="fab fa-soundcloud fa-2x" color="white"/>
          </a>
        </div>
      </footer>
    );
}

export default withAITracking(reactPlugin, Footer);