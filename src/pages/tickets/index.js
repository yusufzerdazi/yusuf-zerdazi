
import React from 'react';
import styles from './styles.module.css';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { reactPlugin, appInsights } from '../../AppInsights';
import { Alert, Button, Col, Container, Form, InputGroup, OverlayTrigger, Row, Table, Tooltip } from 'react-bootstrap';


class Tickets extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      formData: {},
      subscribed: {
        "new": true
      }
    };
    this.handleChange = this.handleChange.bind(this);
    this.addEvent = this.addEvent.bind(this);
    this.addSubscription = this.addSubscription.bind(this);
  }

  componentDidMount(){
    fetch(process.env.REACT_APP_GET_STOCK_URL + "&etag=" + this.uuidv4())
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
          phoneNumber: this.state.formData.addNumber,
          minPrice: this.state.formData.minPrice,
          maxPrice: this.state.formData.maxPrice
        }),
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then((response) => {
        if(response.status == 200){
          var stock = this.state.stock;
          stock.push({
            Title: this.state.formData.title,
            Provider: this.state.formData.url.split("//")[1].split("/")[0],
            LinkUrl: this.state.formData.url,
            MinPrice: this.state.formData.minPrice,
            MaxPrice: this.state.formData.maxPrice,
            Id: "new"
          })
          this.setState({
            stock: stock
          });
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

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  render(){
    return (
      <div className={styles.tableContainer}>
        <Table>
          <thead>
            <tr>
              <th>In Stock</th>
              <th>Title</th>
              <th>Provider</th>
              <th className={styles.price}>Min Price</th>
              <th className={styles.price}>Max Price</th>
              <th className={styles.number}>Subscribe</th>
            </tr>
          </thead>
          <tbody>
            {this.state.stock ? this.state.stock.map((x, i) => 
              <tr key={i}>
                <td className={styles.status}>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text className={x.InStock ? "bg-success text-white" : "bg-danger text-white"}>
                        <i className={"fas " + (x.InStock ? "fa-check" : "fa-times")}/>
                      </InputGroup.Text>
                      <OverlayTrigger placement="bottom" overlay={<Tooltip id="registerTip">Subscribers: {x.SubscriberCount}</Tooltip>}>
                        <InputGroup.Text>
                          <i className={"fas fa-users"}/>
                        </InputGroup.Text>
                      </OverlayTrigger>
                    </InputGroup.Prepend>
                  <InputGroup.Append>
                    <OverlayTrigger placement="bottom" overlay={<Tooltip id="registerTip">Last checked: {new Date(x.LastChecked).toLocaleString()}</Tooltip>}>
                      <InputGroup.Text id="basic-addon1">
                        <i className={"fas fa-clock"}/>
                      </InputGroup.Text>
                    </OverlayTrigger>
                  </InputGroup.Append>
                  </InputGroup>
                </td>
                <td><a href={x.LinkUrl}>{x.Title}</a></td>
                <td>{this.getFriendlyName(x.Provider)}</td>
                <td>{x.MinPrice}</td>
                <td>{x.MaxPrice}</td>
                <td>
                  {this.state.subscribed[x.Id] ? 
                  <Alert variant="success">Subscribed</Alert> :
                  <InputGroup>
                    <Form.Control name="subscribeNumber" placeholder="Phone Number" onChange={(e) => this.handleChange(e, x.Id)} />
                    <InputGroup.Append>
                      <OverlayTrigger placement="bottom" overlay={<Tooltip id="registerTip">Subscribe</Tooltip>}>
                        <Button type="submit" variant="success" onClick={(e) => this.addSubscription(e, x.Id)}>
                          <i className="fas fa-check" color="white"/>
                        </Button>
                      </OverlayTrigger>
                    </InputGroup.Append>
                  </InputGroup>
                  }
                </td>
              </tr>) 
            : <></>}
              <tr>
                <td></td>
                <td><Form.Control placeholder="Title" name="title" onChange={this.handleChange} /></td>
                <td><Form.Control placeholder="URL" name="url" onChange={this.handleChange} /></td>
                <td>
                  <Form.Control type="number" placeholder="Min" name="minPrice" onChange={this.handleChange} />
                </td>
                <td>
                  <Form.Control type="number" placeholder="Max" name="maxPrice" onChange={this.handleChange} />
                </td>
                <td>
                  <InputGroup>
                    <Form.Control placeholder="Phone Number" name="addNumber" onChange={this.handleChange} />
                    <InputGroup.Append>
                      <OverlayTrigger placement="bottom" overlay={<Tooltip id="registerTip">Add</Tooltip>}>
                        <Button type="submit" onClick={this.addEvent}>
                          <i className="fas fa-plus" color="white"/>
                        </Button>
                      </OverlayTrigger>
                    </InputGroup.Append>
                  </InputGroup>
                </td>
              </tr>
          </tbody>
        </Table>
        <div className={styles.error}>
          {this.state.error?.message}
        </div>
      </div>
    );
  }
}

export default withAITracking(reactPlugin, Tickets);