import React from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import axios from 'axios';
import CircularProgress from 'material-ui/CircularProgress';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { AwesomeButton } from 'react-awesome-button';
import { checkNumber, toPnf } from '../../utils/phone_number';
import history from '../../history';
import './discussionprofile.css';

const allCountries = require('all-countries');

const style = {
  marginTop: 50,
  paddingBottom: 50,
  paddingTop: 25,
  width: '100%',
  textAlign: 'center',
  display: 'inline-block'
};

const textStyle = {
  textAlign: 'start',
  width: '80%'
};

class newProfile extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      tel_error_text: null,
      otherProfile: '',
      disabled: true,
      email: '',
      message: '',
      waiting: true,
      tel: '',
      pnf: '',
      country: 'United States',
      codeAccepted: false,
      noCode: false,
      name: ''
    };
  }

  componentWillMount () {
    const { isAuthenticated } = this.props.auth;
    if (!isAuthenticated()) {
      this.props.auth.login(this.props.location.pathname);
    }
  }

  componentDidMount () {
    // const { isAuthenticated } = this.props.auth;
    // const { getAccessToken } = this.props.auth;
    this.getEmail();
    this.getProfile();
    // let headers = {};
    // if (isAuthenticated()) {
    //   headers = { 'Authorization': `Bearer ${getAccessToken()}`}
    // }
    // axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/getprofile`, { headers })
    //   .then((response) => {
    //     this.setState({ expert: response.data.expert, tel: response.data.phone_number });
    //   })
    //   .catch(function (error) {
    //     console.log(error)
    //   });
    this.checkRegistered();
  }

  getProfile () {
    const { userProfile, getProfile } = this.props.auth;
    if (!userProfile) {
      getProfile((err, profile) => {
        this.setState({ profile });
      }
    )} else {
      this.setState({ profile: userProfile });
    }
  }

  getNames (name) {
    if (name) {
      this.setState({
        first_name: name.split(' ').slice(0, -1).join(' '),
        last_name: name.split(' ').slice(-1).join(' '),
        name
      });
    }
  }

  getEmail () {
    const fullUrl = `https://jonsanders:auth0:com/user_metadata`;
    const { userProfile, getProfile } = this.props.auth;
    if (!userProfile) {
      getProfile((err, profile) => {
        if (profile.email) {
          this.setState({ email: profile.email });
        } else if (profile[fullUrl]) {
          if (profile[fullUrl].email) {
            this.setState({ email: profile[fullUrl].email });
          }
        }
      });
    } else {
      if (userProfile.email) {
        this.setState({ email: userProfile.email });
      } else if (userProfile[fullUrl]) {
        if (userProfile[fullUrl].email) {
          this.setState({ email: userProfile[fullUrl].email });
        }
      }
    }
  }

  async checkRegistered () {
    const { getAccessToken } = this.props.auth;
    const headers = { Authorization: `Bearer ${getAccessToken()}` };
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_USERS_SERVICE_URL}/api/register`,
        { headers }
      );
      // check path to see if there is a ref code
      const pathName = this.props.location.pathname;
      if (pathName.substr(pathName.length - 10) !== 'newProfile' && pathName.substr(pathName.length - 11) !== 'newProfile/') {
        if (!response.data.dp) {
          const referred = await axios.get(
            `${process.env.REACT_APP_USERS_SERVICE_URL}/addReferent/${pathName.substr(pathName.length - 7)}`,
            { headers }
          );
          if (referred.data === 'referral code accepted') {
            this.setState({ codeAccepted: true });
          } else if (referred.data === `referral code doesn't exist`) {
            this.setState({ noCode: true });
          }
        }
      }
      if (response.data.dp) {
        history.replace(`/editProfile/${response.data.url}`);
      } else {
        this.setState({ waiting: false });
        return;
      }
    } catch (err) {
      return;
    }
  }

  changeValue (e, type) {
    if (type === 'name') {
      this.getNames(e.target.value);
    }
    const nextState = {};
    nextState[type] = e.target.value;
    this.setState(nextState, () => {
      this.isDisabled();
    });
  }

  isDisabled () {
    let telIsValid = false;
    let number = 'error';
    if (this.state.tel) {
      number = checkNumber(this.state.tel, this.state.country);
    }
    if (this.state.tel === '' || !this.state.tel) {
      this.setState({
        tel_error_text: null,
        disabled: true
      });
    } else if (number !== 'error') {
      this.setState({
        tel_error_text: null,
        pnf: toPnf(number)
      });
      telIsValid = true;
    } else if (this.state.email.length === 0) {
      this.setState({ disabled: true });
    } else {
      this.setState({
        tel_error_text: 'Enter a valid phone number',
        disabled: true
      });
    }
    if (telIsValid && this.state.otherProfile.length !== 0 && this.state.email.length !== 0 && this.state.first_name && this.state.last_name) {
      this.setState({
        disabled: false
      });
    } else {
      this.setState({ disabled: true });
    }
  }

  async submit () {
    const message = this.state.message ? this.state.message : 'empty';
    // e.preventDefault();
    this.setState({ waiting: true });
    const { isAuthenticated } = this.props.auth;
    const { getAccessToken } = this.props.auth;
    if (isAuthenticated()) {
      const headers = { Authorization: `Bearer ${getAccessToken()}` };
      const user = await axios.post(
        `${process.env.REACT_APP_USERS_SERVICE_URL}/api/register`,
        {
          // user_id: this.state.profile.sub,
          phone_number: this.state.pnf,
          first_name: this.state.first_name,
          last_name: this.state.last_name,
          auth_pic: this.state.profile.picture
        }, { headers }
      );
      if (user) {
        if (user.data === 'Phone number already in use.') {
          this.setState({
            title: `The phone number ${this.state.tel} is already in use. Please log into that profile or contact admin@dimpull.com`
          });
        } else {
          try {
            const editUrl = await axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/discussions/new`,
              {
                otherProfile: this.state.otherProfile,
                email: this.state.email,
                message: message
              }, { headers }
            );
            this.setState({ editUrl: editUrl.data });
          } catch (err) {
            await axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/senderror`,
              {
                err: err.message,
                email: this.state.email
              }
            );
            history.push('/');
          }
        }
      }
      if (this.state.codeAccepted) {
        const pathName = this.props.location.pathname;
        const referred = await axios.get(
          `${process.env.REACT_APP_USERS_SERVICE_URL}/addReferent/${pathName.substr(pathName.length - 7)}`,
          { headers }
        );
        if (referred.data !== 'applied') {
          await axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/senderror`,
            {
              err: 'referral failed',
              email: this.state.email
            }
          );
        }
      }
      history.replace(`/editProfile/${this.state.editUrl}`);
    } else {
      this.props.auth.login('/newProfile');
    }
  }

  selectCountry (event, index, value) {
    this.setState({ country: value });
  }

  render () {
    const { isAuthenticated } = this.props.auth;
    const display = this.state.waiting ? 'none' : 'inherit';
    const waiting = this.state.waiting ? 'inherit' : 'none';
    return (
      <div>
        <CircularProgress style={{ display: waiting }} size={80} thickness={5} />
        {isAuthenticated() && (
          <div className="col-md-6 col-md-offset-3" style={{ display }}>
            {this.state.codeAccepted && (
              <div id="referralAccepted">
                Referral code accepted.
                {' '}Get an extra $10 (in ETH) when you complete your first paid call.
              </div>
            )}
            {this.state.noCode && (
              <div id="noCode">
                Referral Code isn't valid.
                {' '}Make sure link was entered correctly, or continue with signup process and contact admin@dimpull.com
              </div>
            )}
            <Paper style={style}>
              <div className="text-center">
                <h2>Become a Dimpull Expert</h2>
                <div className="col-md-12">
                  <TextField
                    type="name"
                    style={textStyle}
                    floatingLabelText="First and last name"
                    onChange={e => this.changeValue(e, 'name')}
                    value={this.state.name}
                  />
                  <TextField
                    floatingLabelText="Email"
                    type="email"
                    value={this.state.email}
                    style={textStyle}
                    onChange={e => this.changeValue(e, 'email')}
                  />
                  <SelectField
                    floatingLabelText="Country"
                    value={this.state.country}
                    onChange={(event, index, value) => this.selectCountry(event, index, value, 'id')}
                    maxHeight={200}
                    style={textStyle}
                  >
                    {allCountries.all.sort().map(country =>
                      <MenuItem value={country} key={country} primaryText={country} />)
                    }
                  </SelectField>
                  <TextField
                    floatingLabelText="Post a link that best showcases your expertise"
                    type="otherProfile"
                    style={textStyle}
                    onChange={e => this.changeValue(e, 'otherProfile')}
                    value={this.state.otherProfile}
                  />
                  <TextField
                    floatingLabelText="Message for the dimpull admins (optional)"
                    type="message"
                    value={this.state.message}
                    onChange={e => this.changeValue(e, 'message')}
                    multiLine
                    rows={1}
                    rowsMax={6}
                    style={textStyle}
                  />
                  <TextField
                    floatingLabelText="Phone number"
                    type="tel"
                    errorText={this.state.tel_error_text}
                    onChange={e => this.changeValue(e, 'tel')}
                    style={textStyle}
                    value={this.state.tel}
                  />
                </div>
                <AwesomeButton type="primary" action={e => this.submit(e)} style={{ marginLeft: '2px', marginTop: '50px' }} disabled={this.state.disabled}>Continue</AwesomeButton>
              </div>
            </Paper>
          </div>
        )}
        {
          !isAuthenticated() && (
            <h4> You aren't logged in</h4>
          )}
      </div>
    );
  }
}

export default newProfile;
