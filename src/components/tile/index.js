import React from 'react';
import styles from './styles.module.css';
import Collapsible from 'react-collapsible';

class Tile extends React.Component {
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
      console.log(this.props.customStyles)
    return (
      <div>
        <span className={styles.tileContainer + ' ' + (this.props.small ? styles.small : '')} style={this.props.customStyles} onClick={this.toggleExpanded}>
          <img className={styles.tileBackgroundImage + ' ' + (this.props.small ? styles.small : '')} style={{objectFit:this.props.objectFit}} src={this.props.backgroundImage} alt={this.props.imageAlt}></img>
          {this.props.foregroundImage ? 
          <div className={styles.tileForegroundImageContainer}>
          <img className={styles.tileForegroundImage} src={this.props.foregroundImage} alt={this.props.imageAlt}></img>
          </div>
          : null}
        </span>
        <Collapsible easing="ease-in-out" open={this.state.expanded}>
          <div className={styles.tileDescription}>
            {this.props.children}
          </div>
        </Collapsible>
      </div>
    )
  }
}

export default Tile;