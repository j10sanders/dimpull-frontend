import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import axios from 'axios';
import history from '../../history';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {timezones} from '../../timezones/timezones';
// import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
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

// const innerStyle = {
//   paddingBottom: 50,
//   width: '100%',
// }

const textStyle ={
  textAlign: 'start',
  width: '80%'
}


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
      timezone: '',
      etherPrice: '',
      email: '',
      message: '',
      open: false,
      waiting: false,
      who: '',
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
      // if (!this.state.disabled) {
      //     this.login(e);
      // }
    }
  }

  componentWillMount() {
    this.setState({ profile: {} });
    const { isAuthenticated } = this.props.auth;
    if ( !isAuthenticated()) {
      this.props.auth.login('newProfile');
    }

    const { userProfile, getProfile } = this.props.auth;
    if (!userProfile) {
      getProfile((err, profile) => {
        if (profile){
          this.setState({ profile, email: profile.email });
        }
        else{
          this.setState({ profile: userProfile, email: userProfile.email });
        }
      });
    } else {
      this.setState({profile:userProfile})
    }
  }

  etherPrice(){
    axios.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD')
      .then(res => {
        // const ether = res.data;
        this.setState({etherPrice: res.data.USD})
      })
  }

  componentDidMount() {
    const { isAuthenticated } = this.props.auth;
    const { getAccessToken } = this.props.auth;
    let headers = {}
    if ( isAuthenticated()) {
      headers = { 'Authorization': `Bearer ${getAccessToken()}`}
      axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/register`, {
        headers
      })
     .then((response) => {
      console.log(response)
        if (response.data === "register phone"){
          // history.push('/getNumber');
        }
        else if (response.data.dp) {
          history.push(`/discussionProfile?id=${response.data.dp}`)
        }
        else{
          this.getDiscussion(headers);
        }
      }).catch(function (error) {
            console.log(error)
          })
    }

    this.etherPrice();
    this.setState({timezone: Intl.DateTimeFormat().resolvedOptions().timeZone})

    if ( isAuthenticated()) {
      headers = { 'Authorization': `Bearer ${getAccessToken()}`}
    }
      axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/getprofile`, {headers})
        .then((response) => {
          this.setState({expert: response.data.expert})
          })
        .catch(function (error) {
          console.log(error)
        })
    }

  
  async submit(e) {
    e.preventDefault();
    this.setState({waiting: true})
    const res = await axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/discussions/new`,
        {
        user_id: this.state.profile.sub,
        description: this.state.description,
        image_url: this.state.image,
        otherProfile: this.state.otherProfile,
        price: this.state.price,
        timezone: this.state.timezone,
        email: this.state.email,
        message: this.state.message,
        who: this.state.who,
    }
    )
    this.setState({waiting: false})
    console.log(res)
    this.setState({open: true});
  }

  handleOpen(evt) {
    this.setState({open: true, event: evt});
  }
  
  handleClose() {
    this.setState({open: false});
    history.replace('/')
  }

  render() {
    const { isAuthenticated } = this.props.auth;
    const actions = [
      <FlatButton
        label="Sounds good"
        primary={true}
        onClick={() => this.handleClose()}
      />,
    ];
    let display = this.state.waiting ? 'none': 'inherit'
    let waiting = this.state.waiting ? 'inherit': 'none'
    return (
    <div>
    <CircularProgress style={{display: waiting}} size={80} thickness={5} />
    {isAuthenticated() && (
      <div className="col-md-6 col-md-offset-3" onKeyPress={(e) => this._handleKeyPress(e)} style={{display: display}}>
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
                style={textStyle}
                fullWidth={true}
              />
              )}
              <TextField
                hintText="Area of expertise"
                floatingLabelText="Discussion Topic"
                type="description"
                style={textStyle}
                // errorText={this.state.description_error_text}
                onChange={(e) => this.changeValue(e, 'description')}
                fullWidth={true}
              />
              <TextField
                hintText="URLs only (accepting uploads soon)"
                floatingLabelText="Image URL"
                type="text"
                fullWidth={true}
                style={textStyle}
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
                fullWidth={true}
                style={textStyle}
                // errorText={this.state.tel_error_text}
                onChange={(e) => this.changeValue(e, 'otherProfile')}
              />
              <SelectField
                floatingLabelText="Timezone"
                value={this.state.timezone}
                onChange={(event, index, value) => this.selectTimezone(event, index, value, "id")}
                maxHeight={200}
                fullWidth={true}
                style={textStyle}
              >
                {timezones.map((timezone) => <MenuItem value={timezone.value} key={timezone.value} primaryText={timezone.name} />)}
              </SelectField>
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
                  // errorText={this.state.tel_error_text}
                  multiLine={true}
                  rows={2}
                  rowsMax={6}
                  onChange={(e) => this.changeValue(e, 'who')}
                />
                <Subheader style={{paddingLeft: "0px", marginTop: "-14px"}}>This is a good place to brag of your success and convince users that it is worth their ETH to speak to you.</Subheader>
                </div>

                
                </div>
                </div>
                </Paper>
              
              <Paper style={underStyle}>
              <div className="text-center">
              <div className="col-md-12">
              <TextField
                  // hintText="To combat volatility, the price is tied to the dollar. So the amount of Ether charged will be determined at the beginning of each call."
                  floatingLabelText="Price for 30min call (in dollars)"
                  type="price"
                  value={this.state.price}
                  errorText={this.state.price_error_text}
                  onChange={(e) => this.changeValue(e, 'price')}
                  style={{textAlign: 'start', width:"80%"}}
                  fullWidth={true}
                />
                <p style={{marginBottom: '20px'}}> Currently one Ether is {this.state.etherPrice} dollars, so your price would be {this.state.price/this.state.etherPrice} per 30 minute call.  <b>You can always change this later.</b></p>
               </div>
               </div>
               </Paper>

               <Paper style={underStyle}>
          <div className="text-center">
          <h3 style={{marginTop: '30px', paddingLeft: "4%", paddingRight: "4%"}}> Before your profile is public, the dimpull admins will check to be sure you're a good fit. </h3>
            <div className="col-md-12">

              {!this.state.expert && 
                <div style={{paddingTop: '20px'}}>
                
                <TextField
                  hintText="Message for dimpull admins"
                  floatingLabelText="Message for dimpull Admins"
                  type="message"
                  value={this.state.message}
                  onChange={(e) => this.changeValue(e, 'message')}
                  multiLine={true}
                  rows={2}
                  rowsMax={6}
                  style={{textAlign: 'start', width: '95%'}}
                  fullWidth={true}
                />
                <TextField
                  hintText="Email"
                  floatingLabelText="Email"
                  type="email"
                  defaultValue={this.state.profile.email}
                  value={this.state.email}
                  style={{textAlign: 'start', width: '95%'}}
                  onChange={(e) => this.changeValue(e, 'email')}
                  fullWidth={true}
                />
                </div>
              }
            </div>
            <RaisedButton
              disabled={this.state.disabled}
              style={{ marginTop: 50 }}
              label="Submit"
              onClick={(e) => this.submit(e)}
            />
          </div>
          <Dialog
            title="Thanks for your application.  The dimpull admins will get back to you shortly."
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={() => this.handleClose.bind(this)}
          >
          </Dialog>
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