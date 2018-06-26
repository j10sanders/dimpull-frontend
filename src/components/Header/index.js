import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'; //Have to use @material-ui's because drawer and header are updated for react 16
import MenuIcon from '@material-ui/icons/Menu';
import history from '../../history';
import './header.css';

const theme = createMuiTheme();

class Header extends Component {
  static onMouseEnter () {
    const x = window.document.getElementsByClassName('fa-angle-down');
    x[0].style.color = 'gray';
  }

  static onMouseLeave () {
    const x = window.document.getElementsByClassName('fa-angle-down');
    x[0].style.color = 'white';
  }
  constructor (props) {
    super(props);
    this.state = {
      open: false,
      over: false
    };
  }

  handleClickOutside () {
    this.setState({
      open: false
    });
  }

  openNav () {
    this.setState({
      open: true
    });
  }

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };
  
  render () {
    const fullList = (
      <div>
        {!this.props.picture && <MenuItem
          containerElement={<Link to="/newProfile"  />}
          onClick={() => this.setState({ open: false })}
        >
          Become a Dimpull Expert
        </MenuItem>
      }
        <MenuItem
          containerElement={<Link to="/login" />}
          onClick={() => this.setState({ open: false })}
        >
          {this.props.isAuthenticated ? `Log Out` : `Login` }
        </MenuItem>
        <MenuItem
          containerElement={<Link to="/experts" />}
          onClick={() => this.setState({ open: false })}
        >
          Meet the Experts
        </MenuItem>
        <MenuItem
          containerElement={<Link to="/faq" />}
          onClick={() => this.setState({ open: false })}
        >
          FAQs
        </MenuItem>
      </div>
    )
    
    return (
      <MuiThemeProvider theme={theme}>
        <header>
          <Drawer open={this.state.left} onClose={this.toggleDrawer('left', false)}>
            <div
              tabIndex={0}
              role="button"
              onClick={this.toggleDrawer('left', false)}
              onKeyDown={this.toggleDrawer('left', false)}
            >
              {fullList}
            </div>
          </Drawer>
          <AppBar
            style={{ position: 'fixed', boxShadow: 'none', opacity: '.9', background: '#629EF9' }}
            title={
              <img
                src="https://res.cloudinary.com/dtvc9q04c/image/upload/q_100/v1527550775/Dimpull_LogoName_ww.png"
                style={{
                  cursor: 'pointer',
                  width: '120px',
                  height: 'auto',
                  imageRendering: 'crisp-edges',
                  marginTop: '-6px', 
                  marginBottom: '-6px'
                }}
                alt="logo"
              />}
            onTitleClick={() => history.push('/')}
            iconElementLeft={<Button onClick={this.toggleDrawer('left', true)} style={{color: 'white', marginTop: '4px'}}><MenuIcon style={{color: 'white'}} /></Button>}
            iconElementRight={
              <Link to={'/profile'} style={{ marginTop: '-12px', marginBottom: '-6px'}}>
                {!this.props.picture
                  ? <FlatButton
                    label={<img
                      src="https://res.cloudinary.com/dtvc9q04c/image/upload/v1519823675/orangemagnet-48.png"
                      style={{ width: '40px', height: 'auto', cursor: 'pointer', marginTop: '-6px', marginBottom: '-6px'}}
                      alt="logo"
                    />}
                    id="home"
                  />
                  : <div style={{ paddingTop: '5px', paddingRight: '15px' }}>
                    {this.props.picture.startsWith('https://s.gravatar.com/avatar') ? <i className="far fa-user fa-2x" style={{ marginTop: '6px' }} /> :
                      <div onMouseOver={() => Header.onMouseEnter()}  onMouseOut={() => Header.onMouseLeave()}>
                        <Avatar src={this.props.picture} style={{ border: 0, objectFit: 'cover' }} />
                        <i style={{ marginLeft: '12px', marginBottom: '-5px', fontSize: '22px' }} className="fas fa-angle-down" />
                      </div>
                    }
                  </div>
                }
              </Link>
            }
          />
        </header>
      </MuiThemeProvider>
    );
  }
}

Header.propTypes = {
  picture: PropTypes.string,
  isAuthenticated: PropTypes.bool
};

Header.defaultProps = {
  picture: '',
  isAuthenticated: false
};

export default Header;



