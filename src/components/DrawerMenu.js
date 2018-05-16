import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import { Link } from 'react-router-dom';

export default class DrawerMenu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  handleToggle = () => this.setState({open: !this.state.open});

  handleClose = () => this.setState({open: false});

  render() {
    return (
      <div>
        <AppBar
          iconElementLeft={
            <IconButton>
              <NavigationClose onClick={this.handleToggle}/>
            </IconButton>
          }
          style={{ backgroundColor: 'rgb(58, 94, 147)' }}
        />

        <Drawer
          docked={false}
          width={200}
          open={this.state.open}
          onRequestChange={(open) => this.setState({open})}
        >
          <MenuItem onClick={this.handleClose}>
            <Link to='/home'>Home</Link>
          </MenuItem>
          <MenuItem onClick={this.handleClose}>
            <Link to='/schedule'>Schedule</Link>
          </MenuItem>
          <MenuItem onClick={this.handleClose}>
            <Link to='/results'>Results</Link>
          </MenuItem>
        </Drawer>
      </div>
    );
  }
}