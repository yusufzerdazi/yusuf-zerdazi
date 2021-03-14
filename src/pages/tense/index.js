import React from 'react';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { reactPlugin, appInsights } from '../../AppInsights';

function Tense(props){
  window.location.href = 'https://distrokid.com/hyperfollow/yusufzerdazi/tense';
  return <></>;
}

export default withAITracking(reactPlugin, Tense);