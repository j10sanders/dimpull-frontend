import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';
import Particles from 'react-particles-js';
import axios from 'axios';
import PropTypes from 'prop-types';
import history from '../../history';
import './header.css';

class Header extends Component {
  constructor (props) {
    super(props);
    this.state = {
      open: false,
      picture: null
    };
  }

  componentWillMount () {
    this.getProfile();
  }

  componentDidMount () {
    this.timeOutPic();
  }

  componentWillReceiveProps (nextProps, nextContext) {
    if (nextProps.location.pathname === '/' && this.props.location.pathname === '/login') {
      this.getProfile();
    }
    if (!this.state.picture) {
      this.getProfile();
    }
  }

  getProfile () {
    const { isAuthenticated } = this.props.auth;
    if (isAuthenticated()) {
      this.setState({ isAuthenticated: true }, () => {
        const { userProfile, getProfile } = this.props.auth;
        if (!userProfile) {
          getProfile((err, profile) => {
            if (profile) {
              this.setState({ picture: profile.picture });
            } else {
              this.getPicFromServer();
            }
          });
        } else {
          this.setState({ picture: userProfile.picture });
        }
      });
    } else {
      this.setState({ picture: null, isAuthenticated: false });
    }
  }

  async getPicFromServer () {
    const { getAccessToken } = this.props.auth;
    if (this.state.isAuthenticated) {
      const headers = { Authorization: `Bearer ${getAccessToken()}` };
      const response = await axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/isexpert`, { headers });
      if (response.data.pic) {
        this.setState({ picture: response.data.pic });
      }
    }
  }

  timeOutPic () {
    if (!this.state.picture) {
      window.setTimeout(() => {
        this.getProfile();
      }, 2000);
    }
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

  render () {
    return (
      <div >
        <header>
          <Drawer
            open={this.state.open}
            docked={false}
            onRequestChange={open => this.setState({ open })}
          >
            <div>
              <MenuItem
                containerElement={<Link to="/newProfile"  />}
                onClick={() => this.setState({ open: false })}
              >
                Become a Dimpull Expert
              </MenuItem>
              <MenuItem
                containerElement={<Link to="/login" />}
                onClick={() => this.setState({ open: false })}
              >
                {this.state.isAuthenticated ? `Log Out` : `Login` }
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
          </Drawer>
          <AppBar
            style={{ position: 'fixed' }}
            title={
              <img
                src="https://res.cloudinary.com/dtvc9q04c/image/upload/v1523982285/Dimpull_LogoName_wg.png"
                style={{
                  cursor: 'pointer',
                  width: '120px',
                  height: 'auto',
                  imageRendering: 'crisp-edges'
                }}
                alt="logo"
              />}
            onTitleClick={() => history.push('/')}
            onLeftIconButtonClick={() => this.openNav()}
            iconElementRight={
              <Link to={'/profile'} >
                {!this.state.picture
                  ? <FlatButton
                    label={<img
                      src="https://res.cloudinary.com/dtvc9q04c/image/upload/v1519823675/orangemagnet-48.png"
                      style={{ width: '40px', height: 'auto' }}
                      alt="logo"
                    />}
                    id="home"
                  />
                  : <div style={{ paddingTop: '5px', paddingRight: '15px' }}>
                    {this.state.picture.startsWith('https://s.gravatar.com/avatar') ? <i className="far fa-user fa-2x" style={{ marginTop: '6px' }} /> :
                      <div>
                        <Avatar src={this.state.picture} style={{ border: 0, objectFit: 'cover' }} />
                        <i style={{ marginLeft: '12px', color: 'white', marginBottom: '-5px', fontSize: '22px' }} className="fas fa-angle-down" />
                      </div>
                    }
                  </div>
                }
              </Link>
            }
          />
        </header>
        {this.props.location.pathname === '/' &&
        <div id="patriclemargin">
          <Particles
            height='70px'
            params={{
              particles: {
                number: {
                  value: 10,
                  density: {
                    enable: true,
                    value_area: 100
                  }
                },
                line_linked: {
                  enable: true,
                  distance: 150,
                  color: '#268bd2',
                  opacity: 0.4,
                  width: 1
                },
                move: {
                  enable: true,
                  speed: 0.5,
                }
              },
              interactivity: {
                detect_on: 'canvas',
                events: {
                  onhover: {
                    enable: true,
                    mode: 'grab'
                  },
                  onclick: {
                    enable: true,
                    mode: 'push'
                  },
                  resize: true
                },

              }
            }}
          />
        </div>
      }
      </div>
    );
  }
}

Header.propTypes = {
  auth: PropTypes.shape({
    isAuthenticated: PropTypes.func,
    getAccessToken: PropTypes.func,
    login: PropTypes.func
  })
};

Header.defaultProps = {
  auth: PropTypes.object
};

export default Header;
