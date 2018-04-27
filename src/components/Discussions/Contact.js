import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import axios from 'axios';
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import PropTypes from 'prop-types';
import history from '../../history';
import getWeb3 from '../../utils/getWeb3';
import EscrowContract from '../../build/contracts/Escrow.json';

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
  static noExcepetion (number) {
    let ret;
    try {
      ret = phoneUtil.isValidNumber(number);
    } catch (err) {
      console.log(err);
    } finally {
      return ret;
    }
  }
  static async getEtherPrice (eth) {
    const res = await axios.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD');
    const wei = (eth / res.data.USD) * 1000000000000000000;
    return wei;
  }
  constructor (props) {
    super(props);
    this.state = {
      message: '',
      tel: '',
      tel_error_text: '',
      disabled: true,
      // startTime: '',
      open: false,
      openError: false,
      pnf: '',
      country: 'United States',
      transactionStatus: 'waiting',
      emailErrorText: '',
    };
  }

  componentDidMount () {
    getWeb3
      .then((results) => {
        if (results.error) {
          this.setState({ web3error: true });
        } else {
          this.setState({
            web3: results.web3
          }, () => this.instantiateContract());
        }
      })
      .catch(() => {
        this.setState({ web3error: true });
      });
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

  async getWallet () {
    const walletAndPrice = await axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/walletandprice/${this.props.location.search.substring(1)}`);
    debugger;
    if (walletAndPrice.data.walletAddress && walletAndPrice.data.price) {
      const walletAddress = walletAndPrice.data.walletAddress;
      const price = await Contact.getEtherPrice(Number(walletAndPrice.data.price));
      const instance = await this.state.escrow.deployed();
      const esc = instance;
      const accounts = await this.state.web3.eth.accounts;
      // const balance = await esc.balances.call(walletAddress, accounts[0]);
      let result;
      try {
        esc.start.sendTransaction(
          walletAddress,
          { from: accounts[0], value: price }
        ).then((hash) => {
          this.waitForReceipt(hash, (receipt) => {
            this.setState({ fromAddress: receipt.from });
          });
        // result = await esc.start(walletAddress, { from: accounts[0], value: price });
        });
      } catch (err) {
        console.log(err);
      }
      console.log(result);
      // debugger;
    } else { // TODO: handle inadequate wallet address
      console.log(walletAndPrice.data);
    }
  }

  waitForReceipt (hash, cb) {
    // debugger;
    this.setState({ transactionStatus: 'mining' });
    const that = this;
    this.state.web3.eth.getTransactionReceipt(hash, (err, receipt) => {
      if (err) {
        console.log(err);
      }
      if (receipt !== null) {
        // Transaction went through
        this.setState({ transactionStatus: 'mined' }, () => this.isDisabled());
        if (cb) {
          cb(receipt);
        }
      } else {
        // Try again in 1 second
        window.setTimeout(() => {
          that.waitForReceipt(hash, cb);
        }, 1000);
      }
    });
  }

  instantiateContract () {
    const contract = require('truffle-contract');
    const escrow = contract(EscrowContract);
    escrow.setProvider(this.state.web3.currentProvider);
    this.setState({ escrow }, () => this.getWallet());
  }

  async isDisabled () {
    const email = await this.validEmail();
    let telIsValid = false;
    let number = '';
    const country = allCountries.getCountryCodeByCountryName(this.state.country);
    try {
      number = phoneUtil.parse(this.state.tel, country);
    } catch (error) {
      console.log(error);
    }
    if (this.state.tel === '' || !this.state.tel) {
      this.setState({
        tel_error_text: ''
      });
    } else if (number !== '') {
      if (Contact.noExcepetion(number)) {
        this.setState({
          tel_error_text: '',
          pnf: number
        });
        telIsValid = true;
      }
    } else {
      this.setState({
        tel_error_text: 'Enter a valid phone number'
      });
    }
    if (telIsValid && email && (this.state.transactionStatus === 'mined')) {
      this.setState({
        disabled: false
      });
    }
  }

  validEmail () {
    if (!this.state.email || this.state.email.length === 0) {
      return false;
    }
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(this.state.email)) {
      this.setState({ emailErrorText: '' });
      return true;
    }
    this.setState({ emailErrorText: 'Enter a valid email' });
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

  handleOpenError () {
    this.setState({ openError: true });
  }

  handleClose () {
    this.setState({ open: false });
    history.push({
      pathname: '/'
    });
  }

  handleErrorClose () {
    this.setState({ openError: false });
    history.push({
      pathname: '/'
    });
  }

  submit (e) {
    let search = this.props.location.search;
    if (search.charAt(0) === '?') {
      search = search.slice(1);
    }
    e.preventDefault();
    const start = this.props.location.state.startTime;
    // TODO add real error handling if time is now in the past.
    if ((start - new Date()) / 60000 < 15) {
      this.handleOpenError();
    } else {
      const { isAuthenticated } = this.props.auth;
      const { getAccessToken } = this.props.auth;
      if (isAuthenticated()) {
        const headers = { Authorization: `Bearer ${getAccessToken()}` };
        axios.post(
          `${process.env.REACT_APP_USERS_SERVICE_URL}/conversations/${search}`,
          {
            phone_number: phoneUtil.format(this.state.pnf, PNF.E164),
            message: this.state.message,
            email: this.state.email,
            start_time: new Date(start),
            fromAddress: this.state.fromAddress
          }, { headers }
        ).then((response) => {
          if (response.data !== 'whitelisted') {
            return 'ERROR, not whitelisted';
          }
          this.setState({
            anonymous_phone_number: response.data.anonymous_phone_number
          }, () => this.setState({ open: true }));
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
            start_time: new Date(start),
            fromAddress: this.state.fromAddress
          }
        ).then((response) => {
          if (!response.data.whitelisted) {
            return 'ERROR, not whitelisted';
          }
          this.setState({
            anonymous_phone_number: response.data.anonymous_phone_number,
          }, () => this.setState({ open: true }));
          return 'number is whitelisted';
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
    if (this.state.web3error) {
      return (
        <div className="col-md-6 col-md-offset-3">
          <Paper style={style}>
            <div className="text-center">
              <h2>
                No web3 client found.  Do you have MetaMask running?  If not:
                <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">
                  <img style={{ paddingTop: '20px' }} src="https://res.cloudinary.com/dtvc9q04c/image/upload/v1524675881/download-metamask-dark.png" alt="metaMask" />
                </a>
              </h2>
            </div>
          </Paper>
        </div>
      );
    }
    let transaction;
    if (this.state.transactionStatus === 'waiting') {
      transaction = [
        <div key="waiting">
          <img src="https://res.cloudinary.com/dtvc9q04c/image/upload/c_scale,h_34/v1524605290/icons8-close-window-50.png" alt="no" />
          {' '}<div>Payment not sent yet.</div>
        </div>
      ];
    } else if (this.state.transactionStatus === 'mining') {
      transaction = [
        <div key="mining">
          <div><CircularProgress /></div>
          {' '}Please wait for the transaction to be mined...
        </div>
      ];
    } else if (this.state.transactionStatus === 'mined') {
      transaction = [
        <div key="mined">
          <div><img src="https://res.cloudinary.com/dtvc9q04c/image/upload/c_scale,h_34/v1524605282/icons8-ok-50.png" alt="yes" /></div>
          {' '}Transaction accepted.
        </div>
      ];
    }
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
              <div>
                <TextField
                  hintText="Short message for expert"
                  floatingLabelText="Short message for expert"
                  type="text"
                  style={{ paddingTop: '8px' }}
                  onChange={e => this.changeValue(e, 'message')}
                  defaultValue="Hi, "
                />
              </div>
              <div>
                <TextField
                  floatingLabelText="Your email address (or login!)"
                  type="email"
                  onChange={e => this.changeValue(e, 'email')}
                  defaultValue=""
                  errorText={this.state.emailErrorText}
                />
              </div>
              <div style={{ paddingTop: '30px' }} >
                {transaction}
              </div>
            </div>
            <RaisedButton
              disabled={this.state.disabled}
              style={{ marginTop: 50 }}
              label="Submit"
              onClick={e => this.submit(e)}
            />
          </div>
          <Dialog
            title={`Call is booked.  You can call them at ${this.props.location.state.startTime} using the number ${this.state.anonymous_phone_number}.  Make sure to save it somewhere`}
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
          />
          <Dialog
            title={'Sorry, that time is now too early.  Timeslots need to be booked at least 15 minutes before they occur.'}
            actions={actions}
            modal={false}
            open={this.state.openError}
            onRequestClose={this.handleErrorClose}
          />
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
