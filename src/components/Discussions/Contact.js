import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import axios from 'axios';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import history from '../../history';

const style = {
    marginTop: 50,
    paddingBottom: 50,
    paddingTop: 25,
    width: '100%',
    textAlign: 'center',
    display: 'inline-block',
};

class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      tel: '',
      tel_error_text: null,
      disabled: true,
      startTime: null,
      open: false,
    };
  }

  componentDidMount() {
    const { isAuthenticated } = this.props.auth;
    const { getAccessToken } = this.props.auth;
    if ( isAuthenticated()) {
      const headers = { 'Authorization': `Bearer ${getAccessToken()}`}
      axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/getprofile`, {headers})
        .then((response) => {
          if (response.data.phone_number){
            this.setState({tel: response.data.phone_number, telReceived: true})
          } 
          })
        .catch(function (error) {
          console.log(error)
      })
    } 
  }



  isDisabled() {
    let tel_is_valid = false;
    if (this.state.telReceived) {
      this.setState({
                disabled: false,
            });
    }else if (this.state.tel === '' || !this.state.tel) {
        this.setState({
            tel_error_text: null,
        });
    } else if (this.state.tel.length >=15  && this.state.tel.length <17) {
        this.setState({
            tel_error_text: null,
        });
        tel_is_valid = true;
    }else {
        this.setState({
            tel_error_text: 'Enter a valid phone number (+1-917-555-7777)',
        });
    }
    if (tel_is_valid) {
            this.setState({
                disabled: false,
            });
        }
  }

  changeValue(e, type) {
    const value = e.target.value;
    const next_state = {};
    next_state[type] = value;
    this.setState(next_state, () => {
        this.isDisabled();
    });
  }

  _handleKeyPress(e) {
    if (e.key === 'Enter') {
      if (!this.state.disabled) {
          this.login(e);
      }
    }
  }

  handleOpen(){
    this.setState({open: true});
  };

  handleClose(){
    this.setState({open: false});
    history.push({
      pathname: '/discussions',
    })
  };
  
  submit(e) {
    e.preventDefault();
    const start = this.props.location.state.startTime
    //TODO add real error handling if time is now in the past.
    if (start < new Date()){
      console.log("TOO EARLT FOO")
    } else{
      const { isAuthenticated } = this.props.auth;
      const { getAccessToken } = this.props.auth;
      if ( isAuthenticated()) {
        const headers = { 'Authorization': `Bearer ${getAccessToken()}`}
        axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/conversations/${this.props.location.search}`,
          {
          phone_number: this.state.tel,
          message: this.state.message,
          start_time: new Date(start),
          }, {headers}
        ).then(function (response) {
        if (response.data !== 'whitelisted'){
          console.log("ERROR, not whitelisted")
        }
        else{
          return "number is whitelisted"
        }
        //redirect to create profile
        }).catch(function (error) {
          console.log(error, "ERROR")
          this.setState({tel_error_text: error});
        // this.props.registerUser(this.state.email, this.state.password, this.state.redirectTo);
      })
      } else {
        axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/conversations/${this.props.location.search}`,
          {
          phone_number: this.state.tel,
          message: this.state.message,
          start_time: new Date(start),
          }
        ).then(function (response) {
        if (response.data !== 'whitelisted'){
          console.log("ERROR, not whitelisted")
        }
        else{
          return "number is whitelisted"
        }
        //redirect to create profile
        }).catch(function (error) {
          console.log(error, "ERROR")
          this.setState({tel_error_text: error});
        // this.props.registerUser(this.state.email, this.state.password, this.state.redirectTo);
      })
      }
      ;
  }
}



  render() {
    const actions = [
      <FlatButton
        label="Okay"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose}
      />,
    ];
    return (
      <div className="col-md-6 col-md-offset-3" onKeyPress={(e) => this._handleKeyPress(e)}>
        <Paper style={style}>
          <div className="text-center">
            <h2>Please provide your phone number.</h2>
            <p> Don't worry, we aren't sharing this, and a different number will show up in caller ID.</p>
            <div className="col-md-12">
              {this.state.telReceived && 
                <TextField
                  hintText="Phone number"
                  floatingLabelText="Phone number"
                  type="tel"
                  errorText={this.state.tel_error_text}
                  // onChange={(e) => this.changeValue(e, 'tel')}
                  defaultValue={this.state.tel}
                  disabled={true}
                />
              }
              {!this.state.telReceived &&
                <TextField
                  hintText="Phone number"
                  floatingLabelText="Phone number"
                  type="tel"
                  errorText={this.state.tel_error_text}
                  onChange={(e) => this.changeValue(e, 'tel')}
                  defaultValue="+1-"
                />
              }
              
              <TextField
                hintText="Message for Expert"
                floatingLabelText="Message"
                type="text"
                // errorText={this.state.tel_error_text}
                onChange={(e) => this.changeValue(e, 'message')}
                defaultValue="Hi, "
                fullWidth={true}
              />
            </div>
            <RaisedButton
              disabled={this.state.disabled}
              style={{ marginTop: 50 }}
              label="Submit"
              onClick={(e) => this.submit(e)}
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
export default Contact; 