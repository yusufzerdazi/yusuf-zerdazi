
import React from 'react';
import styles from './styles.module.css';
import { Element } from 'react-scroll';
import rcRobot from '../../assets/rc-robotbg.png';
import everydays from '../../assets/everydays.svg';
import dream from '../../assets/dream.svg';
import hitbox from '../../assets/hitbox.svg';
import texttrek from '../../assets/texttrek.png';
import piVideo from '../../assets/slam.mp4';
import robot from '../../assets/robot.png';
import catfeeder from '../../assets/catfeeder.jpg';
import security from '../../assets/security.jpg';
import lecturehall from '../../assets/lecture-hall.jpg';
import headphones from '../../assets/headphones.png'
import nomobile from '../../assets/no-mobile.png';
import Tiles from '../../components/tiles';
import { isMobile } from 'react-device-detect';
import Everydays from '../../components/everydays';
import Dreams from '../../components/dreams';
import Camera from '../../components/camera';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { reactPlugin, appInsights } from '../../AppInsights';
import { Carousel, CarouselItem, Col, Row, Tab, Tabs } from 'react-bootstrap';

import dream_puml from '../../assets/puml/dreams.png';
import everydays_puml from '../../assets/puml/everydays.png';
import camera_puml from '../../assets/puml/camera.png';

const headphone_images = [
  "IMG_20141225_130752.jpg",
  "IMG_20141225_130857.jpg",
  "IMG_20141225_131723.jpg",
  "IMG_20141225_191151.jpg",
  "IMG_20141225_191205.jpg",
  "IMG_20141225_205544.jpg",
  "IMG_20141225_223403.jpg",
  "IMG_20220322_220630.jpg"
]

