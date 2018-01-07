import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import axios from 'axios';

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
    };
  }

  isDisabled() {
    let tel_is_valid = false;

    if (this.state.tel === '' || !this.state.tel) {
        this.setState({
            tel_error_text: null,
        });
    } else if (this.state.tel.length >=14  && this.state.tel.length <16) {
        this.setState({
            tel_error_text: null,
        });
        tel_is_valid = true;
    }else {
        this.setState({
            tel_error_text: 'Enter a valid phone number (+1917-555-7777)',
        });
    }
    if (tel_is_valid) {
            this.setState({
                disabled: false,
            });
        }
  }

  changeValue(e, type) {
    // console.log(process.env.REACT_APP_USERS_SERVICE_URL, "undefined?")
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
  
  submit(e) {
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/conversations/${this.props.location.search}`,
        {
        phone_number: this.state.tel,
        message: this.state.message,
    }
    ).then(function (response) {
        console.log(response)
        //redirect to create profile
    })
    // this.props.registerUser(this.state.email, this.state.password, this.state.redirectTo);
  }

  render() {
    console.log(this.state, "state")
  return (
      <div className="col-md-6 col-md-offset-3" onKeyPress={(e) => this._handleKeyPress(e)}>
        <Paper style={style}>
          <div className="text-center">
            <h2>Please provide your phone number.</h2>
            <p> Don't worry, we aren't sharing this.  We can't even see it, and a different number will show up in caller ID.</p>
            <div className="col-md-12">
              <TextField
                hintText="Phone number"
                floatingLabelText="Phone number"
                type="tel"
                errorText={this.state.tel_error_text}
                onChange={(e) => this.changeValue(e, 'tel')}
                defaultValue="+1"
              />
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
        </Paper>
      </div>
  );

  }

}
export default Contact; 