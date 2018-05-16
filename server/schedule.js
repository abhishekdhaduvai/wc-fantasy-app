const axios = require('axios');
const credentials = require('./credentials');

// if running locally, set up proxies from local config file:
var node_env = process.env.node_env || 'development';
if (node_env === 'development') {
  var devConfig = require('./localConfig.json')[node_env];
}

const api = devConfig ? devConfig.api : process.env.API;

const getMatches = (matches) => {
  return new Promise((resolve, reject) => {
    const headers = {
      'X-Auth-Token': credentials.apiKey
    }

    axios.get(api, {headers})
    .then(res => {
      matches.push(res.data.fixtures);
      return resolve(true);
    })
    .catch(err => {
      console.log('ERROR GETTING FIXTURES');
      console.log(err);
      return resolve(false);
    });
  });
}

module.exports = {
  getMatches
}