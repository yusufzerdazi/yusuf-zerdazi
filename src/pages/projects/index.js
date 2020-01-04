
import React from 'react';
import Tile from '../../components/tile';
import styles from './styles.module.css';
import { Element } from 'react-scroll'
import rcRobot from '../../assets/rc-robot.png';
import everydays from '../../assets/everydays.svg';
import underworld from '../../assets/underworld.jpg';
import robot from '../../assets/robot.png';
import instagram from '../../assets/instagram.png';
import table from '../../assets/table.png';

function Projects(props) {
    return (
      <Element id='projects' name='projects'>
      <div className="App" style={{ display: props.hidden ? 'none' : 'block'}}>
        <div className={styles.title}>
          <h1>Projects</h1>
        </div>
        <Tile backgroundImage={underworld} foregroundImage={everydays} objectFit="cover">
          <h2>Everydays</h2>
          <p style={{color:'white'}}>Inspired by Beeple's <a href="http://beeple-crap.com/everydays.php">Everydays</a> project, I plan to
            complete some piece of work — an image, a sound, a video, or some combination of these — every day. The aim of this project is 
            to get better at certain skills, and to make myself practice regularly. Of course, sometimes life will get in the way and I 
            will miss days, although I will try to catch up on the days I miss.</p>
          <a href="https://instagram.com/everyda.ys"><h4><img height="30px" className={styles.sourceLink} src={instagram}></img></h4></a>
        </Tile>
        <Tile small={true} backgroundImage={robot} objectFit="contain"  customStyles={{backgroundColor: '#808080'}}>
          <h2>Raspberry Pi Robot</h2>
          <p style={{color:'white'}}>
              My final year project was 
              to construct a robot which used <a href="https://en.wikipedia.org/wiki/Simultaneous_localization_and_mapping">Simultaneous Localisation 
              and Mapping (SLAM)</a> techniques, to map out rooms in real time. The robot was based on a <a href="https://en.wikipedia.org/wiki/Raspberry_Pi">Raspberry Pi</a>, 
              using <a href="https://en.wikipedia.org/wiki/Lego_Mindstorms">LEGO Mindstorms</a> components for sensor data and wheel movement, and streamed data to and from a remote 
              laptop for control inputs. The project was successful, having major benefits when compared to using raw sensor data to map out rooms, 
              and there is scope for further work to be done by implementing more robust sensors. I attained 80% in this project, which made up half 
              of the final year of my degree.
          </p>
        </Tile>
        <Tile small={true} backgroundImage={table} objectFit="cover" foregroundImage={rcRobot}>
          <h2>Arduino Robot</h2>
          <p style={{color:'white'}}>
              At AS-Level, I built and programmed a simple, object avoiding robot using Arduino. I used CAD software to design the chassis, and an infrared sensor to detect objects.
              Since then, I have improved the robot, which is now Bluetooth controlled. I used a servo motor to control the steering, and a Bluetooth reciever paired with an Android app to control it.
          </p>
          <div className="row">
            <div className="col-md-6 col-xs-12">
              <div className="video-container">
                <iframe width="560" height="315" src="https://www.youtube.com/embed/fxrLrlWRNLk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              </div>
            </div>
            <div className="col-md-6 col-xs-12">
              <div className="video-container">
                <iframe width="560" height="315" src="https://www.youtube.com/embed/0WHfGhkzuQc" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              </div>
            </div>
          </div>
        </Tile>
      </div>
      </Element>
    );
}

export default Projects;