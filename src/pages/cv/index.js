
import React from 'react';
import Header from '../../components/header';
import styles from './styles.module.css';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { reactPlugin, appInsights } from '../../AppInsights';
import { Alert, Button, Col, Container, Form, InputGroup, OverlayTrigger, Row, Table, Tooltip } from 'react-bootstrap';
import { Link } from "react-router-dom";

class CV extends React.Component {
  constructor(props){
    super(props);
    
  }

  componentDidMount(){
    
  }

  render(){
    return (
      <Container className={styles.cv}>
        <div className={styles.header}>
          <Link to="/"><Header dark={true}/></Link>
          <h3>Senior Software Engineer</h3>
          <h5><i className="fas fa-map-marker-alt"/> London&nbsp;&nbsp;&nbsp;&nbsp;<i className="fas fa-link"/> <a href="https://yusuf.zerdazi.com">https://yusuf.zerdazi.com</a></h5>
        </div>
        <Row className={styles.content}>
          <Col xs={12}>
            <div className={styles.dotted} />
            <h4><b>Summary</b></h4>
            <p>
            Senior Software Engineer with over 6 years of experience in a variety of technical domains including <b>Azure</b>, <b>.NET Core</b>, <b>SQL</b>, <b>Python</b>, and <b>Agile</b> methodologies. Proven ability as a team leader, mentor, and key contributor, driving high-impact projects to success within fast-paced and ever-evolving business environments. Passionate about personal growth, quality work, and engaging in diverse interests such as music production, digital art, electronics, and web development.
            </p>
            <div className={styles.dotted} />
            <h4><b>Skills</b></h4>
              <p><i className="fas fa-dot-circle"/> <b>Languages/Frameworks:</b> C#, .NET Core, SQL, Kubernetes, Docker, Terraform, Bicep, ARM Templates, JavaScript, Python, React, Angular, PowerShell, HTML5.</p>
              <p><i className="fas fa-dot-circle"/> <b>CI/CD:</b> Git, Azure DevOps, GitHub Actions, Octopus Deploy, TeamCity.</p>
              <p><i className="fas fa-dot-circle"/> <b>Azure:</b> Service Bus, Blob Storage, Redis, Cosmos DB, Cloud Services, AKS, App Services, Function/Logic Apps, Databricks, Stream Analytics, Event Grid, Application Insights.</p>
              <p><i className="fas fa-dot-circle"/> <b>Methodologies:</b> Agile, Scrum, Kanban, SOLID, KISS, DRY, TDD.</p>
            <div className={styles.dotted} />
            <h4><b>Experience</b></h4>
            <h5>
              <i className="fas fa-chevron-circle-right"/> <b>December 2021 - Present:</b> <i>ASOS</i> - Senior Software Engineer
            </h5>
            <div className={styles.para}>
            <p>
            I became a senior software engineer after successful delivery of the "Direct to Customer" project and drove its successful expansion using <b>.NET Core</b>, <b>Logic Apps</b>, <b>Durable Functions</b>, <b>Databricks</b> and other <b>Azure</b> services. It was necessary to further build and expand the team, and I took a central role in interviewing and assessing potential candidates, as well as mentoring and on-boarding new team members as they were brought in.
            </p>
            <p>
            Many vital new features and initiatives were delivered which further progressed one of ASOS' central priorities, and this was accomplished by successfully organising the work, delegating and coaching other team members, and coordinating and communicating requirements across a number of other teams.
            </p>
            </div>
            <h5>
              <i className="fas fa-chevron-circle-right"/> <b>November 2019 - November 2021</b> - <i>ASOS</i> - Software Engineer
            </h5>
            
            <div className={styles.para}>
            <p>
            I lead new feature initiatives and utilizing technologies such as <b>Durable Functions</b>, <b>Stream Analytics</b>, and <b>Databricks</b>, developing high-throughput services for various projects. Primarily using <b>.NET Core</b> along with technologies mentioned in the previous role, I continued to deliver quality code and became a respected point of call for both experienced and junior team members.
            </p>
            <p>
            I then moved to a dedicated team spearheading a new "Direct to Customer" initiative for ASOS, refining skills in <b>Logic Apps</b>, <b>Cosmos DB</b>, <b>Service Bus</b>, <b>Terraform</b>, <b>Application Insights</b>, <b>Grafana</b>, team coordination, and mentoring. Maintainability, monitoring and alerting were highly prioritised from the beginning so that we could effectively support the solution, which was delivered within a tight deadline, and gave ASOS access to unique partnership opportunities with well known fashion brands.
            </p>
            </div>
            <h5>
              <i className="fas fa-chevron-circle-right"/> <b>March 2019 - September 2019</b> - <i>ASOS</i> - Associate Software Engineer
            </h5>
            <div className={styles.para}>
              <p>
              I delivered high quality, well tested code which furthers the company’s priorities, driving technological improvement and helping to deliver key projects to their deadline, taking an active role in defining and delivering work, both at a business and implementation level. My ability to quickly pick up knowledge of infrastructure and its purpose allowed me to make a big impact early on, aiding the team as an engineer and problem-solver. I facilitated collaboration and communication through clearly articulated ideas and constructive engagement with others.
              </p>
            <p>
              Using <b>.NET Core</b>, <b>ARM Templates</b> and <b>Azure</b>, I contributed to a number of projects, ensuring the code was maintainable by applying <b>TDD</b> and <b>SOLID</b> principles. Tools such as NCrunch and ReSharper were used to improve productivity, and other tools such as SQL Management Studio, Azure Storage Explorer
              and Service Bus Explorer aided the development and testing of new code.
              </p>
            <p>
              In other projects I used Sitecore, <b>Logic Apps</b>, <b>Redis Cache</b>, <b>Cloud Services</b>, <b>Blob Storage</b>, <b>.NET Framework</b> and Kibana, and became a member of the support team, debugging and fixing issues outsite of office hours when incidents occurred.
              </p>
            </div>
            <h5>
              <i className="fas fa-chevron-circle-right"/> <b>October 2017 - February 2019</b> - <i>Nottinghamshire County Council</i> - Software Developer
            </h5>
            <div className={styles.para}>
              <p>
              I was a full-stack software developer working in <b>.NET Core</b>, <b>JavaScript</b>, <b>HTML</b> and <b>Angular</b>, utilising many modern technologies to build systems for the public sector in Nottinghamshire. I took a leading role in architectural decisions and defining work, applying this to the successful delivery of <b>Agile</b> projects in many areas, ranging from healthcare to highways.
              </p>
            </div>
            <h5>
              <i className="fas fa-chevron-circle-right"/> <b>July - September 2016</b> - <i>Apple</i> - Software Engineer Summer Internship
            </h5>
            <div className={styles.para}>
              <p>
              Apple’s fast-paced, engaging environment provided me with vital insight into how tech giants structure their development. I experienced an <b>Agile</b> workflow which changed my perspective on efficient software development, and challenged me to produce software in an unfamiliar way.
</p>
<p>
I was tasked with developing a tool that would improve the efficiency of working with Apple’s ticket system for <b>Agile</b> development. I used <b>Python</b>, Flask and <b>JavaScript</b>, interfacing with an internal API, to produce a web application that fulfilled the requirements.
              </p>
            </div>
            <h5>
              <i className="fas fa-chevron-circle-right"/> <b>June - September 2015</b> - <i>Centre of Evaluation and Monitoring</i> - Software Engineer Summer Internship
            </h5>
            <div className={styles.para}>
              <p>
              Using MVC, <b>JavaScript</b>, Entity Framework, Kendo UI, Knockout JS, and three tier design patterns, I created internal web tool. The tool links to a database, and streamlines other teams' interactions with organisational data.
              </p>
            </div>
            <div className={styles.dotted} />
            <h4><b>Education</b></h4>
            <h5>
              <i className="fas fa-chevron-circle-right"/> <b>2013 - 2017:</b> Durham University
            </h5>
            <p className={styles.para}>
            First-class honours degree in Natural Sciences (studying Computer Science and Maths), averaging 80%
            </p>
            <h5>
              <i className="fas fa-chevron-circle-right"/> <b>2011 - 2013</b> Toot Hill College
            </h5>
            <p className={styles.para}>
              Attained two A*s and two As at A-Level, in Maths, Further Maths, Physics and Chemistry respectively
            </p>
            <div className={styles.dotted} />
            <h4><b>Awards</b></h4>
            <h5><i className="fas fa-chevron-circle-right"/> <b>Natural Sciences MSci Award for Outstanding Achievement:</b> Natural Sciences Department</h5>
            <h5><i className="fas fa-chevron-circle-right"/> <b>Natural Sciences Finalist for Outstanding Academic Achievement in Computer Science:</b> Computer Science Department</h5>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withAITracking(reactPlugin, CV);