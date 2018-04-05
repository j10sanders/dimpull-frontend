import React from 'react';
import { GridList, GridTile } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import './landingpage.css';

class Home extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      dps: null
    };
  }

  componentDidMount () {
    const { isAuthenticated } = this.props.auth;
    const { getAccessToken } = this.props.auth;
    if (isAuthenticated()) {
      const headers = { 'Authorization': `Bearer ${getAccessToken()}` };
      axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/discussions`, { headers })
        .then(response =>
          this.setState({ dps: response.data.slice(0, 4) }))
        .catch(error => console.log(error));
    } else {
      axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/discussions`)
        .then(response =>
          this.setState({ dps: response.data.slice(0, 4) }))
        .catch(error => console.log(error));
    }
  }

  render () {
    const { isAuthenticated } = this.props.auth;
    return (
      <div style={{ textAlign: 'center' }}>
        <section id="headerTop">
          <div className="row" id='headerRow'>
            <div className="col-sm-6">
              <div id="head">
                <h1 id="exchange">Exchange your crypto knowledge for ETH</h1>
                <h3 id="h3exchange">Connect with new crypto traders and get paid for your time</h3>
                <h3 id="h3exchange">Guaranteed by the Ethereum blockchain</h3>
                {!isAuthenticated() && (
                  <RaisedButton
                    onClick={() => this.props.auth.login('/newProfile')}
                    label="Become a Dimpull Expert"
                    secondary
                    labelStyle={{ fontSize: '18px' }}
                    style={{
                      marginTop: '80px', height: 'auto', lineHeight: '50px', display: 'flex', maxWidth:'300px', minWidth: '255px'
                    }}
                  />
                )}
                {isAuthenticated() && (
                  <RaisedButton
                    containerElement={<Link to="/newProfile"  />}
                    label="Become a Dimpull Expert"
                    secondary
                    style={{
                      marginTop: '80px', height: 'auto', lineHeight: '50px', display: 'flex', maxWidth: '230px', minWidth: '175px' 
                    }}
                  />
                )}
              </div>
            </div>
            <div className="col-sm-6" id="colGrid">
              {this.state.dps && (
                <GridList
                  id="GridlistID"
                  cols={2}
                  padding={20}
                  cellHeight={240}
                >
                  {this.state.dps.map(dp => (
                    <Link to={`/expert/${dp.url}`} key={dp.url}>
                      <GridTile
                        key={dp.id}
                        title={<span><b>{`${dp.first_name} ${dp.last_name}`}</b></span>}
                        subtitle={dp.description}
                        actionIcon={<IconButton></IconButton>}
                      >
                        <img src={dp.image} alt={dp.id} />
                      </GridTile>
                    </Link>
                  ))}
                </GridList>
              )}
              {!this.state.dps && (
                <CircularProgress size={80} thickness={5} /> 
              )}
            </div>
          </div>
        </section>
        <div style={{ backgroundColor: '#f7f7f7', marginTop: '100px', marginBottom: '100px' }}>
          <Divider style={{ marginTop: '30px', marginBottom: '30px' }} />
          <Paper id="help" zDepth={1}>
            <h2 id="howItWorks"> HOW IT WORKS </h2>
            <div className="row" id="helpRow">
              <div className="col-sm-3">
                <img src="https://res.cloudinary.com/dtvc9q04c/image/upload/v1519824000/Expert_Icon.png" alt="expert" id="imgWorks" />
                <h3 id="hHelp">Find an Expert</h3>
                <p id="pHelp">
                  Browse our roster to find a crypto expert who matches your interests
                </p>
              </div>
              <div className="col-sm-3">
                <img src="https://res.cloudinary.com/dtvc9q04c/image/upload/v1519824000/Calendar_Icon.png" alt="schedule "id="imgWorks" />
                <h3 id="hHelp">Schedule</h3>
                <p id="pHelp">Schedule a 30 minute call with an expert</p>
              </div>
              <div className="col-sm-3">
                <img src="https://res.cloudinary.com/dtvc9q04c/image/upload/v1519824000/Phone_Icon.png" alt="phone" id="imgWorks" />
                <h3 id="hHelp">Have a Conversation</h3>
                <p id="pHelp">Get one-on-one personalized advice</p>
              </div>
              <div className="col-sm-3">
                <img src="https://res.cloudinary.com/dtvc9q04c/image/upload/v1519824000/ETHExhange_Icon.png" alt="ether"id="imgWorks" />
                <h3 id="hHelp">Use the Blockchain</h3>
                <p id="pHelp">Our smart-contract holds Ether payments until the end of the call</p>
              </div>
            </div>
          </Paper>
          <Divider style={{ marginTop: '30px', marginBottom: '30px' }} />
        </div>
        <h2 style={{ marginBottom: '20px' }}> Are You an Expert? </h2>
        <p id="pRegister"> Register to become a dimpull expert. If we think you're a good fit, we'll add you to our roster of verified experts, 
          so you can start connecting with Crypto enthusiasts.
        </p>
        {!isAuthenticated() && (
          <RaisedButton
            onClick={() => this.props.auth.login('/newProfile')}
            label="Become a Dimpull Expert"
            secondary
            style={{
              marginTop: '30px', marginBottom: '30px', height: 'auto', lineHeight: '45px'
            }}
          />
        )}
        {isAuthenticated() && (
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
    );
  }
}

export default Home;
