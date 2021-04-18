
import React from 'react';
import styles from './styles.module.css';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { reactPlugin, appInsights } from '../../AppInsights';
import { Alert, Button, Col, Container, Form, Row, Table } from 'react-bootstrap';


class Tickets extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      formData: {},
      subscribed: {}
    };
    this.handleChange = this.handleChange.bind(this);
    this.addEvent = this.addEvent.bind(this);
    this.addSubscription = this.addSubscription.bind(this);
  }

  componentDidMount(){
    fetch(process.env.REACT_APP_GET_STOCK_URL)
      .then(response => response.json())
      .then((json) => this.setState({stock: json}));
  }

  handleChange(e, id){
    this.setState({
      formData: {
        ...this.state.formData,
        [id ?? e.target.name]: e.target.value.trim()
      }
    });
  };

  addEvent(e){
    e.preventDefault();
    if(this.state.formData.addNumber && this.state.formData.title && this.state.formData.url){
      fetch(process.env.REACT_APP_STOCK_URL, {
        method: "POST",
        body: JSON.stringify({
          url: this.state.formData.url,
          title: this.state.formData.title,
          phoneNumber: this.state.formData.addNumber
        }),
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then((response) => {
        if(response.status == 200){
          window.location.reload();
        }
        else if(response.status == 400){
          response.json().then(e => this.setState({error: e}));
        }
        else {
          this.setState({error: {message: "An unknown error occured, please try again."}})
        }
      })
    }
  }

  addSubscription(e, id){
    e.preventDefault();
    if(this.state.formData[id]){
      fetch(process.env.REACT_APP_SUBSCRIBE_URL, {
        method: "POST",
        body: JSON.stringify({
          stockId: id,
          phoneNumber: this.state.formData[id]
        }),
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then((response) => {
        if(response.status == 200){
          this.setState({
            subscribed: {
              [id]: true
            }
          });
        }
        else if(response.status == 400){
          response.json().then(e => this.setState({error: e}));
        }
        else {
          this.setState({error: {message: "An unknown error occured, please try again."}})
        }
      });
    }
  }

  getFriendlyName(provider){
    switch(provider){
      case("ra.co"):
        return "Resident Advisor";
      case("www.ticketmaster.co.uk"):
        return "Ticketmaster";
      default:
        return null;
    }
  }

  render(){
    return (
      <Container>
        <Table>
          <thead>
            <tr>
              <th>In Stock</th>
              <th>Title</th>
              <th>Provider</th>
              <th className={styles.price}>Min Price</th>
              <th className={styles.price}>Max Price</th>
              <th>Subscribe</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.stock ? this.state.stock.map((x, i) => 
              <tr key={i}>
                <td>
                  <Alert variant={x.InStock ? 'primary' : 'danger'}>
                    <div className={styles.stockStatus}>
                      <i className={"fas " + (x.InStock ? "fa-check" : "fa-times")}/>
                    </div>
                  </Alert>
                </td>
                <td><a href={x.LinkUrl}>{x.Title}</a></td>
                <td>{this.getFriendlyName(x.Provider)}</td>
                <td>{x.MinPrice}</td>
                <td>{x.MaxPrice}</td>
                <td>
                  {this.state.subscribed[x.Id] ? 
                  <Alert variant="success">Subscribed</Alert> :
                  <Form.Row>
                    <Col xs="auto"><Form.Control name="subscribeNumber" placeholder="Phone Number" onChange={(e) => this.handleChange(e, x.Id)} /></Col>
                  </Form.Row>
                  }
                </td>
                <td>
                  {!this.state.subscribed[x.Id] ?
                  <Form.Row>
                    <Col xs="auto">
                      <Button type="submit" variant="success" onClick={(e) => this.addSubscription(e, x.Id)}>
                        <i className="fas fa-check" color="white"/>
                      </Button>
                    </Col>
                  </Form.Row> : <></>
                  }
                </td>
              </tr>) 
            : <></>}
              <tr>
                <td></td>
                <td><Form.Control placeholder="Title" name="title" onChange={this.handleChange} /></td>
                <td><Form.Control placeholder="URL" name="url" onChange={this.handleChange} /></td>
                <td><Form.Control type="number" placeholder="Min" name="minPrice" onChange={this.handleChange} /></td>
                <td><Form.Control type="number" placeholder="Max" name="maxPrice" onChange={this.handleChange} /></td>
                <td>
                  <Form.Row>
                    <Col xs="auto"><Form.Control placeholder="Phone Number" name="addNumber" onChange={this.handleChange} /></Col>
                  </Form.Row>
                </td>
                <td>
                <Form.Row>
                    <Col xs="auto">
                      <Button type="submit" onClick={this.addEvent}>
                        <i className="fas fa-plus" color="white"/>
                      </Button>
                    </Col>
                  </Form.Row>
                </td>
              </tr>
          </tbody>
        </Table>
        <div className={styles.error}>
          {this.state.error?.message}
        </div>
      </Container>
    );
  }
}

export default withAITracking(reactPlugin, Tickets);