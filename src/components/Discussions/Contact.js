import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import axios from 'axios';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import PropTypes from 'prop-types';
import history from '../../history';

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

class Contact extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      message: '',
      tel: '',
      tel_error_text: null,
      disabled: true,
      // startTime: null,
      open: false,
      emailError: null,
      pnf: '',
      country: 'United States'
    };
  }

  componentDidMount () {
    const { isAuthenticated } = this.props.auth;
    const { getAccessToken } = this.props.auth;
    if (isAuthenticated()) {
      const headers = { Authorization: `Bearer ${getAccessToken()}` };
      axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/getprofile`, { headers })
        .then((response) => {
          if (response.data.phone_number) {
            this.setState({ tel: response.data.phone_number, telReceived: true });
          }
        })
        .catch(error => console.log(error));
    }
  }

  async isDisabled () {
    const email = await this.validEmail();
    let telIsValid = false;
    let number = '';
    const country = allCountries.getCountryCodeByCountryName(this.state.country);
    try {
      number = phoneUtil.parse(this.state.tel, country);
    } catch(error){
    }
    if (this.state.tel === '' || !this.state.tel) {
      this.setState({
        tel_error_text: null
      });
    } else if (this.noExcepetion(number)) {
      this.setState({
        tel_error_text: null,
        pnf: number
      });
      telIsValid = true;
    } else {
      this.setState({
        tel_error_text: 'Enter a valid phone number'
      });
    }
    if (telIsValid && email) {
      this.setState({
        disabled: false
      });
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

  validEmail () {
    const re = /\S+@\S+/;
    if (re.test(this.state.email)) {
      this.setState({ emailError: false });
      return true;
    }
    this.setState({ emailError: true });
    return false;
  }

  changeValue (e, type) {
    const nextState = {};
    nextState[type] = e.target.value;
    this.setState(nextState, () => {
      this.isDisabled();
    });
  }

  _handleKeyPress (e) {
    if (e.key === 'Enter') {
      if (!this.state.disabled) {
        this.login(e);
      }
    }
  }

  handleOpen () {
    this.setState({ open: true });
  }

  handleClose () {
    this.setState({ open: false });
    history.push({
      pathname: '/discussions'
    });
  }

  addProfile () {
    const { userProfile, getProfile } = this.props.auth;
    if (!userProfile) {
      getProfile((err, profile) => {
        this.setState({ profile });
        if (profile.given_name) {
          this.setState({
            first_name: profile.given_name,
            last_name: profile.family_name
          })
        } else if (profile['https://jonsanders:auth0:com/user_metadata']) {
          this.setState({
            // hasName: true,
            first_name: profile[`${process.env.REACT_APP_AUTH0_DOMAIN}/user_metadata`].given_name,
            last_name: profile[`${process.env.REACT_APP_AUTH0_DOMAIN}/user_metadata`].family_name
          });
        }
      });
    } else {
      this.setState({ profile: userProfile });
      if (userProfile.given_name) {
        this.setState({
          first_name: userProfile.given_name,
          last_name: userProfile.family_name
        });
      } else if (userProfile[`${process.env.REACT_APP_AUTH0_DOMAIN}/user_metadata`]) {
        this.setState({
          first_name: userProfile[`${process.env.REACT_APP_AUTH0_DOMAIN}/user_metadata`].given_name,
          last_name: userProfile[`${process.env.REACT_APP_AUTH0_DOMAIN}/user_metadata`].family_name
        });
      }
    }
  }

  async register () {
    const res = await axios.post(
      `${process.env.REACT_APP_USERS_SERVICE_URL}/api/register`,
      {
        user_id: this.state.profile.sub,
        phone_number: phoneUtil.format(this.state.pnf, PNF.E164),
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        auth_pic: this.state.profile.picture
      }
    );
    return res;
  }

  submit (e) {
    let search = this.props.location.search;
    if (search.charAt(0) === '?') {
      search = search.slice(1);
    }
    e.preventDefault();
    const start = this.props.location.state.startTime;

    //T ODO add real error handling if time is now in the past.
    if (start < new Date()) {
      console.log('TOO EARLY');
    } else {
      const { isAuthenticated } = this.props.auth;
      const { getAccessToken } = this.props.auth;
      if (isAuthenticated()) {
        this.addProfile();
        const headers = { Authorization: `Bearer ${getAccessToken()}` };
        axios.post(
          `${process.env.REACT_APP_USERS_SERVICE_URL}/conversations/${search}`,
          {
            phone_number: phoneUtil.format(this.state.pnf, PNF.E164),
            message: this.state.message,
            email: this.state.email,
            start_time: new Date(start)
          }, { headers }
        ).then((response) => {
          if (response.data !== 'whitelisted') {
            return 'ERROR, not whitelisted';
          }
          this.register().then((newResponse) => {
            if (newResponse.data !== 'updated phone_number') {
              return 'ERROR, phone number not updated';
            }
            return 'Updated the phone number';
          });
          return 'number is whitelisted';
        }).catch(error => this.setState({ tel_error_text: error }));
      } else {
        axios.post(
          `${process.env.REACT_APP_USERS_SERVICE_URL}/conversations/${search}`,
          {
            phone_number: phoneUtil.format(this.state.pnf, PNF.E164),
            message: this.state.message,
            email: this.state.email,
            start_time: new Date(start)
          }
        ).then((response) => {
          if (response.data !== 'whitelisted') {
            return 'ERROR, not whitelisted';
          }
          return 'number is whitelisted';
        // redirect to create profile
        }).catch(error => this.setState({ tel_error_text: error }));
      }
    }
  }

  render () {
    const actions = [
      <FlatButton
        label="Okay"
        primary
        keyboardFocused
        onClick={this.handleClose}
      />
    ];
    return (
      <div className="col-md-6 col-md-offset-3">
        <Paper style={style}>
          <div className="text-center">
            <h2>Please provide the number you will call from</h2>
            <p> Don't worry, we aren't sharing this, and a different number will show up in caller ID.</p>
            <div className="col-md-12">
              {this.state.telReceived &&
                <TextField
                  floatingLabelText="Phone number"
                  type="tel"
                  errorText={this.state.tel_error_text}
                  onChange={e => this.changeValue(e, 'tel')}
                  value={this.state.tel}
                />
              }
              {!this.state.telReceived &&
                <TextField
                  floatingLabelText="Phone number"
                  type="tel"
                  errorText={this.state.tel_error_text}
                  onChange={e => this.changeValue(e, 'tel')}
                  value={this.state.tel}
                />
              }
              <TextField
                hintText="Short message for expert"
                floatingLabelText="Short message for expert"
                type="text"
                // errorText={this.state.tel_error_text}
                onChange={e => this.changeValue(e, 'message')}
                defaultValue="Hi, "
                fullWidth
              />
              <TextField
                floatingLabelText="Your email address (or login!)"
                type="email"
                onChange={e => this.changeValue(e, 'email')}
                defaultValue=""
                errorText={this.state.emailError}
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
            title="A notification was sent to the expert."
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
          >
            You will be notified by SMS if/when they accept.
          </Dialog>
        </Paper>
      </div>
    );
  }
}

Contact.propTypes = {
  auth: PropTypes.shape({
    isAuthenticated: PropTypes.func,
    getAccessToken: PropTypes.func,
    login: PropTypes.func,
    userProfile: PropTypes.object,
    getProfile: PropTypes.func
  })
};

Contact.defaultProps = {
  auth: PropTypes.object
};

export default Contact;
