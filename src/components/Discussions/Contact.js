import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import axios from 'axios';
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import PropTypes from 'prop-types';
import Countdown from 'react-countdown-now';
import { Link } from 'react-router-dom';
import history from '../../history';
import getWeb3 from '../../utils/getWeb3';
import EscrowContract from '../../build/contracts/Escrow.json';
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
    const wei = Math.round((eth / res.data.USD) * 1000000000000000000);
    return wei;
  }

  constructor (props) {
    super(props);
    this.state = {
      message: '',
      tel: '',
      tel_error_text: '',
      disabled: true,
      open: false,
      openError: false,
      pnf: '',
      country: 'United States',
      transactionStatus: 'waiting',
      emailErrorText: '',
      errorTitle: '',
      hostFirstName: '',
      now: this.props.location.state.now + 1800000
    };
  }

  componentDidMount () {
    this.findWeb3();
    this.timeOutWeb3();
  }

  async getWallet () {
    const walletAndPrice = await axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/walletandprice/${this.props.location.search.substring(1)}`);
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
    } else { // TODO: handle inadequate wallet address
      console.log(walletAndPrice.data);
    }
  }

  async findWeb3 () {
    const vip = this.props.location.state.vip;
    if (vip) {
      this.vip();
    } else {
      const results = await getWeb3;
      if (results.error) {
        this.setState({ web3error: true });
      } else {
        this.setState({
          web3: results.web3
        }, () => this.instantiateContract());
      }
    }
  }

  timeOutWeb3 () {
    window.setTimeout(() => {
      if (!this.state.web3) {this.findWeb3()};
    }, 1000);
  }
  
  vip () {
    this.setState({ transactionStatus: 'vip', fromAddress: 'vipcaller' }, () => this.isDisabled());
  }

  waitForReceipt (hash, cb) {
    if (this.state.transactionStatus !== 'mining') {
      axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/addpending/${this.props.location.search.substring(1)}`,
        {
          start_time: new Date(this.props.location.state.startTime)
        }
      );
      this.setState({ transactionStatus: 'mining', now: Date.now() + 1800000 });
    }
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
    if (telIsValid && email && (this.state.transactionStatus === 'mined' || this.state.transactionStatus === 'vip')) {
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

  async submit (e) {
    let search = this.props.location.search;
    if (search.charAt(0) === '?') {
      search = search.slice(1);
    }
    e.preventDefault();
    const start = this.props.location.state.startTime;
    const { isAuthenticated } = this.props.auth;
    const { getAccessToken } = this.props.auth;
    if (isAuthenticated()) {
      const headers = { Authorization: `Bearer ${getAccessToken()}` };
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_USERS_SERVICE_URL}/conversations/${search}`,
          {
            phone_number: phoneUtil.format(this.state.pnf, PNF.E164),
            message: this.state.message,
            email: this.state.email,
            start_time: new Date(start),
            fromAddress: this.state.fromAddress,
            transactionStatus: this.state.transactionStatus
          }, { headers }
        );
        if (!response.data.whitelisted) {
          throw new Error('something went wrong with a booking!');
        }
        this.setState({
          anonymous_phone_number: response.data.anonymous_phone_number, hostFirstName: response.data.hostFirstName
        }, () => this.setState({ open: true }));
        return 'number is whitelisted';
      } catch (err) {
        this.setState({ errorTitle: `Something went wrong.  But don't worry, we just got a notification and will make sure to reach out if anything is wrong` }, () => this.handleOpenError())
        await axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/senderror`,
          {
            err: `${err.message} --THIS WAS IN THE SUBMIT FOR CALL STEP`,
            email: this.state.email
          }
        );
      }
    } else {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_USERS_SERVICE_URL}/conversations/${search}`,
          {
            phone_number: phoneUtil.format(this.state.pnf, PNF.E164),
            message: this.state.message,
            email: this.state.email,
            start_time: new Date(start),
            fromAddress: this.state.fromAddress,
            transactionStatus: this.state.transactionStatus
          });
        if (!response.data.whitelisted) {
          throw new Error('something went wrong with a booking!');
        }
        this.setState({
          anonymous_phone_number: response.data.anonymous_phone_number, hostFirstName: response.data.hostFirstName
        }, () => this.setState({ open: true }));
        return 'number is whitelisted';
      } catch (err) {
        this.setState({errorTitle: `Something went wrong.  But don't worry, we just got a notification and will make sure to reach out if anything is wrong`}, () => this.handleOpenError())
        await axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/senderror`,
          {
            err: `${err.message} --THIS WAS IN THE SUBMIT FOR CALL STEP`,
            email: this.state.email
          }
        );
      }
    }
    return 'number is whitelisted';
  }

  render () {
    const Completionist = () => (
      <div className="col-md-6 col-md-offset-3">
        <div style={{ textAlign: 'center', paddingTop: '20px' }} >
          Sorry... time's up.  Please <Link to={`/availability/${this.props.location.search.substr(1)}`}> go back a page and try again</Link>.  If your payment already went through, please contact admin@dimpull.com
        </div>
      </div>
    );
    const renderer = ({ minutes, seconds, completed }) => {
      if (completed) {
        // Render a completed state
        return <Completionist />;
      }
      return (
        <div className="col-md-6 col-md-offset-3">
          <div style={{ textAlign: 'center', paddingTop: '20px' }} >
            <IconButton style={{ float: 'left' }} iconClassName="fas fa-clock" disabled />
            <p id="timer">{minutes}:{seconds} left to book this call.</p>
          </div>
          <Paper style={style}>
            <div className="text-center">
              <h2>Enter Your Number and Pay with ETH</h2>
              <p> A different phone number will show up in caller ID.</p>
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
                    floatingLabelText="Message for expert (optional)"
                    type="text"
                    // style={{ paddingTop: '8px' }}
                    onChange={e => this.changeValue(e, 'message')}
                  />
                </div>
                <div>
                  <TextField
                    floatingLabelText="Email address"
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
              title={`Call is booked.  You can call ${this.state.hostFirstName} at ${this.props.location.state.startTime} at this number: ${this.state.anonymous_phone_number}.
                Make sure to save it somewhere!  You will also recieve an email with this info.`}
              actions={actions}
              modal={false}
              open={this.state.open}
              onRequestClose={() => this.handleClose()}
            />
            <Dialog
              title={this.state.errorTitle}
              actions={actions}
              modal={false}
              open={this.state.openError}
              onRequestClose={() => this.handleErrorClose()}
            />
          </Paper>
        </div>
      );
    };

    const actions = [
      <FlatButton
        label="Okay"
        primary
        keyboardFocused
        onClick={() => this.handleClose()}
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
        <div key="waiting" >
          <IconButton iconClassName="fas fa-times-circle" disabled />
          {' '}
          <div>
            <div style={{ fontWeight: '600' }}>Payment Not Sent - Open MetaMask</div>
            <div>If MetaMask is not prompting you for a transaction, <span style={{ fontWeight: 'bold' }}>try refreshing this page.</span></div>
            <div>If you see multiple transactions pending in MetaMask, reject all and refresh this page.</div>
          </div>
        </div>
      ];
    } else if (this.state.transactionStatus === 'mining') {
      transaction = [
        <div key="mining">
          <div><CircularProgress /></div>
          {' '}Please wait for the transaction to be mined...
          {' '}(added 30 minutes to your time left to book)
        </div>
      ];
    } else if (this.state.transactionStatus === 'mined') {
      transaction = [
        <div key="mined">
          <div><IconButton iconClassName="fas fa-check" disabled /></div>
          {' '}Transaction Accepted.
        </div>
      ];
    } else if (this.state.transactionStatus === 'vip') {
      transaction = [
        <div key="vip">
          <div><IconButton iconClassName="fas fa-check" disabled /></div>
          {' '}This is your free call.
        </div>
      ];
    }
    return (
      <Countdown
        date={this.state.now}
        renderer={renderer}
      />
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
