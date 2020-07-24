
import React from 'react';
import styles from './styles.module.css';
import Collapsible from 'react-collapsible';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
        <a href={this.props.children[i].props.link} className={this.props.children[i].props.large ? "col-12" : "col-md-4 col-6"}>
          <div key={i} onClick={this.expand.bind(this, i, this.props.children[i].props.link)}>
            <div className={styles.tileContainer + ' ' + (!this.props.children[i].props.large ? styles.notLarge : '')}>
              <div className={styles.imageContainer}>
                <img className={styles.tileImage + ' ' + (!this.props.children[i].props.large ? styles.notLarge : '')} src={this.props.children[i].props.image}></img>
                {this.props.children[i].props.tooltip ? <div className={styles.topright}>{this.props.children[i].props.tooltip}</div> : null}
                {this.props.children[i].props.link ? <div className={styles.topleft}>
                  <FontAwesomeIcon icon={['fas','external-link']} size="2x" fixedWidth color="white"></FontAwesomeIcon>
                </div> : null}
              </div>
              {this.props.children[i].props.title ? <h3>{this.props.children[i].props.title}</h3> : null}
            </div>
          </div>
        </a>
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
        <div className="row">
          {tiles}
        </div>
      </>
    );
  }

  expand(index, link){
    if(link){
    }
    else if(!this.state.transitioning){
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