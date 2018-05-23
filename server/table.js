const calculatePoints = (users, matches) => {
  /*
   * Loop over the matches.
   * If the match is over, loop over users.
   * If the user has a bet on the current match, check for win/loss/draw.
   * Assign points, wins, form for each user that has a bet on the current match.
  */
  matches[0].forEach(match => {
    if(match.result.goalsHomeTeam !== null) {
      Object.keys(users).forEach(id => {
        var winner;
        var matchId = ''+match.matchday+match.homeTeamName+match.awayTeamName;

        if(users[id].bets && users[id].bets[matchId]) {

          if(match.result.goalsHomeTeam > match.result.goalsAwayTeam) {
            winner = 'team1';
          }
          else if(match.result.goalsHomeTeam < match.result.goalsAwayTeam) {
            winner = 'team2';
          }
          else {
            winner = null;
          }

          // User gets points for a draw
          if(winner === null) {
            users[id].bets[matchId].result = 'draw';
          }
          // User gets points for the win
          else if(users[id].bets[matchId].team === winner) {
            users[id].bets[matchId].result = 'win';
          }
          // User loses points for the loss
          else {
            users[id].bets[matchId].result = 'loss';
          }
        }
      });
    }
  });
}

const getTable = (users, table) => {

  Object.keys(users).forEach(id => {
    var temp = {};
    temp.id = users[id].id;
    temp.name = users[id].name || users[id].email;
    temp.points = 0;
    temp.wins = 0;
    temp.losses = 0;
    temp.draws = 0;
    temp.form = [];

    Object.keys(users[id].bets).forEach(bet => {
      if(users[id].bets[bet].result === 'win') {
        temp.points += 5;
        temp.wins += 1;
        temp.form.push('W')
      }
      else if(users[id].bets[bet].result === 'loss') {
        temp.points -= 3;
        temp.losses += 1;
        temp.form.push('L');
      }
      else if(users[id].bets[bet].result === 'draw') {
        temp.points += 1;
        temp.draws += 1;
        temp.form.push('D');
      }
    });

    table.push(temp);
    console.log('TABLE\n', table);

  });
}

module.exports = {
  calculatePoints,
  getTable
}