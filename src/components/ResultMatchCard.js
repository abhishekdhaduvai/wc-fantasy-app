import React from 'react';

class ResultMatchCard extends React.Component {
  render() {
    const {
      match,
      matchId,
      team1,
      team2,
      bet,
      user } = this.props;

    var userBet = '';
    var winner = '';

    if(bet === undefined) {
      if(user.bets && user.bets[matchId] !== undefined) {
        userBet = user.bets[matchId].team;
      }
    } else {
      userBet = bet;
    }

    if(match.result.goalsHomeTeam > match.result.goalsAwayTeam)
      winner = 'team1';
    else if(match.result.goalsHomeTeam > match.result.goalsAwayTeam)
      winner = 'team2';
    else
      winner = 'draw';

    return (
      <div className="match-card">
        <div className="row-1">
          <div className="card-left">
            <div className='row2'>You bet on <strong>{userBet === 'team1' ? team1 : userBet === 'team2' ? team2 : 'a draw'}</strong></div>
          </div>

          {userBet !== '' &&
            <div className='card-right'>
              <div>Points</div>
              <div className={userBet === winner ? 'win points' : 'loss points' }>
                {userBet === winner ?
                  (userBet === 'draw' ? <span>+10</span> : +5) : (userBet === 'draw'? <span>-6</span>:-3)}
              </div>
            </div>
          }

          <div
            className={userBet === 'team1' ? (userBet === winner ? 'winner team' : 'loser team'): 'team'}>
            <div className='team-name team-left'>{team1}</div>
            <div className={'logo '+team1}></div>
          </div>

          <div className='vs'>
            <div className='score'>{match.result.goalsHomeTeam} - {match.result.goalsAwayTeam}</div>
          </div>

          <div
            className={userBet === 'team2' ? (userBet === winner ? 'winner team' : 'loser team'): (winner === 'team2'? 'loser team' : 'team')}>
            <div className={'logo '+team2}></div>
            <div className='team-name'>{team2}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default ResultMatchCard;