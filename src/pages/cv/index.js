
import React from 'react';
import Header from '../../components/header';
import styles from './styles.module.css';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { reactPlugin, appInsights } from '../../AppInsights';
import { Alert, Button, Col, Container, Form, InputGroup, OverlayTrigger, Row, Table, Tooltip } from 'react-bootstrap';


class CV extends React.Component {
  constructor(props){
    super(props);
    
  }

  componentDidMount(){
    
  }

  render(){
    return (
      <Container>
        <div className={styles.header}>
          <Header dark={true}/>
          <h3>Senior Software Engineer</h3>
          <h5><i className="fas fa-map-marker-alt"/> Hoxton, London&nbsp;&nbsp;&nbsp;&nbsp;<b><i className="fas fa-envelope"/> </b> <a href="mailto://yusuf@zerdazi.com">yusuf@zerdazi.com</a></h5>
        </div>
        <Row className={styles.content}>
          <Col xs={8}>
            <h4>Summary</h4>
            <div className={styles.dotted} />
            <p>
            Senior Software Engineer with over 6 years of experience in a variety of technical domains including Azure,
            .NET Core, SQL, Python, and Agile methodologies. Proven ability as a team leader, mentor, and key contributor, driving high-impact projects to success
            within fast-paced and ever-evolving business environments. First-class honours degree in Computer Science and Maths from Durham University, accompanied by
            outstanding academic achievements awards. Passionate about personal growth, quality work, and engaging in diverse interests such as music production,
            digital art, electronics, and web development.
            </p>
            <h4>Experience</h4>
            <div className={styles.dotted} />
            <p>
              <b>December 2021 - Present:</b> <i>ASOS</i> - Senior Software Engineer
            </p>
            <p>
              <b>November 2019 - November 2021</b> - <i>ASOS</i> - Software Engineer
            </p>
            <p>
              <b>March 2019 - September 2019</b> - <i>ASOS</i> - Associate Software Engineer
            </p>
            <p>
              <b>October 2017 - February 2019</b> - <i>Nottinghamshire County Council</i> - Software Developer
            </p>
            <p>
              <b>July - September 2016</b> - <i>Apple</i> - Software Engineer Summer Internship
            </p>
            <p>
              <b>June - September 2015</b> - <i>Centre of Evaluation and Monitoring</i> - Software Engineer Summer Internship
            </p>
            <h4>Education</h4>
            <div className={styles.dotted} />
            <p>
              <b>2013 - 2017:</b> Durham University
            </p>
            <p>
              <b>2011 - 2013</b> Toot Hill College
            </p>
          </Col>
          <Col className={styles.sidebar} xs={4}>
            <h4>Skills</h4>
            <div className={styles.dotted} />
            <h5>Personal</h5>
            <p>test</p>
            <h5>Technical</h5>
            <h5>Professional</h5>
            <h5>Other</h5>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withAITracking(reactPlugin, CV);