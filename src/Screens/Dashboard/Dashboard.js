import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom'

import PointsTable from '../../components/PointsTable';
import './dashboard.css'

class Dashboard extends React.Component {

  goToProfile = (user) => {
    this.props.history.push(`/user/${user.id}`);
  }

  render(){
    const { table } = this.props;
    return (
      <div style={styles.container}>
        <img
          className="content-hero__img" src="https://league-mp7static.mlsdigital.net/styles/image_landscape/s3/images/DL-WCRussia2018-1280x553.jpg?DChqcutyM2Cj5kph.Zg1SvgsSPnGbasr&itok=EBnGH78e&c=08ce797bb0b111f4ccfb5e64e152df15" />
        <PointsTable table={table} goToProfile={this.goToProfile}/>
      </div>
    )
  }
}

const styles = {
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
}

export default withRouter(Dashboard);