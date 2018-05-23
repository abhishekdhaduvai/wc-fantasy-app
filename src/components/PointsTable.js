import React from 'react';
import axios from 'axios';

import '../css/points-table.css';

class PointsTable extends React.Component {

  render(){
    const { table, goToProfile } = this.props;
    table.sort((a, b) => {
      return b.points - a.points;
    });

    return (
      <div className='container'>
        <table>
          <thead>
            <tr>
              <th className='id'>Pos</th>
              <th className='name' style={{textAlign: 'left'}}>Player</th>
              <th className='general'>Pld</th>
              <th className='general'>Won</th>
              <th className='general'>Lost</th>
              <th className='general'>Drew</th>
              <th className='general'>Pts</th>
              {/* <th className='form'>Last 5 Games</th> */}
            </tr>
          </thead>
          <tbody>
            {table.map((player, pos) => (
              <tr key={pos}>
                <td className='id'>{pos+1}</td>
                <td className='name' onClick={e => goToProfile(player)}>{player.name ||  player.email}</td>
                <td className='general'>{player.form.length}</td>
                <td className='general'>{player.wins}</td>
                <td className='general'>{player.losses}</td>
                <td className='general'>{player.draws}</td>
                <td className='general'>{player.points}</td>
                {/* <td className='form'>
                  {player.form.slice(player.form.length > 5 ? player.form.length-5 : 0).map((res, i) => (
                    <div key={i} className={'form '+res}>{res}</div>
                  ))}
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}

export default PointsTable;