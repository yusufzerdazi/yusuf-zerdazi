
import React from 'react';
import styles from './styles.module.css';
import Collapsible from 'react-collapsible';

class Tiles extends React.Component {
  constructor(props){
    super(props);
    this.expand = this.expand.bind(this);
    this.state = {tiles: this.props.children, expanded: null, bootstrapWidth: window.innerWidth < 768 ? 2 : 3 };
  }

  updateDimensions = () => {
    this.setState({ bootstrapWidth: window.innerWidth < 768 ? 2 : 3 });
  };

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  render() {
    const tiles = [];

    for (var i=0; i<this.props.children.length; i++) {
      tiles.push(
        <div key={i} onClick={this.expand.bind(this, i)} className="col-md-4 col-6">
          <div className={styles.tileContainer}>
            <img className={styles.tileImage} src={this.props.children[i].props.image}></img>
            {this.props.children[i].props.title ? <h2>{this.props.children[i].props.title}</h2> : null}
          </div>
        </div>
      );
    }

    if (this.state.expanded != null){
      const infoIndex = this.state.bootstrapWidth * (1 + Math.floor(this.state.expanded / this.state.bootstrapWidth));
      tiles.splice(infoIndex, 0,
        <div key={'info'} className="col-md-12">
          <Collapsible easing="ease-in-out" open={this.state.opened} >
            <div className={styles.textContainer}>
              {this.props.children[this.state.expanded].props.children}
            </div>
          </Collapsible>
        </div>
      );
    }

    return (
      <>
        <div class="row">
          {tiles}
        </div>
      </>
    );
  }

  expand(index, event){
    if(!this.state.transitioning){
      const alreadyOpened = this.state.opened;
      this.setState({ opened: false, transitioning: true })
      setTimeout(() => {
        this.setState({ expanded: this.state.expanded == index ? null : index, opened: false });
        setTimeout(() => this.setState({ opened: this.state.expanded != null, transitioning: false }), 10);
      }, alreadyOpened ? 420: 10);
    }
  }
}

export default Tiles;