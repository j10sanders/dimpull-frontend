import React from 'react';
import { GridList, GridTile } from 'material-ui/GridList';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import axios from 'axios';
import { Link } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import 'react-toastify/dist/ReactToastify.min.css';
import DefaultProfiles from './DefaultProfiles';
import './landingpage.css';

class Home extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      dps: null,
      email: '',
      emailSubmitted: false,
      expert: false
    };
  }

  componentDidMount () {
    this.checkExpert();
    this.getExperts();
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
      }, 1000);
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

  changeEmail (e) {
    this.setState({ email: e.target.value });
  }

  async submitEmail () {
    try {
      await axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/addemail`, {
        email: this.state.email
      });
    } catch (err) {
      this.setState({ emailSubmitted: true });
    }
    this.setState({ emailSubmitted: true });
  }


  render () {
    let link = <Link to="/newProfile" />;
    let label = 'Become a Dimpull Expert';
    const style = {
      marginTop: '8px', height: 'auto', lineHeight: '50px', display: 'flex', minWidth: '190px', float: 'left', marginRight: '4px'
    };
    if (this.state.isAuthenticated && this.state.expert) {
      link = <Link to="/profile" />;
      label = "Edit Your Profile";
    }
    return (
      <div style={{ textAlign: 'center' }}>
        <section id="headerTop">
          <div className="row" id="headerRow">
            <div className="col-sm-6">
              <div id="head">
                <h1 id="exchange">Exchange your crypto knowledge for ETH</h1>
                <h3 id="h3exchange">Connect with new crypto traders and blockchain enthusiasts, and get paid for your time</h3>
                <h3 id="h3exchange" className="secondH3">Guaranteed by the Ethereum blockchain</h3>
                {!this.state.isAuthenticated ? (
                  <RaisedButton
                    onClick={() => this.props.auth.login('/newProfile')}
                    label="Become a Dimpull Expert"
                    primary
                    labelStyle={{ fontSize: '16px' }}
                    style={{
                      marginTop: '8px', height: 'auto', lineHeight: '50px', display: 'flex', minWidth: '190px', float: 'left', marginRight: '4px'
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
                    marginTop: '8px', height: 'auto', lineHeight: '50px', minWidth: '190px', float: 'left'
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
        <div style={{ backgroundColor: '#f7f7f7', marginTop: '100px', marginBottom: '100px' }}>
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
          <Divider style={{ marginTop: '30px', marginBottom: '30px' }} />
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
        <div style={{ backgroundColor: '#efefef', marginTop: this.state.expert ? '-100px' : '100px' }}>
          <Divider style={{ marginTop: '30px', marginBottom: '30px' }} />
          <Paper id="email" zDepth={0} style={{ backgroundColor: '#efefef' }}>
            {!this.state.expert && (<h2 style={{ marginBottom: '20px', paddingTop: '35px' }}> Ready to Connect with an Expert? </h2>)}
            <p id="pRegister">Dimpull will be live in the next couple weeks.  To be notified of our launch, leave your email below (we promise no spam):
            </p>
            {!this.state.emailSubmitted ? (
              <div style={{ paddingBottom: '50px' }}>
                <TextField
                  floatingLabelText="Email"
                  type="email"
                  value={this.state.email}
                  style={{ marginTop: '-20px' }}
                  onChange={e => this.changeEmail(e)}
                />
                <FlatButton
                  label="Submit"
                  primary
                  onClick={() => this.submitEmail()}
                />
              </div>
            ) : <div style={{ paddingBottom: '50px' }}>Thanks!  We'll let you know soon!</div>
            }
          </Paper>
        </div>
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
