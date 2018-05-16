import React from 'react';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import { Link } from 'react-router-dom';

const Links = () => {
  return(
    <div className='links'>
      <Link to='/home'><FlatButton className='link'>Home</FlatButton></Link>
      <Link to='/schedule'><FlatButton className='link'>Schedule</FlatButton></Link>
      <Link to='/results'><FlatButton className='link'>Results</FlatButton></Link>
    </div>
  )
}

const Menu = () => (
  <AppBar
    title={<div className='heading'>World Cup Fantasy League</div>}
    iconElementLeft={<div></div>}
    iconElementRight={<Links />}
    style={{ backgroundColor: 'rgb(58, 94, 147)' }}
  />
);

export default Menu;