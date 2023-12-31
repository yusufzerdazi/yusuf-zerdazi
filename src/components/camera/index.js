import React from 'react';
import styles from './styles.module.css';
import xmlToJSON from 'xmltojson';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { reactPlugin, appInsights } from '../../AppInsights';
import { Carousel, CarouselItem, Col, Row } from 'react-bootstrap';

class Camera extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
    this.onSlide = this.onSlide.bind(this);
  }

  onSlide(number, direction){
    if(number == 0 && direction == "left") {
      this.setState({index: this.state.index + 6});
    }
    if(number == 2 && direction == "right") {
      this.setState({index: Math.max(this.state.index - 6, 0)});
    }
  }

  componentDidMount(){
    fetch("https://yusufzerdazi.blob.core.windows.net/captures?restype=container&comp=list")
      .then(response => {
        response.text().then(xml => {
          var json = xmlToJSON.parseString(xml);
          var blobs = json.EnumerationResults[0].Blobs[0].Blob;
          var urls = [];
          blobs.forEach(blob => {
            urls.push({
              url: blob.Url[0]._text,
              date: Date.parse(blob.Properties[0]["Last-Modified"][0]._text)
            });
          });
          urls.sort((a,b) => b.date - a.date);
          this.setState({
            blobs: urls,
            index: 0
          });
        });
      })
      .catch((error) => {
        console.error(error)
      });
  }

  render() {
    return <div>
        <p>
          There's numerous home security systems available, most of which are at least a hundred pounds. However, with a simple Raspberry Pi and a camera, it's possible to achieve a similar result for less than fifty.
          Using a Raspberry Pi and its camera module, I set up a live stream with motion detection capabilities, and by hooking this up to other services it can give you a notification when it sees something.
        </p>
        <h3>Captures</h3>
        { this.state.blobs ? 
          <Carousel onSlid={this.onSlide} interval={null} indicators={false}>
            <Carousel.Item>
              <div className={styles.carouselContainer}>
                <Row>
                  <Col xs={12} lg={6}><video className="capture" width="100%" controls src={this.state.blobs[this.state.index].url}></video></Col>
                  <Col xs={12} lg={6}><video className="capture" width="100%" controls src={this.state.blobs[this.state.index + 1].url}></video></Col>
                </Row>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className={styles.carouselContainer}>
                <Row>
                  <Col xs={12} lg={6}><video className="capture" width="100%" controls src={this.state.blobs[this.state.index + 2].url}></video></Col>
                  <Col xs={12} lg={6}><video className="capture" width="100%" controls src={this.state.blobs[this.state.index + 3].url}></video></Col>
                </Row>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className={styles.carouselContainer}>
                <Row>
                  <Col xs={12} lg={6}><video className="capture" width="100%" controls src={this.state.blobs[this.state.index + 4].url}></video></Col>
                  <Col xs={12} lg={6}><video className="capture" width="100%" controls src={this.state.blobs[this.state.index + 5].url}></video></Col>
                </Row>
              </div>
            </Carousel.Item>
          </Carousel> : <span><i className="fas fa-spinner fa-pulse fa-2x fa-fw" color="white"/></span> }
      </div>
  }
}

export default withAITracking(reactPlugin, Camera);