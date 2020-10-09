import React from 'react';
import ReactWordcloud from 'react-wordcloud';
import ReactApexChart from 'react-apexcharts'
import styles from './styles.module.css';



class Dreams extends React.Component {
  constructor(props){
    super(props);

    this.state = { };

    fetch("https://dreamtracker.blob.core.windows.net/summary/dreams.json")
      .then(response => response.json())
      .then((dreams) => {
        dreams.sort((a, b) => (a.timestamp < b.timestamp) ? 1 : -1);
        var dream_words = {};
        var dream_sentiment_pos = {data:[], name: "Positive"};
        var dream_sentiment_neg = {data:[], name: "Negative"};
        var dream_sentiment_neu = {data:[], name: "Neutral"};
        dreams.forEach(d => {
          d.key_phrases.forEach(p => {
            dream_words[p.toLowerCase()] = dream_words[p] ? dream_words[p] + 1 : 1;
          });
          dream_sentiment_pos.data.push([new Date(d.timestamp), d.sentiment.confidence_scores.positive - d.sentiment.confidence_scores.negative + 0.5 * d.sentiment.confidence_scores.neutral]);
          dream_sentiment_neg.data.push([new Date(d.timestamp), d.sentiment.confidence_scores.negative]);
          dream_sentiment_neu.data.push([new Date(d.timestamp), d.sentiment.confidence_scores.neutral]);
        });

        var dream_word_list = [];
        for(var key in dream_words){
          dream_word_list.push({text: key, value: dream_words[key]});
        };
        this.setState({
          words: dream_word_list,
          series: [dream_sentiment_pos],
          options: {
            chart: {
              height: 350,
              type: 'scatter',
              zoom: {
                enabled: true,
                type: 'xy'
              }
            },
            xaxis: {
              type: 'datetime',
            },
            markers: {
              size: 3,
            },
            theme: {
              palette: 'palette1' // upto palette10
            },
            grid: {
              row: {
                colors: ['#ffffff', '#ffffff', '#ffffff']
              },
              column: {
                colors: ['#ffffff', '#ffffff', '#ffffff']
              }
            },
            dataLabels: {
              style: {
                colors: ['#ffffff', '#ffffff', '#ffffff']
              }
            }
          }
        });
      });
  }

  render() {
    console.log(this.state.sentiment);
    return <div style={{textAlign:'center'}}> 
      { this.state.words ? 
        <div>
          <div>
            <ReactWordcloud 
            options={{
            rotations: 1,
            fontSizes: [20, 120],
            rotationAngles: [0, 0]}}
            words={this.state.words} />
          </div>
          <div>
            <ReactApexChart options={this.state.options} series={this.state.series} type="scatter" height={350} />
          </div>
        </div>
      : <></> }
      </div>
  }
}

export default Dreams;