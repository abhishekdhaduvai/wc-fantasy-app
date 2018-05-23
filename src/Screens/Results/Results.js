import React from 'react';
import axios from 'axios';

// import ResultMatchCard from '../web-components/ResultMatchCard';
// import MatchInProgress from '../web-components/MatchInProgress';

class Results extends React.Component {

  state = {
    matches: [],
    user: undefined,
  }

  componentDidMount() {
    // this.getMatches();
    this.getUser();
  }

  getMatches = () => {
    axios.get('/finished-matches')
    .then(res => {
      this.setState({ matches: res.data.reverse() });
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
    console.log(user);
    return (
      <div style={styles.container}>
        {user !== undefined && matches.map(match => (
          <div key={match.matchId.id}>
            {match.matchStatus ?
              <ResultMatchCard
                match={match}
                user={user}
              /> :
              <MatchInProgress
                match={match}
                user={user}
              />
            }
          </div>
        ))}
        {matches.length === 0 &&
          <p style={styles.msg}>
            There's nothing here yet
          </p>
        }
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