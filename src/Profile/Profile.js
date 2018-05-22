import React from 'react';
import { List, ListItem } from 'material-ui/List';
import { Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import Snackbar from 'material-ui/Snackbar';
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';
import history from './../history';
import './Profile.css';

class Profile extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      open: false,
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

  handleOpen () {
    this.setState({ open: true });
  }

  handleRequestClose () {
    this.setState({ open: false });
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
          <RaisedButton
            containerElement={<Link to="/newProfile" />}
            label="Become a Dimpull Expert"
            secondary
            style={{ marginTop: '20px', marginBottom: '20px' }}
          />
        </div>
      );
    }
    return (
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <div id="accountButtons">
          <List>
            <Paper style={{ marginBottom: '24px', marginRight: '4px', marginLeft: '4px' }} zDepth={2} key={1} >
              <ListItem innerDivStyle={{ padding: '5px' }}>
                <ListItem
                  key="Set Your Availability"
                  containerElement={<Link to={`/calendar`} key={'cal'} />}
                  // onClick={() => this.handleOpen()}
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
                  //onClick={() => this.handleOpen()}
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
          <Paper style={{ marginBottom: '24px', marginRight: '4px', marginLeft: '4px', backgroundColor: '#268bd2' }}>
            <div style={{ margin: '12px', padding: '12px' }}>
              <p style={{ fontSize: 'larger', color: 'white' }}>{`Referral Link: dimpull.com/newProfile/ref=${this.state.referral}`}</p>
              <p style={{ color: '#eaeaea' }}>Refer an expert to earn 5% of their revenues.  They get $10 extra on their first call.</p>
            </div>
          </Paper>
          <Paper style={{ marginBottom: '24px', marginRight: '4px', marginLeft: '4px', backgroundColor: '#268bd2' }}>
            <div style={{ margin: '12px', padding: '12px' }}>
              <p style={{ fontSize: 'larger', color: 'white' }}>{`Offer Free Calls: dimpull.com/${this.state.url}/vip=${this.state.vip}`}</p>
              <p style={{ color: '#eaeaea' }}>Helpful for getting initial reviews</p>
            </div>
          </Paper>
        </div>
        <Snackbar
          open={this.state.open}
          message="Will be available on May 22nd..."
          autoHideDuration={4000}
          onRequestClose={() => this.handleRequestClose()}
        />
      </div>
    );
  }
}

export default Profile;
