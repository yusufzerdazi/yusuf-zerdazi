
import React from 'react';
import styles from './styles.module.css';

function Footer() {
    return (
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <a className={styles.footerLink} href="https://linkedin.com/in/yusufzerdazi" title="LinkedIn">
            <i className="fab fa-linkedin fa-2x fa-fw" color="white"/>
          </a>
          <a className={styles.footerLink} href="https://github.com/yusufzerdazi" title="GitHub">
            <i className="fab fa-github fa-2x fa-fw" color="white"/>
          </a>
          <a className={styles.footerLink} href="https://www.youtube.com/channel/UCTZsbno68JdiCQbL_6sjdzg" title="YouTube">
            <i className="fab fa-youtube fa-2x fa-fw" color="white"/>
          </a>
          <a className={styles.footerLink} href="https://yusufzerdazi.bandcamp.com" title="Bandcamp">
            <i className="fab fa-bandcamp fa-2x fa-fw" color="white"/>
          </a>
          <a className={styles.footerLink} href="https://soundcloud.com/yusufzerdazi" title="Soundcloud">
            <i className="fab fa-soundcloud fa-2x fa-fw" color="white"/>
          </a>
        </div>
      </footer>
    );
}

export default Footer;