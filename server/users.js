const AWS = require('aws-sdk');
const credentials = require('./credentials');

var node_env = process.env.node_env || 'development';
if (node_env === 'development') {
  var devConfig = require('./localConfig.json')[node_env];
}

AWS.config.update({
  accessKeyId: credentials.aws.accessKeyId,
  secretAccessKey: credentials.aws.secretAccessKey,
  region:'us-west-1'
});

const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

const users = {};
let getNew = true;

const shouldGetNewUsers = () => {
  return getNew;
}

const getUsers = () => {
  const params = {
    TableName: devConfig ? devConfig.usersTable : process.env.usersTable,
    ReturnConsumedCapacity: 'TOTAL'
  };

  dynamodb.scan(params, (err, data) => {
    if(err) console.log(err);
    else {
      console.log('Got new Users');
      data.Items.forEach(item => {
        users[item.id.S] = {};
        users[item.id.S].id = item.id.S;
        users[item.id.S].email = item.email.S;
        users[item.id.S].name = item.name.S;
        users[item.id.S].points = Number(item.points.N);
        users[item.id.S].bets = {};
        users[item.id.S].form = [];
        users[item.id.S].wins = 0;

        // Temporary Object to break down DynamoDB item to JSOn
        let bets = item.bets.M;
        Object.keys(bets).forEach(key => {
          users[item.id.S].bets[key] = {};
          users[item.id.S].bets[key] = bets[key].M;
          users[item.id.S].bets[key].team = bets[key].M.team.S;
          users[item.id.S].bets[key].teamName = bets[key].M.teamName.S;
          try {
            users[item.id.S].bets[key].result = bets[key].M.result.S;
          } catch(e) {}
        });
      });
      getNew = false;
    }
  });
}

const updateUserDB = (userId) => {
  const params = {
    TableName: devConfig ? devConfig.usersTable : process.env.usersTable,
    ReturnConsumedCapacity: 'TOTAL',
  };

  let Item = {
    id: {S: users[userId].id},
    email: {S: users[userId].email},
    name: {S: users[userId].name || users[userId].email},
    points: {N: users[userId].points.toString()},
    bets: {M: {}}
  }

  Object.keys(users[userId].bets).forEach(key => {
    Item.bets.M[key] = {};
    Item.bets.M[key].M = {};
    Item.bets.M[key].M.team = {};
    Item.bets.M[key].M.team.S = users[userId].bets[key].team;
    Item.bets.M[key].M.teamName = {};
    Item.bets.M[key].M.teamName.S = users[userId].bets[key].teamName;
  });

  params.Item = Item;

  dynamodb.putItem(params, (err, data) => {
    if(err) {
      console.log('**********************');
      console.log('ERROR UPDATING USER DB');
      console.log(err);
      console.log('**********************');
    }
  });
}

const addBet = (userId, matchId, team, teamName) => {
  if(!users[userId].bets[matchId]) {
    users[userId].bets[matchId] = {};
    users[userId].bets[matchId].team = team;
    users[userId].bets[matchId].teamName = teamName;
  } else {
    if(users[userId].bets[matchId].team === team) {
      delete users[userId].bets[matchId];
    }
    else {
      users[userId].bets[matchId].team = team;
      users[userId].bets[matchId].teamName = teamName;
    }
  }

  // Update the DB on AWS
  return updateUserDB(userId);
}

const reset = () => {
  Object.keys(users).forEach(id => {
    users[id].points = 0;
    users[id].wins = 0;
    users[id].form = [];
  })
}

const create = (user) => {
  users[user.id] = {};
  users[user.id].id = user.id;
  users[user.id].name = user.name || user.email;
  users[user.id].email = user.email;
  users[user.id].points = 0;
  users[user.id].wins = 0;
  users[user.id].bets = user.bets || {};
  users[user.id].form = [];
}

const findOrCreate = (user) => {
  if(users[user.id] === undefined) {
    create(user);
  }
}

module.exports = {
  findOrCreate,
  addBet,
  users,
  reset,
  getUsers,
  shouldGetNewUsers,
}
