import React from 'react';
import axios from 'axios';
import CircularProgress from 'material-ui/CircularProgress';
import Options from './Options'
import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';
import 'react-awesome-button/dist/themes/theme-blue.css';
import history from '../../history';

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
      return <CircularProgress size={80} thickness={5} />
    } else if (this.state.notExpert) {
      return (
        <div style={{ width: '100%', margin: '0 auto', textAlign: 'center', paddingBottom: '35px' }} >
          <h2 style={{ paddingTop: '40px' }}>Are You an Expert?</h2>
          <AwesomeButton type="reddit" action={() => this.props.auth.login('/newProfile')} style={{ fontSize: '18px', marginTop: '30px', marginBottom: '30px', height: 'auto', lineHeight: '45px' }} >Become a Dimpull Expert</AwesomeButton>
        </div>
      )
    } 
    return <Options 
      status={this.state}
      auth={this.props.auth}
      handleRequestClose={() => this.handleRequestClose()}
      newVipId={() => this.newVipId()} 
      handleExpand={(e) => this.handleExpand(e)}
    />
  }
}

export default Profile;
