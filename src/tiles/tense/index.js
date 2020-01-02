import React from 'react';
import styles from './styles.module.css';
import tense from '../../assets/tense.svg';
import soundcloud from '../../assets/soundcloud.svg';

class Tense extends React.Component {
  constructor(props){
    super(props);
    this.state = {expanded:false};
    this.toggleExpanded = this.toggleExpanded.bind(this);
  }

  toggleExpanded(){
    if(this.state.expanded) {
      this.setState({expanded:false});
    }
    else {
      this.setState({expanded: true});
    }
  }

  render() {
    return (
      <div>
        <span className={styles.tenseContainer} onClick={this.toggleExpanded}>
          <img className={styles.tenseImage} src={tense} alt="Tense"></img>
        </span>
        <span className={styles.tenseDescription + ' ' + (this.state.expanded ? styles.expanded : '')}>
          <h2>Tense</h2>
          <div className="video-container-50">
            <div className="video-container">
              <iframe width="560" height="315" src="https://www.youtube.com/embed/hjUWI69qUGc" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
          </div>
          <div className="video-container-50">
            <div className="video-container">
              <iframe width="560" height="315" src="https://www.youtube.com/embed/Q1gFRXi9hxw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
          </div>
          <a href="https://soundcloud.com/yusufzerdazi/sets/tense"><h4><img src={soundcloud}></img></h4></a>
        </span>
      </div>
    )
  }
}

export default Tense;