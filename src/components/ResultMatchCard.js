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

    var userBet = 'nobet';
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
    else if(match.result.goalsHomeTeam < match.result.goalsAwayTeam)
      winner = 'team2';
    else
      winner = 'draw';

    console.log(`${team1}vs${team2} winner = ${winner} bet = ${userBet}`)
    return (
      <div className="match-card">
        <div className="row-1">
          <div className="card-left no-padding">
            <div className='row2'>Bet on <strong>{userBet === 'team1' ? team1 : (
              userBet === 'team2' ? team2 : (
                userBet === 'draw' ? 'a draw' : 'neither'
                )
              )}</strong></div>
          </div>

          <div className='card-right'>
            <div>Points</div>
            <div className={userBet === winner ? 'win points' : 'loss points' }>
              {userBet === winner ?
                (userBet === 'draw' ? <span>+10</span> : <span>+5</span>) : (userBet === 'draw'? <span>-6</span>:-3)}
            </div>
          </div>

          <div
            className={userBet === 'team1' ? (userBet === winner ? 'winner team' : 'loser team'): 'team'}>
            <div className='team-name team-left'>{team1}</div>
            <div className={'logo '+team1}></div>
          </div>

          <div className={userBet === 'draw' ? winner === 'draw' ? 'winner vs' : 'loser vs' : 'vs'}>
            <div className='score'>{match.result.goalsHomeTeam} - {match.result.goalsAwayTeam}</div>
          </div>

          <div
            className={userBet === 'team2' ? (userBet === winner ? 'winner team' : 'loser team'): 'team'}>
            <div className={'logo '+team2}></div>
            <div className='team-name'>{team2}</div>
          </div>
        </div>
        <div className='row-2'>
          <span>Points: </span>
          <strong><span className={userBet === winner ? 'win points' : 'loss points' }>
              {userBet === winner ?
                (userBet === 'draw' ? <span>+10</span> : <span>+5</span>) : (userBet === 'draw'? <span>-6</span>:-3)}
            </span></strong>
        </div>
      </div>
    )
  }
}

export default ResultMatchCard;