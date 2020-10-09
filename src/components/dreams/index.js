import React from 'react';
import styles from './styles.module.css';



class Dreams extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return <div className={styles.dreamContainer}>
        <iframe className={styles.dreams} width="100%" src="https://app.powerbi.com/reportEmbed?reportId=f8e7fa72-d93f-4fb9-b438-f2debe0c7c1f&autoAuth=true&ctid=4af8322c-80ee-4819-a9ce-863d5afbea1c&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLW5vcnRoLWV1cm9wZS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D" frameBorder="0" allowFullScreen={true}></iframe>
      </div>
  }
}

export default Dreams;