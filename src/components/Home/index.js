import React from 'react';
import { GridList, GridTile } from 'material-ui/GridList';
import axios from 'axios';
import { Link } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import Particles from 'react-particles-js';
import 'react-toastify/dist/ReactToastify.min.css';
import DefaultProfiles from './DefaultProfiles';
import './landingpage.css';

class Home extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      dps: null,
      expert: false
    };
  }

  componentDidMount () {
    this.checkExpert();
    // this.getExperts();
    this.timeoutCheckExpert();
  }

  async getExperts () {
    const response = await axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/discussions/home`);
    if (response.data) {
      this.setState({ dps: response.data.slice(0, 4) });
    }
  }

  timeoutCheckExpert () {
    if (!this.state.expert) {
      window.setTimeout(() => {
        this.checkExpert();
      }, 2000);
    }
  }

  async checkExpert () {
    const { isAuthenticated } = this.props.auth;
    const { getAccessToken } = this.props.auth;
    if (isAuthenticated()) {
      this.setState({ isAuthenticated: true });
      const headers = { Authorization: `Bearer ${getAccessToken()}` };
      const response = await axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/isexpert`, { headers });
      if (response.data.expert) {
        this.setState({ expert: true });
      }
    }
  }

  render () {
    let link = <Link to="/newProfile" />;
    let label = 'Become a Dimpull Expert';
    const style = {
      marginTop: '30px', height: 'auto', lineHeight: '50px', display: 'flex', minWidth: '190px', float: 'left', marginRight: '4px'
    };
    if (this.state.isAuthenticated && this.state.expert) {
      link = <Link to="/profile" />;
      label = 'Edit Your Profile';
    }
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{height: '0'}} >
          <Particles 
            params={{
              particles: {
                "number": {
                  "value": 40,
                  "density": {
                    "enable": true,
                    "value_area": 800
                  }
                },
                "color": {
                  "value": "#268bd2"
                },
                "shape": {
                  "type": "circle",
                  "stroke": {
                    "width": 0,
                    "color": "#000000"
                  },
                  "polygon": {
                    "nb_sides": 5
                  },
                },
                "line_linked": {
                  "enable": true,
                  "distance": 150,
                  "color": "#268bd2",
                  "opacity": 0.4,
                  "width": 1
                },
                "move": {
                  "enable": true,
                  "speed": 2,
                  "direction": "none",
                  "random": false,
                  "straight": false,
                  "out_mode": "out",
                  "bounce": false,
                  "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                  }
                }
              },
            }}
            style={{
              width: '100%',
              height: '20px'
              // backgroundImage: `url(${logo})` 
            }}
          />
        </div>
        <section id="headerTop">

          <div className="row" id="headerRow">

            <div className="col-sm-6">

              <div id="head">
                <h1 id="exchange">Talk Before You Trade</h1>
                <h3 id="h3exchange">Have a 30 minute conversation with a blockchain expert</h3>
                <h3 id="h3exchange" className="secondH3">Book your call with Ethereum</h3>
                {!this.state.isAuthenticated ? (
                  <RaisedButton
                    onClick={() => this.props.auth.login('/newProfile')}
                    label="Become a Dimpull Expert"
                    primary
                    labelStyle={{ fontSize: '16px' }}
                    style={{
                      marginTop: '30px', height: 'auto', lineHeight: '50px', display: 'flex', minWidth: '190px', float: 'left', marginRight: '4px'
                    }}
                  />
                ) :
                  <RaisedButton
                    containerElement={link}
                    label={label}
                    primary
                    labelStyle={{ fontSize: '16px' }}
                    style={style}
                  />
                }
                <RaisedButton
                  containerElement={<Link to="/experts" />}
                  label="Meet the Experts"
                  secondary
                  labelStyle={{ fontSize: '16px' }}
                  style={{
                    marginTop: '30px', height: 'auto', lineHeight: '50px', minWidth: '190px', float: 'left'
                  }}
                />
              </div>
            </div>
            <div className="col-sm-6" id="colGrid">
              {this.state.dps ? (
                <GridList
                  id="GridlistID"
                  cols={2}
                  padding={20}
                  cellHeight={220}
                >
                  {this.state.dps.map(dp => (
                    <Link to={`/expert/${dp.url}`} key={dp.url}>
                      <GridTile
                        key={dp.id}
                        title={<span><b>{`${dp.first_name} ${dp.last_name}`}</b></span>}
                        subtitle={dp.description}
                      >
                        <img src={dp.image} alt={dp.id} />
                      </GridTile>
                    </Link>
                  ))}
                </GridList>
              ) : <DefaultProfiles />
              }
            </div>
          </div>
        </section>
        <div style={{ backgroundColor: '#f7f7f7', marginTop: '100px', marginBottom: this.state.expert ? '0px' : '100px' }}>
          <Divider style={{ marginTop: '30px', marginBottom: '30px' }} />
          <Paper id="help" zDepth={1}>
            <h2 id="howItWorks"> HOW IT WORKS </h2>
            <div className="row" id="helpRow">
              <div className="col-sm-3">
                <img src="https://res.cloudinary.com/dtvc9q04c/image/upload/c_scale,h_256/v1519824000/Expert_Icon.png" alt="expert" id="imgWorks" />
                <h3 id="hHelp">Find an Expert</h3>
                <p id="pHelp">
                  Browse our roster to find a crypto expert who matches your interests
                </p>
              </div>
              <div className="col-sm-3">
                <img src="https://res.cloudinary.com/dtvc9q04c/image/upload/c_scale,h_256/v1519824000/Calendar_Icon.png" alt="schedule "id="imgWorks" />
                <h3 id="hHelp">Schedule</h3>
                <p id="pHelp">Schedule a 30 minute call with an expert</p>
              </div>
              <div className="col-sm-3">
                <img src="https://res.cloudinary.com/dtvc9q04c/image/upload/c_scale,h_256/v1519824000/Phone_Icon.png" alt="phone" id="imgWorks" />
                <h3 id="hHelp">Have a Conversation</h3>
                <p id="pHelp">Get one-on-one personalized advice</p>
              </div>
              <div className="col-sm-3">
                <img src="https://res.cloudinary.com/dtvc9q04c/image/upload/c_scale,h_256/v1519824000/ETHExhange_Icon.png" alt="ether"id="imgWorks" />
                <h3 id="hHelp">Use the Blockchain</h3>
                <p id="pHelp">Our smart-contract holds Ether payments until the end of the call</p>
              </div>
            </div>
            <div style={{ fontSize: '19px', paddingTop: '12px' }} ><Link to="/faq">See the Full FAQs</Link></div>
          </Paper>
          <Divider style={{ marginTop: '30px', marginBottom: this.state.expert ? '0px' : '30px' }} />
        </div>
        {!this.state.expert && (
          <div>
            <h2 style={{ marginBottom: '20px' }}> Are You an Expert? </h2>
            <p id="pRegister"> Register to become a dimpull expert. If we think you're a good fit, we'll add you to our roster of verified experts, 
              so you can start connecting with crypto enthusiasts.
            </p>
            {!this.state.isAuthenticated && (
              <RaisedButton
                onClick={() => this.props.auth.login('/newProfile')}
                label="Become a Dimpull Expert"
                secondary
                style={{
                  marginTop: '30px', marginBottom: '30px', height: 'auto', lineHeight: '45px'
                }}
              />
            )}
            {this.state.isAuthenticated && (
              <RaisedButton
                containerElement={<Link to="/newProfile"  />}
                label="Become a Dimpull Expert"
                secondary
                style={{
                  marginTop: '30px', marginBottom: '30px', height: 'auto', lineHeight: '45px'
                }}
              />
            )}
          </div>
        )}
      </div>
    );
  }
}

Home.propTypes = {
  auth: PropTypes.shape({
    isAuthenticated: PropTypes.func,
    getAccessToken: PropTypes.func,
    login: PropTypes.func
  })
};

Home.defaultProps = {
  auth: PropTypes.object
};

export default Home;
