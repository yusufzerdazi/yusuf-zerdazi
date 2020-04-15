
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './styles.module.css';

function Footer() {
    return (
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <a className={styles.footerLink} href="https://linkedin.com/in/yusufzerdazi" title="LinkedIn">
            <FontAwesomeIcon icon={['fab','linkedin']} size="2x" fixedWidth color="white"></FontAwesomeIcon>
          </a>
          <a className={styles.footerLink} href="https://github.com/yusufzerdazi" title="GitHub">
            <FontAwesomeIcon icon={['fab','github']} size="2x" fixedWidth color="white"></FontAwesomeIcon>
          </a>
          <a className={styles.footerLink} href="https://www.youtube.com/channel/UCTZsbno68JdiCQbL_6sjdzg" title="YouTube">
            <FontAwesomeIcon icon={['fab','youtube']} size="2x" fixedWidth color="white"></FontAwesomeIcon>
          </a>
          <a className={styles.footerLink} href="https://yusufzerdazi.bandcamp.com" title="Bandcamp">
            <FontAwesomeIcon icon={['fab','bandcamp']} size="2x" fixedWidth color="white"></FontAwesomeIcon>
          </a>
          <a className={styles.footerLink} href="https://soundcloud.com/yusufzerdazi" title="Soundcloud">
            <FontAwesomeIcon icon={['fab','soundcloud']} size="2x" fixedWidth color="white"></FontAwesomeIcon>
          </a>
        </div>
      </footer>
    );
}

export default Footer;