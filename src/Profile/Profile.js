import React from 'react';
import { List, ListItem } from 'material-ui/List';
import { Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import Snackbar from 'material-ui/Snackbar';
import { Card, CardActions, CardText } from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import axios from 'axios';
import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';
import 'react-awesome-button/dist/themes/theme-blue.css';
import history from './../history';
import './Profile.css';

class Profile extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      vipupdated: false,
      url: null,
      waiting: true,
      notExpert: false
    };
  }

  componentDidMount () {
    this.getUrl();
  }

  async getUrl () {
    const { isAuthenticated } = this.props.auth;
    const { getAccessToken } = this.props.auth;
    let headers = {};
    if (isAuthenticated()) {
      headers = { Authorization: `Bearer ${getAccessToken()}` };
      const response = await axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/geturl`, { headers });
      if (response.data.url) {
        if (!response.data.expert) {
          history.push('/editProfile');
        }
        this.setState({ url: response.data.url, waiting: false, referral: response.data.referral, vip: response.data.vip });
      } else {
        this.setState({ notExpert: true, waiting: false });
      }
    } else {
      this.props.auth.login('/profile');
    }
  }

  handleRequestClose () {
    this.setState({ vipupdated: false });
  }

  handleExpand (e) {

    this.setState({ [e]: true });
  }

  async newVipId () {
    const { isAuthenticated } = this.props.auth;
    const { getAccessToken } = this.props.auth;
    let headers = {};
    if (isAuthenticated()) {
      headers = { Authorization: `Bearer ${getAccessToken()}` };
      const response = await axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/newvip`, { headers });
      if (response.data.vipid) {
        this.setState({ vip: response.data.vipid, vipupdated: true });
      }
    }
  }

  render () {
    if (this.state.waiting) {
      return (
        <CircularProgress size={80} thickness={5} />
      );
    } else if (this.state.notExpert) {
      return (
        <div style={{ width: '100%', margin: '0 auto', textAlign: 'center', paddingBottom: '35px' }} >
          <h2 style={{ paddingTop: '40px' }}>Are You an Expert?</h2>
          <AwesomeButton type="reddit" action={() => this.props.auth.login('/newProfile')} style={{ fontSize: '18px', marginTop: '30px', marginBottom: '30px', height: 'auto', lineHeight: '45px' }} >Become a Dimpull Expert</AwesomeButton>
        </div>
      );
    }
    return (
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <div id="accountButtons">
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ display: !this.state.url ? 'none' : 'initial'}}>{`dimpull.com/${this.state.url}`}</h2>
          </div>
          <List>
            <Paper style={{ marginBottom: '24px', marginRight: '4px', marginLeft: '4px' }} zDepth={2} key={1} >
              <ListItem innerDivStyle={{ padding: '5px' }}>
                <ListItem
                  key="Set Your Availability"
                  containerElement={<Link to={`/calendar`} key={'cal'} />}
                  primaryText="Set Availability"
                  secondaryText={
                    <p style={{ lineHeight: '17px' }}><span style={{ color: '#eaeaea' }} >Your calendar</span></p>
                  }
                  style={{ textAlign: 'left', backgroundColor: '#268bd2', color: 'white', fontSize: '20px' }}
                  hoverColor="yellow"
                />
              </ListItem>
            </Paper>
            <Paper style={{ marginBottom: '24px', marginRight: '4px', marginLeft: '4px' }} zDepth={2} key={2} >
              <ListItem innerDivStyle={{ padding: '5px' }}>
                <ListItem
                  key="Scheduled Calls"
                  containerElement={<Link to={`/bookedtimes`} key={'booked'} />}
                  primaryText="Scheduled Calls"
                  secondaryText={
                    <p style={{ lineHeight: '17px' }}><span style={{ color: '#eaeaea' }} >Your upcoming calls</span></p>
                  }
                  style={{ textAlign: 'left', backgroundColor: '#268bd2', color: 'white', fontSize: '20px' }}
                />
              </ListItem>
            </Paper>
            <Paper style={{ marginBottom: '24px', marginRight: '4px', marginLeft: '4px' }} zDepth={2} key={4} >
              <ListItem innerDivStyle={{ padding: '5px' }}>
                <ListItem
                  key="View Profile"
                  containerElement={this.state.url ? <Link to={`/${this.state.url}`} key={'url'} /> : <Link to={`/editProfile`} key={'url'} /> }
                  primaryText={`View Profile`}
                  secondaryText={
                    <p style={{ lineHeight: '17px' }}><span style={{ color: '#eaeaea' }} >See your public profile</span></p>
                  }
                  style={{ textAlign: 'left', backgroundColor: '#268bd2', color: 'white', fontSize: '20px' }}
                />
              </ListItem>
            </Paper>
            <Paper style={{ marginBottom: '24px', marginRight: '4px', marginLeft: '4px' }} zDepth={2} key={3} >
              <ListItem innerDivStyle={{ padding: '5px' }}>
                <ListItem
                  key="Edit Profile"
                  containerElement={this.state.url ? <Link to={`/editProfile/${this.state.url}`} key={'edit'} /> : <Link to={`/editProfile`} key={'url'} /> }
                  primaryText="Edit Profile"
                  secondaryText={
                    <p style={{ lineHeight: '17px' }}><span style={{ color: '#eaeaea' }} >Keep your profile up to date</span></p>
                  }
                  style={{ textAlign: 'left', backgroundColor: '#268bd2', color: 'white', fontSize: '20px' }}
                />
              </ListItem>
            </Paper>
          </List>
          <div style={{ marginTop: '20px' }}>
            <Card expanded={this.state.callsExpanded} style={{ marginBottom: '30px' }}>
              <CardText expandable>
                <p style={{ fontSize: 'larger', textAlign: 'left' }}>{`Put a link to your public profile (dimpull.com/${this.state.url}) on your homepage and in your LinkedIn and Twitter bios. Visitors can now pay for a conversation.`}</p>
              </CardText>
              <CardActions>
                <FlatButton label="How To Get More Calls" onClick={() => this.handleExpand('callsExpanded')} style={{ display: this.state.callsExpanded ? 'none' : 'initial' }} />
              </CardActions>
            </Card>
            <Card expanded={this.state.refExpanded} style={{ marginBottom: '30px' }}>
              <CardText expandable>
                <p style={{ fontSize: 'larger', textAlign: 'left' }}>
                  {`Referral Link: dimpull.com/newProfile/ref=${this.state.referral}`}</p>
                <p style={{ color: 'dark-grey' }}>Refer an expert to earn 5% of their revenues.  They get $10 extra on their first call.</p>
              </CardText>
              <CardActions>
                <FlatButton label="Referral Link" onClick={() => this.handleExpand('refExpanded')} style={{ display: this.state.refExpanded ? 'none' : 'initial' }} />
              </CardActions>
            </Card>
            <Card expanded={this.state.vipExpanded} style={{ marginBottom: '30px' }}>
              <CardText expandable>
                <p style={{ fontSize: 'larger', textAlign: 'left' }}>{`Offer Free Calls: dimpull.com/${this.state.url}/vip=${this.state.vip}`}</p>
                <p style={{ color: 'dark-grey' }}>"VIP link" is helpful for getting initial reviews</p>
                <RaisedButton
                  onClick={() => this.newVipId()}
                  label="Change VIP link (in case free calls are getting overused)"
                  // primary
                  style={{ marginTop: '12px' }}
                />
              </CardText>
              <CardActions>
                <FlatButton label="Give Free Calls" onClick={() => this.handleExpand('vipExpanded')} style={{ display: this.state.vipExpanded ? 'none' : 'initial' }} />
              </CardActions>
            </Card>
          </div>
        </div>
        <Snackbar
          open={this.state.vipupdated}
          message="Updated vip link"
          autoHideDuration={4000}
          onRequestClose={() => this.handleRequestClose()}
        />
      </div>
    );
  }
}

export default Profile;
