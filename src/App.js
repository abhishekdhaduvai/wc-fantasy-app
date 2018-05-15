import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import axios from 'axios';

import Menu from './components/Menu';
import DrawerMenu from './components/DrawerMenu';

import Dashboard from './Screens/Dashboard/Dashboard';
import Schedule from './Screens/Schedule/Schedule';

class App extends Component {

  state = {
    profile: {}
  }

  componentDidMount() {
    this.getProfile();
  }

  getProfile = () => {
    axios.get('/me')
    .then(res => {
      this.setState({profile: res.data});
    })
    .catch(err => {
      console.log('Could not get user info');
      console.log(err);
    })
  }

  bet = (id, matchId, team, teamName) => {
    const { matches } = this.state;
    this.setState(state => {
      return {
        ...state,
        matches: matches.map((match, index) => {
          return index === id ? {
            ...match,
            bet: match.bet === team ? '' : team
          } : match
        })
      }
    });

    axios.post('/bet', {
      matchId,
      team,
      teamName
    })
    .then(res => {
      // this.getProfile();
    })
    .catch(err => {
      console.log('error placing bet');
    });
  }

  render() {
    const { profile } = this.state;
    return (
      <div style={styles.container}>
        <div className="menu">
          <Menu />
        </div>
        <div className="drawer">
          <DrawerMenu />
        </div>
        <Switch>
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/schedule" render={() => {
            return <Schedule profile={profile} updateBet={this.bet} />
          }}/>
          <Route path="/" render={() => {
            return <Redirect to="/dashboard" />
          }}/>
        </Switch>
      </div>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
}

export default withRouter(App);
