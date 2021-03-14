import React from 'react';
import styles from './styles.module.css';
import dream_sentiment from '../../assets/dream_sentiment.svg';
import dream_recall from '../../assets/dream_recall.svg';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { reactPlugin, appInsights } from '../../AppInsights';


class Dreams extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return <div>
        <img width="100%" src={dream_sentiment}></img>
        <img width="100%" src={dream_recall}></img>
      </div>
  }
}

export default withAITracking(reactPlugin, Dreams);