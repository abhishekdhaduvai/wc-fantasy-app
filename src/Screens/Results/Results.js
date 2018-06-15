import React from 'react';
import axios from 'axios';

import ResultMatchCard from '../../components/ResultMatchCard';
// import MatchInProgress from '../web-components/MatchInProgress';

class Results extends React.Component {

  state = {
    matches: [],
    user: undefined,
  }

  componentDidMount() {
    this.getMatches();
  }

  getMatches = () => {
    axios.get('/matches')
    .then(res => {
      this.setState({ matches: res.data[0].reverse() });
      this.getUser();
    })
    .catch(err => {
      console.log('err ', err);
    });
  }

  getUser = () => {
    axios.get('/profile', {
      params: {
        id: this.props.match.params.id
      }
    })
    .then(res => {
      this.setState({ user: res.data });
    })
    .catch(err => {
      console.log('err ', err);
    })
  }

  render(){
    const { matches, user } = this.state;

    return (
      <div style={styles.container}>
        {user !== undefined && matches.map((match, i) => (
          <div key={i}>
            {match.result.goalsHomeTeam !== null &&
              <ResultMatchCard
                matchId = {''+match.matchday+match.homeTeamName+match.awayTeamName}
                match={match}
                bet = {match.bet}
                team1 = {match.homeTeamName}
                team2 = {match.awayTeamName}
                user={user}
              />
            }
          </div>
        ))}
      </div>
    )
  }
}

const styles = {
  container: {
    flex: 1,
    background: 'white',
  },
  msg: {
    textAlign: 'center',
    marginTop: '3em'
  }
}

export default Results;