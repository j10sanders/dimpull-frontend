import React from 'react';
import { List, ListItem } from 'material-ui/List';
import { Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import Snackbar from 'material-ui/Snackbar';
import axios from 'axios';
import './Profile.css';

class Profile extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      open: false,
      url: null
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
        this.setState({ url: response.data.url });
      }
    }
  }

  handleOpen () {
    this.setState({ open: true });
  }

  handleRequestClose () {
    this.setState({ open: false });
  }

  render () {
    return (
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <div id="accountButtons">
          <List>
            <Paper style={{ marginBottom: '24px', marginRight: '4px', marginLeft: '4px' }} zDepth={2} key={1} >
              <ListItem innerDivStyle={{ padding: '5px' }}>
                <ListItem
                  key="Set Your Availability"
                  // containerElement={<Link to={`/calendar`} key={'cal'} />}
                  onClick={() => this.handleOpen()}
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
                  // containerElement={<Link to={`/calendar`} key={'cal'} />}
                  onClick={() => this.handleOpen()}
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
