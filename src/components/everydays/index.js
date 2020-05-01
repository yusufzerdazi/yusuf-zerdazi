import React from 'react';
import styles from './styles.module.css';
import data from '../../assets/everydays.json';
import ReactTooltip from 'react-tooltip';
import empty from '../../assets/empty.png';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class Everydays extends React.Component {
  constructor(props){
    super(props);
    this.state = {isLoading: true}

    this.image = ["drawing", "photoshop", "illustrator", "sharpie", "watercolour", "symbol", "photography", "computergenerated", "texture", "albumdiscovery"];
    this.sound = ["ableton", "guitar", "beat", "rap", "fieldrecording"];
    this.video = ["dance"];

    this.handleInputChange = this.handleInputChange.bind(this);
    this.highlightType = this.highlightType.bind(this);
    this.unhighlightTypes = this.unhighlightTypes.bind(this);
    setTimeout(() =>
    fetch("https://everydaysstorage.blob.core.windows.net/everydays/everydays.json")
      .then(response => response.json())
      .then((jsonData) => {
        jsonData.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : -1);
        this.getEverydayTypes(jsonData);
        this.setState({
          isLoading: false, 
          showMissedDays: false, 
          splitByMonth: false, 
          imagesLoaded: 0, 
          emptyImageSource: "", 
          everydays: jsonData,
          soundClass: styles.musicEveryday,
          videoClass: styles.videoEveryday,
          imageClass: styles.imageEveryday
        })
      })
      .catch((error) => {
        console.error(error)
      }), 420);
  }

  getEverydayTypes(everydays){
    for(var i=0; i<everydays.length; i++){
      if(this.image.some(r => everydays[i].tags.includes(r))){
        everydays[i].image = true;
      }
      if(this.sound.some(r => everydays[i].tags.includes(r))){
        everydays[i].sound = true;
      }
      if(this.video.some(r => everydays[i].tags.includes(r))){
        everydays[i].video = true;
      }
    }
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.name === 'showMissedDays' || target.name === 'splitByMonth' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  highlightType(type){
    if(this.state.highlighted === type){
      this.setState({highlighted: null});
      this.unhighlightTypes();
    }
    else{
      this.setState({highlighted: type});
      switch(type){
        case("sound"):
          this.setState({videoClass: styles.videoEveryday + " " + styles.highlighted});
          this.setState({imageClass: styles.imageEveryday + " " + styles.highlighted});
          this.setState({soundClass: styles.musicEveryday + " " + styles.show});
          break;
        case("image"):
          this.setState({videoClass: styles.videoEveryday + " " + styles.highlighted});
          this.setState({soundClass: styles.musicEveryday + " " + styles.highlighted});
          this.setState({imageClass: styles.imageEveryday + " " + styles.show});
          break;
        case("video"):
          this.setState({imageClass: styles.imageEveryday + " " + styles.highlighted});
          this.setState({soundClass: styles.musicEveryday + " " + styles.highlighted});
          this.setState({videoClass: styles.videoEveryday + " " + styles.show});
          break;
      }
    }
  }

  unhighlightTypes(){
    this.setState({soundClass: styles.musicEveryday});
    this.setState({imageClass: styles.imageEveryday});
    this.setState({videoClass: styles.videoEveryday})
    this.setState({soundImageClass: styles.musicImageEveryday})
  }

  render() {
    const everydays = [];

    if(this.state.isLoading){
      return <FontAwesomeIcon icon={['fas','spinner']} pulse size="2x" fixedWidth color="white"></FontAwesomeIcon>
    }

    var now = new Date();
    var i = 0;
    var j = 0;
    var previousDate=new Date(this.state.everydays[0].timestamp);
    for (var d = new Date(this.state.everydays[0].timestamp); d <= now; d.setDate(d.getDate() + 1)) {
      var date = d.toISOString().substring(0, 10);
      if(d.getMonth() !== previousDate.getMonth()){
        everydays.push(<span className={this.state.splitByMonth ? styles.splitByMonth : styles.dontSplitByMonth} key={"br"+j}/>)
      }
      if(i < this.state.everydays.length && this.state.everydays[i].timestamp === date){
        everydays.push(
          <span key={j}>
          <a href={this.state.everydays[i].permalink}>
            <img className={
              (this.state.everydays[i].image ? this.state.imageClass : '') + ' ' +
              (this.state.everydays[i].sound ? this.state.soundClass : '') + ' ' +
              (this.state.everydays[i].video ? this.state.videoClass : '')
            } loading="lazy" data-tip data-for={''+j} width="30px" height="30px" src={"https://everydaysstorage.blob.core.windows.net/everydayssmall/" + this.state.everydays[i].timestamp + ".jpg"}></img>
          </a>
          <ReactTooltip id={''+j} effect='solid' backgroundColor='rgba(255, 255, 255, 0)'>
            <img src={this.state.everydays[i].permalink.replace(/\/$/, "") + "/media/?size=m"} loading="lazy"></img>
          </ReactTooltip>
          </span>
        );
        i++;
      }
      else {
        everydays.push(
          <span key={j}><img className={this.state.showMissedDays ? "": styles.hideMissedDays} src={empty} width="30px" height="30px"></img></span>
        );
      }
      j++;
      previousDate=new Date(d);
    }

    return (
      <div>
        <div>
          <FormControlLabel
            control={
              <Checkbox name="showMissedDays" type="checkbox" checked={this.state.showMissingDays} onChange={this.handleInputChange} />
            }
            label="Show missed days"
          />
          <FormControlLabel
            control={
              <Checkbox name="splitByMonth" type="checkbox" checked={this.state.splitByMonth} onChange={this.handleInputChange} />
            } 
            label="Split by month"
          />
        </div>
        <div>
          <p>
          <span className={styles.typeIcon + ' ' + styles.musicTypeIcon}>
            <FontAwesomeIcon onClick={() => this.highlightType("sound")} className={styles.typeIconClick} icon={['fas','music']} size="lg" fixedWidth color="lightblue"></FontAwesomeIcon>
          </span>
          <span className={styles.typeIcon}>
            <FontAwesomeIcon onClick={() => this.highlightType("image")} className={styles.typeIconClick} icon={['fas','image']} size="lg" fixedWidth color="yellow"></FontAwesomeIcon>
          </span>
          <span className={styles.typeIcon}>
            <FontAwesomeIcon onClick={() => this.highlightType("video")} className={styles.typeIconClick} icon={['fas','video']} size="lg" fixedWidth color="pink"></FontAwesomeIcon>
          </span>
          </p>
        </div>
        <div>
          <span>
            {everydays}
          </span>
        </div>
      </div>
    );
  }
}

export default Everydays;