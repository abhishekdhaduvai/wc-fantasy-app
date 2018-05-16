import React from 'react';
import moment from 'moment';
import 'countdown';
import 'moment-countdown';
import '../teams.css';
import '../css/match-card.css';

class MatchCard extends React.Component {
  render() {
    const {
      id,
      matchId,
      team1,
      team2,
      date,
      bet,
      newBet,
      profile } = this.props;
      var userBet = ''

      if(bet === undefined) {
        if(profile.bets && profile.bets[matchId] !== undefined) {
          userBet = profile.bets[matchId].team;
        }
      } else {
        userBet = bet;
      }

    return (
      <div>
      {
        (moment(date)-60*60*1000)/1000 > Date.now()/1000 &&
        <div className="match-card">
          <div className="card-left">
            <div className='row1'>Selection for this match will close</div>
            <div className='row2'><strong>{moment(moment(date) - 60*60*1000).fromNow()}</strong></div>
          </div>

          <div
            className={
              userBet === 'team1'?'active1 team team1':'team team1'
            }
            onClick={e => newBet(id, matchId, 'team1', team1)}>
            <div className='team-name'>{team1}</div>
            <div className={'logo '+team1}></div>
          </div>

          <div className='vs'>vs</div>

          <div
            className={
              userBet === 'team2'?'active2 team team2':'team team2'
            }
            onClick={e => newBet(id, matchId, 'team2', team2)}>
            <div className={'logo '+team2}></div>
            <div className='team-name'>{team2}</div>
          </div>
        </div>
      }
      </div>
    )
  }
}

export default MatchCard;