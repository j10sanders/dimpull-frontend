import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import axios from 'axios';
import history from '../../history';

const style = {
    marginTop: 50,
    paddingBottom: 50,
    paddingTop: 25,
    width: '100%',
    textAlign: 'center',
    display: 'inline-block',
};

class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      price_error_text: null,
      description: '',
      image: '',
      otherProfile: '',
      price: '',
      disabled: true,
    };
  }

	componentDidMount(){
		const { isAuthenticated } = this.props.auth;
		const { getAccessToken } = this.props.auth;
		let headers = {}
		if ( isAuthenticated()) {
			headers = { 'Authorization': `Bearer ${getAccessToken()}`}
		}
		axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/editdiscussion${this.props.location.search}`, {headers})
		.then((response) => {
			console.log(response.data)
			this.setState({
			  	price: response.data.price,
			    image: response.data.image_url,
			    description: response.data.description,
			    otherProfile: response.data.otherProfile
			})
		})
		.catch(function (error) {
		  console.log(error)
		})
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
		const { isAuthenticated } = this.props.auth;
		if ( isAuthenticated()) {
		    axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/editdiscussion${this.props.location.search}`, { 
		        user_id: this.state.profile.sub,
		        description: this.state.description,
		        image_url: this.state.image,
		        otherProfile: this.state.otherProfile,
		        price: this.state.price,
		    }
		    ).then(function (response) {
		        console.log(response)
		        history.replace('/calendar');
		    })
		}
	}

  	render() {
	    const { isAuthenticated } = this.props.auth;
	    console.log(this.state)
	  	return (
	    <div>
	    {isAuthenticated() && (
	      <div className="col-md-6 col-md-offset-3" onKeyPress={(e) => this._handleKeyPress(e)}>
	        <Paper style={style}>
	          <div className="text-center">
	            <h2>Create a Discussion Profile</h2>
	            <div className="col-md-12">
	            <TextField
	                hintText= {`${this.state.profile.given_name} ${this.state.profile.family_name}`}
	                type="name"
	                disabled={true}
	              />
	              <TextField
	                hintText="Area of expertise"
	                floatingLabelText="Discussion Topic"
	                type="description"
	                value={this.state.description}
	                // errorText={this.state.description_error_text}
	                onChange={(e) => this.changeValue(e, 'description')}
	                // fullWidth={true}
	              />
	              <TextField
	                hintText="URLs only (accepting uploads soon)"
	                floatingLabelText="Image URL"
	                type="text"
	                value={this.state.image}
	                // errorText={this.state.tel_error_text}
	                onChange={(e) => this.changeValue(e, 'image')}
	              />
	              <TextField
	                hintText="Link to another site's profile"
	                floatingLabelText="Your profile, blog, twitter, etc..."
	                type="otherProfile"
	                value={this.state.otherProfile}
	                // errorText={this.state.tel_error_text}
	                onChange={(e) => this.changeValue(e, 'otherProfile')}
	              />
	              <TextField
	                hintText=""
	                floatingLabelText="Price Per Minute (in Ether)"
	                type="price"
	                value={this.state.price}
	                errorText={this.state.price_error_text}
	                onChange={(e) => this.changeValue(e, 'price')}
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
export default EditProfile; 