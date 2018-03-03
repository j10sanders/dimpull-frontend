import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import axios from 'axios';
import history from '../../history';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {timezones} from '../../timezones/timezones';
import Subheader from 'material-ui/Subheader';

const style = {
    marginTop: 50,
    paddingBottom: 50,
    paddingTop: 25,
    width: '100%',
    textAlign: 'center',
    display: 'inline-block',
};

const underStyle = {
    marginTop: 10,
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
      timezone: 'America/New_York',
      etherPrice: '',
      who: '',
	  origin: '',
	  excites: '',
	  helps: '',
    };
  }

  	etherPrice(){
  		axios.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD')
			.then(res => {
				this.setState({etherPrice: res.data.USD})
			})
  	}

	componentDidMount(){
		this.etherPrice();
		const { isAuthenticated } = this.props.auth;
		const { getAccessToken } = this.props.auth;
		let headers = {}
		if ( isAuthenticated()) {
			headers = { 'Authorization': `Bearer ${getAccessToken()}`}
		}
		axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/editdiscussion${this.props.location.search}`, {headers})
		.then((response) => {
			this.setState({
			  	price: response.data.price,
			    image: response.data.image_url,
			    description: response.data.description,
			    otherProfile: response.data.otherProfile,
			    timezone: response.data.timezone,
			    origin: response.data.origin,
			    excites: response.data.excites,
			    helps: response.data.helps,
			    who: response.data.who,

			}, () => {this.isDisabled(); console.log(response)})
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
		if (type === "price"){
			this.etherPrice();
		}
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
		        timezone: this.state.timezone,
		        origin: this.state.origin,
		        excites: this.state.excites,
		        helps: this.state.helps,
		        who: this.state.who,
		    }
		    ).then(function (response) {
		        console.log(response)
		        history.replace('/calendar');
		    })
		}
	}

	selectTimezone(event, index, value) {
		this.setState({timezone: value})
	}

  	render() {
	    const { isAuthenticated } = this.props.auth;
	  	return (
	    <div>
	    {isAuthenticated() && (
	      <div className="col-md-6 col-md-offset-3" onKeyPress={(e) => this._handleKeyPress(e)}>
	        <Paper style={style}>
	          <div className="text-center">
	            <h2>Edit your Discussion Profile</h2>
	            <div className="col-md-12">
	            {this.state.profile.given_name && (
	              <TextField
	                hintText= {`${this.state.profile.given_name} ${this.state.profile.family_name}`}
	                type="name"
	                disabled={true}
	                fullWidth={true}
	              />
	              )}
	            {(!this.state.profile.given_name && this.state.profile[`${process.env.REACT_APP_AUTH0_DOMAIN}`]) && (
	              <TextField
	                hintText= {`${this.state.profile[`${process.env.REACT_APP_AUTH0_DOMAIN}`].given_name} ${this.state.profile[`${process.env.REACT_APP_AUTH0_DOMAIN}`].family_name}`}
	                type="name"
	                disabled={true}
	                fullWidth={true}
	              />
	              )}
	              <TextField
	                hintText="Area of expertise"
	                floatingLabelText="Discussion Topic"
	                type="description"
	                value={this.state.description}
	                // errorText={this.state.description_error_text}
	                onChange={(e) => this.changeValue(e, 'description')}
	                fullWidth={true}
	              />
	              <TextField
	                hintText="URLs only (accepting uploads soon)"
	                floatingLabelText="Image URL"
	                type="text"
	                value={this.state.image}
	                fullWidth={true}
	                // errorText={this.state.tel_error_text}
	                onChange={(e) => this.changeValue(e, 'image')}
	              />
	              {this.state.image && (
	                <img src={this.state.image} style={{width: '50%'}} alt={this.state.image} />
	              )}
	              <TextField
	                hintText="Link to another site's profile"
	                floatingLabelText="Your profile, blog, twitter, etc..."
	                type="otherProfile"
	                value={this.state.otherProfile}
	                fullWidth={true}
	                // errorText={this.state.tel_error_text}
	                onChange={(e) => this.changeValue(e, 'otherProfile')}
	              />
	              <SelectField
	            	floatingLabelText="Timezone"
			        value={this.state.timezone}
			        onChange={(event, index, value) => this.selectTimezone(event, index, value, "id")}
			        maxHeight={200}
			        fullWidth={true}
			        style={{textAlign: 'start'}}
			      >
			        {timezones.map((timezone) => <MenuItem value={timezone.value} key={timezone.value} primaryText={timezone.name} />)}
			      </SelectField>
			      <TextField
	                // hintText="To combat volatility, the price is tied to the dollar. So the amount of Ether charged will be determined at the beginning of each call."
	                floatingLabelText="Price Per Minute (in dollars)"
	                type="price"
	                value={this.state.price}
	                errorText={this.state.price_error_text}
	                fullWidth={true}
	                onChange={(e) => this.changeValue(e, 'price')}
	              />
	              <p> Currently one Ether is {this.state.etherPrice} dollars, so your price would be {this.state.price/this.state.etherPrice} Ether/minute.  
	              It will be set at the beginning of each call. We do this to combat volatility.</p>
	              <p>Note that your price will appear 18.5% higher to callers, since dimpull collects that percent.</p>
	            </div>
	            </div>
	        	</Paper>


	           <Paper style={underStyle}>
              <div className="text-center">
              <h3>Don't be shy...</h3>
              <div className="col-md-12">

              <div style={{textAlign: 'left'}}>
                <TextField
                  hintText="Who are you?"
                  floatingLabelText="Who are you?"
                  type="who"
                  fullWidth={true}
                  value={this.state.who}
                  // errorText={this.state.tel_error_text}
                  multiLine={true}
                  rows={2}
                  rowsMax={6}
                  onChange={(e) => this.changeValue(e, 'who')}
                />
                <Subheader style={{paddingLeft: "0px", marginTop: "-14px"}}>This is a good place to brag of your success and convince users that it is worth their ETH to speak to you.</Subheader>
                </div>
                <div style={{textAlign: 'left', paddingTop: '30px'}}>

                <TextField
                  hintText="What is your crypto origin story?"
                  floatingLabelText="What is your crypto origin story?"
                  type="origin"
                  fullWidth={true}
                  value={this.state.origin}
                  // errorText={this.state.tel_error_text}
                  multiLine={true}
                  rows={2}
                  rowsMax={6}
                  onChange={(e) => this.changeValue(e, 'origin')}
                />
                <Subheader style={{paddingLeft: "0px", marginTop: "-14px"}}>Let newer crypto enthusiasts know what got you started.</Subheader>
                </div>

                 <div style={{textAlign: 'left', paddingTop: '30px'}}>
                <TextField
                  hintText="What excites you about blockchain technology?"
                  floatingLabelText="What excites you about blockchain technology?"
                  type="excites"
                  value={this.state.excites}
                  fullWidth={true}
                  // errorText={this.state.tel_error_text}
                  multiLine={true}
                  rows={2}
                  rowsMax={6}
                  onChange={(e) => this.changeValue(e, 'excites')}
                />
                <Subheader style={{paddingLeft: "0px", marginTop: "-14px"}}>Privacy, Voting, Contracts, Finance, Patents/Copyrights, Collectibles, Investing, etc...</Subheader>
                </div>

                 <div style={{textAlign: 'left', paddingTop: '30px'}}>
                <TextField
                  hintText="What can you help callers with?"
                  floatingLabelText="What can you help callers with?"
                  type="helps"
                  value={this.state.helps}
                  fullWidth={true}
                  // errorText={this.state.tel_error_text}
                  multiLine={true}
                  rows={2}
                  rowsMax={6}
                  onChange={(e) => this.changeValue(e, 'helps')}
                />
                <Subheader style={{paddingLeft: "0px", marginTop: "-14px"}}>Suggestion: Provide questions that you’d like callers to ask you</Subheader>
                </div>

	            <RaisedButton
	              disabled={this.state.disabled}
	              style={{ marginTop: 50 }}
	              label="Submit"
	              onClick={(e) => this.submit(e)}
	            />
	            </div>
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