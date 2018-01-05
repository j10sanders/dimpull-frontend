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


class GetNumber extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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

  componentWillMount() {
    this.setState({ profile: {} });
    const { userProfile, getProfile } = this.props.auth;
    if (!userProfile) {
      getProfile((err, profile) => {
        this.setState({ profile });
      });
    } else {
      this.setState({ profile: userProfile });
    }
  }

  componentDidMount(){

  }
  submit(e) {
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/register`,
        {
        user_id: this.state.profile.sub,
        phone_number: this.state.tel,
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
            <p> Don't worry, we aren't sharing this with anyone.  You will get a "masked number" that can be shared. </p>
            <div className="col-md-12">
              <TextField
                hintText="Phone number"
                floatingLabelText="Phone number"
                type="tel"
                errorText={this.state.tel_error_text}
                onChange={(e) => this.changeValue(e, 'tel')}
                defaultValue="+1"
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
export { GetNumber }; 