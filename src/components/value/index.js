import React from 'react';
import styles from './styles.module.css';

class Value extends React.Component {
    constructor(props) {
      super(props);
      this.state = {overlay: false};
      this.displayValue = this.displayValue.bind(this);
      this.hideValue = this.hideValue.bind(this);
    }

    render() { return (
      <div className={styles.value_container}>
        <div className={styles.value_image_container}>
          <img onClick={this.displayValue} src={this.props.img} className={styles.value_image} />
        </div>
        <h2>{this.props.title}</h2>
    
        <div onClick={this.hideValue} className={styles.overlay} style={{display: this.state.overlay ? 'block' : 'none'}}>
          <div className={styles.overlay_text}>
            <h1>{this.props.title}</h1>
            <img src={this.props.img} className={styles.value_image_overlay} />
            <p>
              {this.props.children}
            </p>
          </div>
        </div> 
      </div>
    )}

    displayValue(){
      this.setState({overlay: true});
    }

    hideValue(){
      this.setState({overlay: false});
    }
}

export default Value;