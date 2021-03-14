import React from 'react';
import styles from './styles.module.css';
import xmlToJSON from 'xmltojson';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { reactPlugin, appInsights } from '../../AppInsights';

class Camera extends React.Component {
  constructor(props){
    super(props);
    this.state = {};

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
          if(urls.length > 6) {
            urls = urls.slice(0, 6);
          }
          this.setState({blobs: urls});
        });
      })
      .catch((error) => {
        console.error(error)
      });
  }

  render() {
    return <div>
        <p>There's numerous home security systems available, most of which are at least a hundred pounds. However, with a simple Raspberry Pi and a camera, it's possible to achieve a similar result for less than fifty.</p>
        <p>The Raspberry Pi streams its live camera input, and uses a package called <a href="https://motion-project.github.io/">Motion</a> to detect if anything moves. If it does, it calls a webhook which gives me a phone notification through <a href="https://ifttt.com/">IFTTT</a>. 
        This notification gives me a link to view the camera live-stream, so I can see what the camera has detected.</p>
        <h3>Here's a <a href="https://pi.zerdazi.com:8081">live stream</a> of my bird feeder:</h3>
        <div className="stream-container-container">
          <div className="stream-container">
            <img className={styles.streamImage} src="https://pi.zerdazi.com:8081"></img>
          </div>
        </div>
        <h3>Recent Captures</h3>
        { this.state.blobs ? <div className="row">{this.state.blobs.map((blob, i) => {
          return <div key={i} className="col-md-4 col-sm-6 col-6"><video className="capture" width="100%" controls src={blob.url}></video></div>
        })}</div> : <span><i className="fas fa-spinner fa-pulse fa-2x fa-fw" color="white"/></span> }
      </div>
  }
}

export default withAITracking(reactPlugin, Camera);