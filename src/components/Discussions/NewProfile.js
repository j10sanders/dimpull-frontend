import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import axios from 'axios';
import history from '../../history';
// import SelectField from 'material-ui/SelectField';
// import MenuItem from 'material-ui/MenuItem';
// import {timezones} from '../../timezones/timezones';
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

const textStyle ={
  textAlign: 'start',
  width: '80%'
}


class newProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      price_error_text: null,
      tel_error_text: null,
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
      tel: '',
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
    if (tel_is_valid && this.state.message.length !== 0 && this.state.otherProfile.length !== 0) {
            this.setState({
                disabled: false,
            });
        }
  }

  changeValue(e, type) {
    if (type === "name"){
      this.getNames(e.target.value)
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

  async checkRegistered(){
    const { getAccessToken } = this.props.auth;
    let headers = { 'Authorization': `Bearer ${getAccessToken()}`}
    try {
      const response = await axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/register`, 
      {headers})
      if (response.data.dp) {
        history.replace(`/discussionProfile?id=${response.data.dp}`)
      } else {
        return
      }
    } catch (err) {
      return
    }
  }

  componentWillMount() {
    const { isAuthenticated } = this.props.auth;
    if (! isAuthenticated()) {
      this.props.auth.login("newProfile")
    }
    this.checkRegistered();
  }

  getEmail(){
    let almostUrl = `https://${process.env.REACT_APP_AUTH0_DOMAIN}/user_metadata`
    let fullUrl = almostUrl.replace(/\./g, ":")
    const { userProfile, getProfile } = this.props.auth;
    if (!userProfile) {
      getProfile((err, profile) => {
        if (profile.email) {
          this.setState({email: profile.email})
        } else if (profile[fullUrl]){
          if (profile[fullUrl].email) {
            this.setState({email: profile[fullUrl].email})
          } 
        } 
      });
    } else {
        if (userProfile.email) {
          this.setState({email: userProfile.email})
        } else if (userProfile[fullUrl]) {
            if (userProfile[fullUrl].email) {
              this.setState({ email: userProfile[fullUrl].email})
            } 
        } 
    }
  }

  getNames(name){
    if (name){
      this.setState({hasName: true, 
              first_name: name.split(' ').slice(0, -1).join(' '),
              last_name: name.split(' ').slice(-1).join(' ')
              })
      return
    }
    let almostUrl = `https://${process.env.REACT_APP_AUTH0_DOMAIN}/user_metadata`
    let fullUrl = almostUrl.replace(/\./g, ":")
    this.setState({ profile: {} });
    const { userProfile, getProfile } = this.props.auth;
    if (!userProfile) {
      getProfile((err, profile) => {
        this.setState({ profile });
        if (profile.given_name) {
          this.setState({hasName: true, 
            first_name: profile.given_name,
            last_name: profile.family_name,
          })
        } else if (profile[fullUrl]){
          if (profile[fullUrl].given_name) {
            this.setState({hasName: true, 
              first_name: profile[fullUrl].given_name,
              last_name: profile[fullUrl].family_name,
            })
          } 
        } else if (profile.name) {
            this.setState({hasName: true, 
              first_name: profile.name.split(' ').slice(0, -1).join(' '),
              last_name: profile.name.split(' ').slice(-1).join(' ')
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
        } else if (userProfile[fullUrl]){
          if (userProfile[fullUrl].given_name){
            this.setState({hasName: true, 
              first_name: userProfile[fullUrl].given_name,
              last_name: userProfile[fullUrl].family_name,
            })
          } 
        } else if (userProfile.name) {
            this.setState({hasName: true, 
              first_name: userProfile.name.split(' ').slice(0, -1).join(' '),
              last_name: userProfile.name.split(' ').slice(-1).join(' ')
            })
          }
        else{
          this.setState({hasName: true, first_name: '',last_name: ''})
        }
    }
  }

  componentDidMount() {
    const { isAuthenticated } = this.props.auth;
    const { getAccessToken } = this.props.auth;
    this.getNames();
    this.getEmail();
    let headers = {}
    if ( isAuthenticated()) {
      headers = { 'Authorization': `Bearer ${getAccessToken()}`}
    }
      axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/getprofile`, {headers})
        .then((response) => {
          this.setState({expert: response.data.expert, tel: response.data.phone_number})
          })
        .catch(function (error) {
          console.log(error)
        })
    }

  
  async submit(e) {
    e.preventDefault();
    this.setState({waiting: true})
    const { isAuthenticated } = this.props.auth;
    const { getAccessToken } = this.props.auth;
    if ( isAuthenticated()) {
      const headers = { 'Authorization': `Bearer ${getAccessToken()}`}
      try{
        await axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/register`,
          {
          // user_id: this.state.profile.sub,
          phone_number: this.state.tel,
          first_name: this.state.first_name,
          last_name: this.state.last_name,
          auth_pic: this.state.profile.picture,
          }, {headers}
       )
      } catch(err) {
        history.push("/")
      }
      try{
        await axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/api/discussions/new`,
          {
            // user_id: this.state.profile.sub,
            // description: this.state.description,
            // image_url: this.state.image,
            otherProfile: this.state.otherProfile,
            // price: this.state.price,
            // timezone: this.state.timezone,
            email: this.state.email,
            message: this.state.message,
            // who: this.state.who,
          }, {headers}
        )
      } catch(err) {
        history.push("/")
      }

      this.setState({waiting: false})
      this.setState({open: true});
    } else {
      this.props.auth.login("newProfile")
    }
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
                <h2>Are you an Expert?</h2>
                <div className="col-md-12">
                  {(this.state.first_name && this.state.last_name) && (
                  <TextField
                    defaultValue={`${this.state.first_name} ${this.state.last_name}`}
                    type="name"
                    style={textStyle}
                    fullWidth={true}
                    floatingLabelText="First and last name"
                    onChange={(e) => this.changeValue(e, 'name')}
                  />
                  )}
                  <TextField
                    hintText="Email (so we can notify you if you get accepted)"
                    floatingLabelText="Email"
                    type="email"
                    // defaultValue={this.state.email}
                    value={this.state.email}
                    style={textStyle}
                    onChange={(e) => this.changeValue(e, 'email')}
                    fullWidth={true}
                  />
                  <TextField
                    hintText="Comma separated if you want to show multiple links"
                    floatingLabelText="Post a link that best showcases your expertise"
                    type="otherProfile"
                    fullWidth={true}
                    style={textStyle}
                    // errorText={this.state.tel_error_text}
                    onChange={(e) => this.changeValue(e, 'otherProfile')}
                  />
                    <TextField
                      hintText="Message for the dimpull admins"
                      floatingLabelText="Message for the dimpull admins (optional)"
                      type="message"
                      value={this.state.message}
                      onChange={(e) => this.changeValue(e, 'message')}
                      multiLine={true}
                      rows={1}
                      rowsMax={6}
                      style={textStyle}
                      fullWidth={true}
                    />
                    <TextField
                      hintText="Phone number"
                      floatingLabelText="Phone number"
                      type="tel"
                      errorText={this.state.tel_error_text}
                      onChange={(e) => this.changeValue(e, 'tel')}
                      style={textStyle}
                      defaultValue="+1-"
                    />
                    <Subheader style={{marginTop: "-8px", }} >Mind if we give you a call?  Don't worry, we won't share your number with anyone.</Subheader>
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