class Projects extends React.Component {
  constructor(props){
    super(props);
    this.state = {element: <></>, tempElement: <></>, overlay: false}
    this.setElement = this.setElement.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  render(){
    return (
      <Element id='projects' name='projects'>
      <div className="App" style={{ display: this.props.hidden ? 'none' : 'block'}}>
        <div className="container">
          <div className={styles.title}>
            <h1>Projects</h1>
          </div>
          <Tiles>
            <div title="Text Trek" link="https://texttrek.z16.web.core.windows.net/" image={texttrek}>
            </div>
            <div title="Dreams" image={dream}>
              <Tabs defaultActiveKey="project" id="dreams">
                <Tab eventKey="project" title="Project">
                  <p>For 5 years, I've kept a dream journal in Google Keep. I thought it would be interesting to use AI to scan my dreams for
                    sentiment over time, key phrases, recurring themes etc. Using Azure's Text Analysis, I analysed all my dreams, saving the results
                    in a Blob Storage account. Power BI allows me to create graphs and infographics based on this data, giving me insight into my
                    dreams and myself.
                  </p>
                  <Dreams></Dreams>
                </Tab>
                <Tab eventKey="architecture" title="Architecture">
                  <div>
                    <img className={styles.pumlImage} src={dream_puml}></img>
                  </div>
                </Tab>
              </Tabs>
            </div>
            <div title="Hitbox" image={hitbox}  link="https://www.hitbox.online">
            </div>
            <div title="Everydays" image={everydays} link="https://instagram.com/everyda.ys">
            </div>
            <div title="Security Camera" image={security}>
              <Tabs defaultActiveKey="project" id="camera">
                <Tab eventKey="project" title="Project">
                  <Camera></Camera>
                </Tab>
                <Tab eventKey="architecture" title="Architecture">
                  <div>
                    <p>The Raspberry Pi streams its live camera input, and uses a package called <a href="https://motion-project.github.io/">Motion</a> to detect if anything moves. If it does, it calls a webhook which gives me a phone notification through <a href="https://ifttt.com/">IFTTT</a>. 
                      This notification gives me a link to view the camera live-stream, so I can see what the camera has detected. It also uploads each motion detected video to blob so it can be embedded in my website.</p>
                    <img className={styles.pumlImage} src={camera_puml}></img>
                  </div>
                </Tab>
              </Tabs>
            </div>
            <div title="Automatic Cat Feeder" image={catfeeder}>
              <p>Using a Raspberry Pi (with a camera), an Arduino and a Pringles can, I created an automatic cat food dispenser.</p>
              <p>The Raspberry Pi camera intermittently takes pictures and sends them to <a href="https://azure.microsoft.com/en-gb/services/cognitive-services/">Azure Cognitive Services</a>. If it detects a cat, the Pi sends a signal to the Arduino which turns a servo motor, releasing food stored in the Pringles can.</p>
              <p>To avoid overfeeding, it's programmed to only release food twice a day. However, this is made more complicated since we have multiple cats; the second cat might eat food intended for the first. This is already an issue in our household, made evident by their discrepency in size.</p>
              <p>Further research required.</p>
              <div className="video-container">
                <iframe width="560" height="315" src="https://www.youtube.com/embed/ElRrdRDLgLk" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </div>
            </div>
            <div title="Raspberry Pi Robot" image={robot} >
              <p>
                  My final year project was 
                  to construct a robot which used <a href="https://en.wikipedia.org/wiki/Simultaneous_localization_and_mapping">Simultaneous Localisation 
                  and Mapping (SLAM)</a> techniques, to map out rooms in real time. The robot was based on a <a href="https://en.wikipedia.org/wiki/Raspberry_Pi">Raspberry Pi</a>, 
                  using <a href="https://en.wikipedia.org/wiki/Lego_Mindstorms">LEGO Mindstorms</a> components for sensor data and wheel movement, and streamed data to and from a remote 
                  laptop for control inputs. The project was successful, having major benefits when compared to using raw sensor data to map out rooms, 
                  and there is scope for further work to be done by implementing more robust sensors. I attained 80% in this project, which made up half 
                  of the final year of my degree.
              </p>
              <video className={styles.hitboxVideo} id="background-video" loop autoPlay muted controls>
                <source src={piVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div title="Virtual Lecture Hall" image={lecturehall}>
              <p>In this university assignment I created a 3D virtual lecture hall using JavaScript and WEB-GL. Check it out below - try kicking all the shapes outside the door onto the roof for an easter egg!</p>
              { !isMobile ? <div className="video-container">
                <iframe id="serviceFrameSend" src="./virtual-lecture-hall/index.html" width="100%" height="100%" frameBorder="0" />
              </div> : <><img height="50px" src={nomobile}></img><p style={{fontWeight:"900"}}>Not mobile compatible</p></> }
            </div>
            <div title="Arduino Robot" image={rcRobot} >
              <p>
                  At AS-Level, I built and programmed a simple, object avoiding robot using Arduino. I used CAD software to design the chassis, and an infrared sensor to detect objects.
                  Since then, I have improved the robot, which is now Bluetooth controlled. I used a servo motor to control the steering, and a Bluetooth reciever paired with an Android app to control it.
              </p>
              <div className="row">
                <div className="col-md-6 col-xs-12">
                  <div className="video-container">
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/fxrLrlWRNLk" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                  </div>
                </div>
                <div className="col-md-6 col-xs-12">
                  <div className="video-container">
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/0WHfGhkzuQc" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                  </div>
                </div>
              </div>
            </div>
            <div title="Bluetooth Headphones" image={headphones} >
              <p>
                With a Dremel, a soldering iron and some tools, I modded my wired ATH-M50 headphones from wired to wireless. Prior to modification, there is a wire attached to the headphones themselves. This was replaced with a 3.5mm jack slot, so for example a Bluetooth receiver can be attached.
              </p>
              <div>
                <Carousel interval={null}>
                  { headphone_images.map(h => 
                  <Carousel.Item>
                    <Row>
                      <Col xs={3}></Col>
                      <Col xs={6}><img className="d-block w-100" src={`./headphones/${h}`}></img></Col>
                      <Col xs={3}></Col>
                    </Row>
                  </Carousel.Item>
                  )}
                </Carousel>
              </div>
            </div>
          </Tiles>    
        </div>
      </div>
      </Element>
    );
  }

  setElement(element){
    if(!this.state.overlay) {
      this.setState({...this.state.tempElement, overlay: true, element: element});
    }
    else {
      this.setState({...this.state.element, overlay: false, tempElement: element});
    }
  }

  onClose(){
    if(this.state.tempElement.props.id != this.state.element.props.id){
      this.setState({...this.state.tempElement, overlay: true, element: this.state.tempElement});
    }
  }
}

export default withAITracking(reactPlugin, Projects);
