import React from 'react';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { reactPlugin, appInsights } from '../../AppInsights';

function Vibe(props){
    window.location.href = 'https://distrokid.com/hyperfollow/yusufzerdazi/vibe';
    return <></>;
}

export default withAITracking(reactPlugin, Vibe);