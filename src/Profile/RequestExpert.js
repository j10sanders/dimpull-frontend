import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import axios from 'axios';
import history from '../history';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const style = {
    marginTop: 50,
    paddingBottom: 50,
    paddingTop: 25,
    width: '100%',
    textAlign: 'center',
    display: 'inline-block',
};

class RequestExpert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: '',
      otherProfile: '',
      message: '',
      email: '',
    };
  }

	componentDidMount(){
		const { isAuthenticated } = this.props.auth;
		const { getAccessToken } = this.props.auth;
		let headers = {}
		if ( isAuthenticated()) {
			headers = { 'Authorization': `Bearer ${getAccessToken()}`}
		}
    }

    _handleKeyPress(e) {
      if (e.key === 'Enter') {
            this.login(e);
      }
    }


	changeValue(e, type) {
	    const value = e.target.value;
	    const next_state = {};
	    next_state[type] = value;
	    this.setState(next_state);
  	}

  	componentWillMount() {
	    this.setState({ profile: {} });
	    const { userProfile, getProfile } = this.props.auth;
	    if (!userProfile) {
	      	getProfile((err, profile) => {
	        this.setState({ profile });
	        this.setState({email: profile.email})
	      });
	    } else {
	      this.setState({ profile: userProfile });
	      this.setState({email: userProfile.email})
	    }
	}

 	submit(e) {
		const { isAuthenticated } = this.props.auth;
		if ( isAuthenticated()) {
		    axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/editdiscussion${this.props.location.search}`, { 
		        user_id: this.state.profile.sub,
		        description: this.state.description,
		        image_url: this.state.image,
		        otherProfile: this.state.otherProfile,
		        price: this.state.price,
		        timezone: this.state.timezone,
		    }
		    ).then(function (response) {
		        console.log(response)

		    })
		}
	}

  	render() {
  				console.log(this.state.profile)
	    const { isAuthenticated } = this.props.auth;
	  	return (
	    <div>
	    {isAuthenticated() && (
	      <div className="col-md-6 col-md-offset-3" onKeyPress={(e) => this._handleKeyPress(e)}>
	        <Paper style={style}>
	          <div className="text-center">
	            <h2>Request "Expert" status, so you can create a Discussion Profile.</h2>
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
	                hintText="Link to another site's profile"
	                floatingLabelText="Your profile, blog, twitter, etc..."
	                type="otherProfile"
	                value={this.state.otherProfile}
	                onChange={(e) => this.changeValue(e, 'otherProfile')}
	              />
	              <TextField
	                hintText="Email"
	                floatingLabelText="Email"
	                type="email"
	                defaultValue={this.state.profile.email}
	                value={this.state.email}
	                onChange={(e) => this.changeValue(e, 'email')}
	              />
	              <TextField
	                hintText="Message for Dimpull admins"
	                floatingLabelText="Message for Dimpull Admins"
	                type="message"
	                value={this.state.message}
	                onChange={(e) => this.changeValue(e, 'message')}
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
	     )}
		{!isAuthenticated() && (
	    	<h4> You aren't logged in</h4> )}
	    </div>
  		);
	}

}
export default RequestExpert; 