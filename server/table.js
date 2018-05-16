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
        let winner;
        let matchId = ''+match.matchday+match.homeTeamName+match.awayTeamName;

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
            users[id].points += 1;
            users[id].form.push('D');
          }
          // User gets points for the win
          else if(users[id].bets[matchId].team === winner) {
            users[id] += 5;
            users[id].form.push('W');
            users[id].wins++;
          }
          // User loses points for the loss
          else {
            users[id] -= 3;
            users[id].form.push('L');
          }
        }

      });
    }
  });
}

const getTable = (users, table) => {
  Object.keys(users).forEach(id => {
    let temp = {};
    temp.name = users[id].name || users[id].email;
    temp.points = users[id].points || 0;
    temp.wins = users[id].wins || 0;
    temp.form = users[id].form || [];
    table.push(temp);
  });
}

module.exports = {
  calculatePoints,
  getTable
}