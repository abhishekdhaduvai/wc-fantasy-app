import React from 'react';
import axios from 'axios';

import MatchCard from '../../components/MatchCard';

import './schedule.css'

class Schedule extends React.Component {

  state = {
    matches: []
  }

  componentDidMount() {
    axios.get('/matches')
    .then(res => {
      this.setState({ matches: res.data[0] });
    })
    .catch(err => {
      this.setState({ error: 'Error getting fixtures'});
      console.log(err);
    });
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
    .catch('error placing bet');
  }

  render(){
    const { matches } = this.state;
    const { profile, bet } = this.props;
    return (
      <div style={styles.container}>
        {matches.map((match, i) => (
          <div key={i}>
            {match.homeTeamName.length > 0 &&
              <MatchCard
                id = {i}
                matchId = {''+match.matchday+match.homeTeamName+match.awayTeamName}
                date = {match.date}
                team1 = {match.homeTeamName}
                team2 = {match.awayTeamName}
                bet = {match.bet}
                newBet = {this.bet}
                profile = {profile}
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
    background: '#fff',
  },
}

export default Schedule;