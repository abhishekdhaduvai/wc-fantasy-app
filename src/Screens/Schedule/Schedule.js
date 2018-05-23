import React from 'react';
import axios from 'axios';

import MatchCard from '../../components/MatchCard';

import './schedule.css'

class Schedule extends React.Component {

  render(){
    const { matches, profile, updateBet } = this.props;
    return (
      <div style={styles.container}>
        {matches.map((match, i) => (
          <div key={i} className='match-card-container'>
            {match.homeTeamName.length > 0 &&
              <MatchCard
                id = {i}
                matchId = {''+match.matchday+match.homeTeamName+match.awayTeamName}
                date = {match.date}
                team1 = {match.homeTeamName}
                team2 = {match.awayTeamName}
                bet = {match.bet}
                newBet = {updateBet}
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