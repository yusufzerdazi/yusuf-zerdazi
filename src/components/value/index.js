import React from 'react';
import ReactDOM from 'react-dom'
import styles from './styles.module.css';
import Collapsible from 'react-collapsible';

class Value extends React.Component {
    constructor(props) {
      super(props);
      this.state = {overlay: false};
      this.displayValue = this.displayValue.bind(this);
      this.hideValue = this.hideValue.bind(this);
      this.toggleValue = this.toggleValue.bind(this);
      this.component = React.createRef(this.component);
    }

    render() {
      return (
      <div className={styles.value_container}>
        <img onClick={this.toggleValue} src={this.props.img} className={styles.value_image} />
        <h2>{this.props.title}</h2>

        <Collapsible easing="ease-in-out" open={this.state.overlay}>
        <div className={styles.valueTextContainer} onClick={this.hideValue}>
          <div className={styles.valueText}>
            <p style={{color:'white'}}>
              {this.props.children}
            </p>
          </div>
        </div> 
        </Collapsible>
      </div>
    )}

    displayValue(){
      this.setState({overlay: true});
    }

    hideValue(){
      this.setState({overlay: false});
    }

    toggleValue(){
      if(this.state.overlay) {
        this.hideValue();
      } else {
        this.displayValue();
      }
    }
}

export default Value;