import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';
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
    console.log(nextProps, "NEXTPROPS")
    if (nextProps.location.pathname === '/' && this.props.location.pathname === '/login') {
      this.getProfile();
    }
    if (!this.state.picture) {
      this.getProfile();
    }
  }

  async getProfile () {
    await this.props.auth.renewToken();
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
      }, 1000);
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
              src={(window.screen.width > 437) ? 'https://res.cloudinary.com/dtvc9q04c/image/upload/v1526318315/Dimpull_LogoName_wg_Launch.png' : 'https://res.cloudinary.com/dtvc9q04c/image/upload/v1526318762/Dimpull_LogoName_wg_Launch_under.png'}
              style={(window.screen.width > 437) ? {
                cursor: 'pointer',
                width: '280px',
                height: 'auto',
                imageRendering: 'crisp-edges'
              } : {
                cursor: 'pointer',
                width: '200px',
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
                  {this.state.picture === 'https://s.gravatar.com/avatar/b7eb0bea5420aa6a566d3cebe69e2a15?s=480&r=pg&d=none' ? <i className="far fa-user fa-2x" style={{ marginTop: '6px' }} /> :
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
