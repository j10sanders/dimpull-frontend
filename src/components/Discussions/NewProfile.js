import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import axios from 'axios';
import history from '../../history';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {timezones} from '../../timezones/timezones';

const style = {
    marginTop: 50,
    paddingBottom: 50,
    paddingTop: 25,
    width: '100%',
    textAlign: 'center',
    display: 'inline-block',
};


class newProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      price_error_text: null,
      description: '',
      image: '',
      otherProfile: '',
      price: '',
      disabled: true,
      timezone: 'America/New_York',
    };
  }

  isDisabled() {
    let price_is_valid = false;

    
    if (this.state.price.length === 0) {
        this.setState({
            price_error_text: null,
        });
    } else if (!isNaN(this.state.price) && Number(this.state.price) > 0){
        price_is_valid = true;
        this.setState({
          price_error_text: null,
        })
    } else {
        this.setState({
            price_error_text: 'Enter a valid number, greater than 0',
        });
    }
    if (this.state.description.length !== 0 && this.state.image.length !== 0 && price_is_valid) {
            this.setState({
                disabled: false,
            });
        }
  }

  selectTimezone(event, index, value) {
    this.setState({timezone: value})
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

  
  submit(e) {
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/discussions/new`,
        {
        user_id: this.state.profile.sub,
        description: this.state.description,
        image_url: this.state.image,
        otherProfile: this.state.otherProfile,
        price: this.state.price,
        timezone: this.state.timezone,
    }
    ).then(function (response) {
        console.log(response)
        history.replace('/calendar');
    })
  }

  render() {
    const { isAuthenticated } = this.props.auth;
  return (
    <div>
    {
          isAuthenticated() && (

      <div className="col-md-6 col-md-offset-3" onKeyPress={(e) => this._handleKeyPress(e)}>
        <Paper style={style}>
          <div className="text-center">
            <h2>Create a Discussion Profile</h2>
            <div className="col-md-12">
            {this.state.profile.given_name && (
              <TextField
                hintText= {`${this.state.profile.given_name} ${this.state.profile.family_name}`}
                type="name"
                disabled={true}
              />
              )}
            {(!this.state.profile.given_name && this.state.profile['https://jonsanders:auth0:com/user_metadata']) && (
              <TextField
                hintText= {`${this.state.profile['https://jonsanders:auth0:com/user_metadata'].given_name} ${this.state.profile['https://jonsanders:auth0:com/user_metadata'].family_name}`}
                type="name"
                disabled={true}
              />
              )}
              <TextField
                hintText="Area of expertise"
                floatingLabelText="Discussion Topic"
                type="description"
                // errorText={this.state.description_error_text}
                onChange={(e) => this.changeValue(e, 'description')}
                // fullWidth={true}
              />
              <TextField
                hintText="URLs only (accepting uploads soon)"
                floatingLabelText="Image URL"
                type="text"
                // errorText={this.state.tel_error_text}
                onChange={(e) => this.changeValue(e, 'image')}
              />
              <TextField
                hintText="Link to another site's profile"
                floatingLabelText="Your profile, blog, twitter, etc..."
                type="otherProfile"
                // errorText={this.state.tel_error_text}
                onChange={(e) => this.changeValue(e, 'otherProfile')}
              />
              <TextField
                hintText=""
                floatingLabelText="Price Per Minute (in Ether)"
                type="price"
                errorText={this.state.price_error_text}
                onChange={(e) => this.changeValue(e, 'price')}
              />
              <SelectField
                floatingLabelText="Timezone"
                value={this.state.timezone}
                onChange={(event, index, value) => this.selectTimezone(event, index, value, "id")}
                maxHeight={200}
                style={{textAlign: 'start'}}
              >
                {timezones.map((timezone) => <MenuItem value={timezone.value} key={timezone.value} primaryText={timezone.name} />)}
              </SelectField>
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
      )}

          {
          !isAuthenticated() && (
            <h4> You aren't logged in</h4> )}
    </div>
  );

  }

}
export default newProfile; 