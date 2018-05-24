import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import axios from 'axios';

import Menu from './components/Menu';
import DrawerMenu from './components/DrawerMenu';

import Dashboard from './Screens/Dashboard/Dashboard';
import Schedule from './Screens/Schedule/Schedule';
import Results from './Screens/Results/Results';

class App extends Component {

  state = {
    profile: {},
    matches: [],
    table: []
  }

  componentDidMount() {
    this.getMatches();
    this.getProfile();
    this.getTable();
  }

  getProfile = () => {
    axios.get('/me')
    .then(res => {
      this.setState({profile: res.data});
    })
    .catch(err => {
      this.setState({ error: 'Error getting user info'});
      console.log(err);
    })
  }

  getMatches = () => {
    axios.get('/matches')
    .then(res => {
      this.setState({ matches: res.data[0] });
    })
    .catch(err => {
      this.setState({ error: 'Error getting fixtures'});
      console.log(err);
    });
  }

  getTable = () => {
    axios.get('/table')
    .then(res => {
      this.setState({ table: res.data });
    })
    .catch(err => {
      this.setState({ error: 'Error getting the points table'});
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
    .catch(err => {
      console.log('error placing bet');
    });
  }

  render() {
    const { profile, matches, table } = this.state;
    return (
      <div style={styles.container}>
        <div className="menu">
          <Menu profile={profile} />
        </div>
        <div className="drawer">
          <DrawerMenu />
        </div>
        <Switch>
          <Route exact path="/dashboard" render={() => {
            return <Dashboard table={table} />
          }}/>
          <Route exact path="/schedule" render={() => {
            return <Schedule
              matches={matches}
              profile={profile}
              updateBet={this.bet} />
          }}/>
          <Route exact path="/user/:id" component={Results} />
          }} />
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
