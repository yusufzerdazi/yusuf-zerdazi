import React from 'react';
import styles from './styles.module.css';
import data from '../../assets/everydays.json';
import ReactTooltip from 'react-tooltip';
import empty from '../../assets/empty.png';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

class Everydays extends React.Component {
  constructor(props){
    super(props);
    this.state = {isLoading: true}

    this.image = ["drawing", "photoshop", "illustrator", "sharpie", "watercolour", "symbol", "photography", "computergenerated", "texture", "albumdiscovery"];
    this.sound = ["ableton", "guitar", "beat", "rap", "fieldrecording", "singing"];
    this.video = ["dance", "videoediting"];

    this.handleInputChange = this.handleInputChange.bind(this);
    this.highlightType = this.highlightType.bind(this);
    this.unhighlightTypes = this.unhighlightTypes.bind(this);
    setTimeout(() =>
    fetch("https://everydays.blob.core.windows.net/everydays/everydays.json")
      .then(response => response.json())
      .then((jsonData) => {
        jsonData.sort((a, b) => (a.timestamp < b.timestamp) ? 1 : -1);
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
      this.setState({videoClass: styles.videoEveryday + " " + styles.highlighted});
      this.setState({imageClass: styles.imageEveryday + " " + styles.highlighted});
      this.setState({soundClass: styles.musicEveryday + " " + styles.highlighted});
      switch(type){
        case("sound"):
          this.setState({soundClass: styles.musicEveryday + " " + styles.show});
          break;
        case("image"):
          this.setState({imageClass: styles.imageEveryday + " " + styles.show});
          break;
        case("video"):
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
      return <span><i className="fas fa-spinner fa-pulse fa-2x fa-fw" color="white"/></span>
    }

    var lastDate = new Date(this.state.everydays[this.state.everydays.length - 1].timestamp);
    var i = 0;
    var j = 0;
    var previousDate=null;
    var monthCount = 0;
    for (var d = new Date(); d >= lastDate; d.setDate(d.getDate() - 1)) {
      var date = d.toISOString().substring(0, 10);
      if(previousDate == null || (d.getMonth() !== previousDate.getMonth())){
        everydays.push(<span className={this.state.splitByMonth && (previousDate != null && (monthCount > 0 || this.state.showMissedDays)) ? styles.splitByMonth : styles.dontSplitByMonth} key={"br"+j}/>)
        everydays.push(<span className={this.state.splitByMonth && (previousDate == null || d.getFullYear() !== previousDate.getFullYear()) ? styles.yearHeader : styles.dontSplitByMonth} key={"yr"+j}><h4>{d.getFullYear()}</h4></span>)
        monthCount = 0;
      }
      if(i < this.state.everydays.length && this.state.everydays[i].timestamp === date){
        monthCount++;
        everydays.push(
          <span key={j}>
          <a href={this.state.everydays[i].permalink}>
            <img className={
              (this.state.everydays[i].image ? this.state.imageClass : '') + ' ' +
              (this.state.everydays[i].sound ? this.state.soundClass : '') + ' ' +
              (this.state.everydays[i].video ? this.state.videoClass : '')
            } loading="lazy" data-tip data-for={''+j} width="30px" height="30px" src={"https://everydays.blob.core.windows.net/everydays/imagesSmall/" + this.state.everydays[i].timestamp + ".jpg"}></img>
          </a>
          <ReactTooltip id={''+j} effect='solid' backgroundColor='rgba(255, 255, 255, 0)'>
            <img src={"https://everydays.blob.core.windows.net/everydays/images/" + this.state.everydays[i].timestamp + ".jpg"} loading="lazy"></img>
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
          <span onClick={() => this.highlightType("sound")} className={styles.typeIcon + ' ' + styles.musicTypeIcon} data-tip data-for={"music"}>
          <i className={"fas fa-music fa-lg fa-fw " + styles.typeIconClick} color="lightblue"/>
          </span>
          <span onClick={() => this.highlightType("image")} className={styles.typeIcon} data-tip data-for={"art"}>
            <i className={"fas fa-image fa-lg fa-fw " + styles.typeIconClick} color="yellow"/>
          </span>
          <span onClick={() => this.highlightType("video")} className={styles.typeIcon} data-tip data-for={"video"}>
            <i className={"fas fa-video fa-lg fa-fw " + styles.typeIconClick}  color="pink"/>
          </span>
          <span onClick={() => this.highlightType("favourite")} className={styles.typeIcon} data-tip data-for={"favourite"}>
            <i className={"fas fa-star fa-lg fa-fw " + styles.typeIconClick}  color="gold"/>
          </span>
          </p>
          <ReactTooltip id="music">Filter to music</ReactTooltip>
          <ReactTooltip id="art">Filter to art</ReactTooltip>
          <ReactTooltip id="video">Filter to video</ReactTooltip>
          <ReactTooltip id="favourite">Favourites</ReactTooltip>
        </div>
        <div className={styles.everydays}>
          <span>
            {everydays}
          </span>
        </div>
        <div className={styles.chartContainer}>
          <iframe className={styles.chart} width="100%" src="https://app.powerbi.com/reportEmbed?reportId=7e7da67c-dd2f-417e-a1ad-a43770b3120e&autoAuth=true&ctid=4af8322c-80ee-4819-a9ce-863d5afbea1c&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLW5vcnRoLWV1cm9wZS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D" frameBorder="0" allowFullScreen={true}></iframe>
        </div>
      </div>
    );
  }
}

export default Everydays;