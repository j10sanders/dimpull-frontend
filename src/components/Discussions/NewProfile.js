import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import axios from 'axios';
// import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
// import Subheader from 'material-ui/Subheader';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
// import { timezones } from '../../timezones/timezones';
import history from '../../history';
import './discussionprofile.css';

const PNF = require('google-libphonenumber').PhoneNumberFormat;
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
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

const thanks = `Thanks!  We will review your application right away. In the meantime,
  feel free to fill out your profile.  It will only be public once you've been verified by the Dimpull admins.`;

class newProfile extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      title: thanks,
      tel_error_text: null,
      otherProfile: '',
      disabled: true,
      email: '',
      message: '',
      open: false,
      waiting: true,
      tel: '',
      pnf: '',
      country: 'United States',
      hasName: false,
      codeAccepted: false,
      noCode: false
    };
  }

  componentWillMount () {
    const { isAuthenticated } = this.props.auth;
    if (!isAuthenticated()) {
      this.props.auth.login(this.props.location.pathname);
    }
  }

  componentDidMount () {
    const { isAuthenticated } = this.props.auth;
    const { getAccessToken } = this.props.auth;
    this.getNames();
    this.getEmail();
    let headers = {};
    if (isAuthenticated()) {
      headers = { 'Authorization': `Bearer ${getAccessToken()}`}
    }
    axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/getprofile`, { headers })
      .then((response) => {
        this.setState({ expert: response.data.expert, tel: response.data.phone_number });
      })
      .catch(function (error) {
        console.log(error)
      });
    this.checkRegistered();
  }

  getNames (name) {
    if (name) {
      this.setState({
        hasName: false,
        first_name: name.split(' ').slice(0, -1).join(' '),
        last_name: name.split(' ').slice(-1).join(' ')
      });
      return;
    }
    const fullUrl = `https://jonsanders:auth0:com/user_metadata`;
    this.setState({ profile: {} });
    const { userProfile, getProfile } = this.props.auth;
    if (!userProfile) {
      getProfile((err, profile) => {
        this.setState({ profile });
        if (profile.given_name) {
          this.setState({
            hasName: true,
            first_name: profile.given_name,
            last_name: profile.family_name
          });
        } else if (profile[fullUrl]){
          if (profile[fullUrl].given_name) {
            this.setState({
              hasName: true,
              first_name: profile[fullUrl].given_name,
              last_name: profile[fullUrl].family_name
            })
          } 
        } else if (profile.name) {
            this.setState({
              hasName: true,
              first_name: profile.name.split(' ').slice(0, -1).join(' '),
              last_name: profile.name.split(' ').slice(-1).join(' ')
            })
          }
      });
    } else {
      this.setState({ profile: userProfile });
      if (userProfile.given_name) {
        this.setState({
          hasName: true,
          first_name: userProfile.given_name,
          last_name: userProfile.family_name
        });
      } else if (userProfile[fullUrl]) {
        if (userProfile[fullUrl].given_name) {
          this.setState({
            hasName: true,
            first_name: userProfile[fullUrl].given_name,
            last_name: userProfile[fullUrl].family_name
          });
        }
      } else if (userProfile.name) {
        this.setState({
          hasName: true,
          first_name: userProfile.name.split(' ').slice(0, -1).join(' '),
          last_name: userProfile.name.split(' ').slice(-1).join(' ')
        });
      } else {
        // this.setState({
        //   // hasName: true,
        //   first_name: '',
        //   last_name: ''
        // });
      }
    }
  }

  getEmail () {
    const fullUrl = `https://jonsanders:auth0:com/user_metadata`;
    const { userProfile, getProfile } = this.props.auth;
    if (!userProfile) {
      getProfile((err, profile) => {
        if (profile.email) {
          this.setState({email: profile.email})
        } else if (profile[fullUrl]){
          if (profile[fullUrl].email) {
            this.setState({email: profile[fullUrl].email})
          } 
        } 
      });
    } else {
      if (userProfile.email) {
        this.setState({ email: userProfile.email })
      } else if (userProfile[fullUrl]) {
          if (userProfile[fullUrl].email) {
            this.setState({ email: userProfile[fullUrl].email})
          }
      }
    }
  }

  async checkRegistered () {
    const { getAccessToken } = this.props.auth;
    let headers = { 'Authorization': `Bearer ${getAccessToken()}` };
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

  _handleKeyPress (e) {
    if (e.key === 'Enter') {
      if (!this.state.disabled) {
        // this.login(e);
        // return;
      }
      // return;
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
    let number = '';
    const country = allCountries.getCountryCodeByCountryName(this.state.country);
    try {
      number = phoneUtil.parse(this.state.tel, country);
    } catch (error){
    }
    if (this.state.tel === '' || !this.state.tel) {
      this.setState({
        tel_error_text: null,
        disabled: true
      });
    } else if (this.noExcepetion(number)) {
      this.setState({
        tel_error_text: null,
        pnf: number
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
    if (telIsValid && this.state.otherProfile.length !== 0 && this.state.email.length !== 0) {
      this.setState({
        disabled: false
      });
    } else {
      this.setState({ disabled: true });
    }
  }

  noExcepetion (number) {
    let ret;
    try {
      ret = phoneUtil.isValidNumber(number)
    } catch (err) {
      console.log(err)
    } finally {
      return ret;
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
          phone_number: phoneUtil.format(this.state.pnf, PNF.E164),
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
        if (referred.data !== "applied") {
          await axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/senderror`,
            {
              err: 'referral failed',
              email: this.state.email
            }
          );
        }
      }
      this.setState({
        waiting: false,
        open: true
      });
    } else {
      this.props.auth.login('/newProfile');
    }
  }

  handleClose () {
    this.setState({ open: false });
    history.replace(`/editProfile/${this.state.editUrl}`);
  }

  selectCountry (event, index, value) {
    this.setState({ country: value });
  }

  render () {
    const { isAuthenticated } = this.props.auth;
    const actions = [
      <FlatButton
        label="Edit full profile"
        primary
        onClick={() => this.handleClose()}
      />
    ];
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
                {' '}Get an extra $5 (in ETH) when you complete your first paid call.
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
                  {(this.state.hasName) && (
                    <TextField
                      defaultValue={`${this.state.first_name} ${this.state.last_name}`}
                      type="name"
                      style={textStyle}
                      // fullWidth={true}
                      floatingLabelText="First and last name"
                      onChange={e => this.changeValue(e, 'name')}
                    />
                  )}
                  {(!this.state.hasName) && (
                    <TextField
                      type="name"
                      style={textStyle}
                      // fullWidth={true}
                      floatingLabelText="First and last name"
                      onChange={e => this.changeValue(e, 'name')}
                    />
                  )}
                  <TextField
                    // hintText="Email (so we can notify you if you get accepted)"
                    floatingLabelText="Email"
                    type="email"
                    // defaultValue={this.state.email}
                    value={this.state.email}
                    style={textStyle}
                    onChange={e => this.changeValue(e, 'email')}
                    // fullWidth={true}
                  />
                  <SelectField
                    floatingLabelText="Country"
                    value={this.state.country}
                    onChange={(event, index, value) => this.selectCountry(event, index, value, "id")}
                    maxHeight={200}
                    // fullWidth={true}
                    style={textStyle}
                  >
                    {allCountries.all.sort().map(country =>
                      <MenuItem value={country} key={country} primaryText={country} />)
                    }
                  </SelectField>
                  <TextField
                    // hintText="Comma separated if you want to show multiple links"
                    floatingLabelText="Post a link that best showcases your expertise"
                    type="otherProfile"
                    // fullWidth={true}
                    style={textStyle}
                    // errorText={this.state.tel_error_text}
                    onChange={e => this.changeValue(e, 'otherProfile')}
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
                    // fullWidth={true}
                  />
                  <TextField
                    floatingLabelText="Phone number"
                    type="tel"
                    errorText={this.state.tel_error_text}
                    onChange={e => this.changeValue(e, 'tel')}
                    style={textStyle}
                    // value={this.state.tel}
                  />
                </div>
                <RaisedButton
                  disabled={this.state.disabled}
                  style={{ marginTop: 50 }}
                  label="Submit"
                  onClick={e => this.submit(e)}
                />
              </div>
              <Dialog
                title={this.state.title}
                actions={actions}
                modal={false}
                open={this.state.open}
                onRequestClose={() => this.handleClose.bind(this)}
              >
              </Dialog>
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
