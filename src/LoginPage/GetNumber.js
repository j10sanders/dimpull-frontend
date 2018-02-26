import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import axios from 'axios';
import history from '../history';

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
      lname_error_text: null,
      disabled: true,
      hasName: false,
      needNames: false,
    };
  }

  isDisabled() {
    let tel_is_valid = false;

    if (this.state.tel === '' || !this.state.tel) {
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

    if (tel_is_valid && (this.state.hasName || (!this.state.hasName && this.state.last_name != null && this.state.first_name != null)))  {
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
        console.log(profile)
        if (profile.given_name) {
          this.setState({hasName: true, 
            first_name: profile.given_name,
            last_name: profile.family_name,
          })
        } else if (profile['https://jonsanders:auth0:com/user_metadata']){
          this.setState({hasName: true, 
            first_name: profile['https://jonsanders:auth0:com/user_metadata'].given_name,
            last_name: profile['https://jonsanders:auth0:com/user_metadata'].family_name,
          })
        }
      });
    } else {
        this.setState({ profile: userProfile });
        if (userProfile.given_name) {
          this.setState({hasName: true, 
            first_name: userProfile.given_name,
            last_name: userProfile.family_name,
          })
        } else if (userProfile['https://jonsanders:auth0:com/user_metadata']){
          this.setState({hasName: true, 
            first_name: userProfile['https://jonsanders:auth0:com/user_metadata'].given_name,
            last_name: userProfile['https://jonsanders:auth0:com/user_metadata'].family_name,
          })
        }
    }

  }

  submit(e) {
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/register`,
        {
        user_id: this.state.profile.sub,
        phone_number: this.state.tel,
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        auth_pic: this.state.profile.picture,
    }
    ).then(function (response) {
        console.log(response)
        history.replace('/discussions');
    })
  }

  render() {
    console.log(this.state)
      return (
        <div className="col-md-6 col-md-offset-3" onKeyPress={(e) => this._handleKeyPress(e)}>
          <Paper style={style}>
          { !this.state.hasName && (
            <div>
            <div className="text-center">
              
              <div className="col-md-12">
                <TextField
                  hintText="First Name"
                  floatingLabelText="First Name"
                  type="name"
                  errorText={this.state.fname_error_text}
                  onChange={(e) => this.changeValue(e, 'first_name')}
                />
              </div>
              </div>

              <div className="text-center">
              
              <div className="col-md-12">
                <TextField
                  hintText="Last Name"
                  floatingLabelText="Last Name"
                  type="name"
                  errorText={this.state.lname_error_text}
                  onChange={(e) => this.changeValue(e, 'last_name')}
                />
              </div>
              </div>
              </div>
            )}
            <div className="text-center">
              <h2>Please provide your phone number.</h2>
              <p> Don't worry, we aren't sharing this, and we won't use it for anything aside from facilitating calls on dimpull.  
                Experts get a "masked number" that will be shared, and they won't see users' numbers in caller-id.</p>
              <div className="col-md-12">
                <TextField
                  hintText="Phone number"
                  floatingLabelText="Phone number"
                  type="tel"
                  errorText={this.state.tel_error_text}
                  onChange={(e) => this.changeValue(e, 'tel')}
                  defaultValue="+1-"
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