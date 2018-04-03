import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import axios from 'axios';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Subheader from 'material-ui/Subheader';
import request from 'superagent';
import Dropzone from 'react-dropzone';
import CircularProgress from 'material-ui/CircularProgress';
import { timezones } from '../../timezones/timezones';
import ProfileCard from './ProfileCard';
import history from '../../history';
import './discussionprofile.css';

const style = {
  marginTop: 50,
  paddingBottom: 50,
  paddingTop: 25,
  width: '100%',
  textAlign: 'center',
  display: 'inline-block'
};

const dropzoneStyle = {
  width: '100%',
  height: '80px',
  border: '1px solid black',
  cursor: 'pointer'
};

const CLOUDINARY_UPLOAD_PRESET = 'se7fblu1';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dtvc9q04c/upload';

class EditProfile extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      priceErrorText: null,
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
      uploadedFileCloudinaryUrl: '',
      waiting: 'true'
    };
  }

  componentWillMount () {
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

  componentDidMount () {
    this.etherPrice();
    const { isAuthenticated } = this.props.auth;
    const { getAccessToken } = this.props.auth;
    let headers = {}
    if (isAuthenticated()) {
      headers = { 'Authorization': `Bearer ${getAccessToken()}` };
    } else {
      history.push('/');
    }
    axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/editdiscussion${this.props.location.search}`, { headers })
      .then((response) => {
        this.setState({
          price: response.data.price ? response.data.price : 50,
          image: response.data.image_url ? response.data.image_url : '',
          description: response.data.description ? response.data.description : '',
          otherProfile: response.data.otherProfile ? response.data.otherProfile : '',
          // timezone: response.data.timezone ,
          origin: response.data.origin ? response.data.origin : '',
          excites: response.data.excites ? response.data.excites : '',
          helps: response.data.helps ? response.data.helps : '',
          who: response.data.who ? response.data.who : ''
        }, () => this.isDisabled());
      })
      .catch(error => console.log(error));
  }

  onImageDrop (files) {
    this.setState({
      uploadedFile: files[0]
    });
    this.handleImageUpload(files[0]);
  }

  etherPrice () {
    axios.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD')
      .then(res => this.setState({ etherPrice: res.data.USD }));
  }

  handleImageUpload (file) {
    const upload = request.post(CLOUDINARY_UPLOAD_URL)
      .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
      .field('file', file);
    upload.end((err, response) => {
      if (err) {
        console.error(err);
      }
      if (response.body.secure_url !== '') {
        this.setState({
          uploadedFileCloudinaryUrl: response.body.secure_url,
          image: response.body.secure_url
        });
      }
    });
  }

  isDisabled () {
    this.setState({ waiting: false });
    let priceIsValid = false;
    if (this.state.price.length === 0) {
      this.setState({
        priceErrorText: null
      });
    } else if (!isNaN(this.state.price) && Number(this.state.price) > 0) {
      priceIsValid = true;
      this.setState({
        priceErrorText: null
      });
    } else {
      this.setState({
        priceErrorText: 'Enter a valid number, greater than 0'
      });
    }
    if (this.state.description && this.state.image) {
      if (this.state.description.length !== 0 && this.state.image.length !== 0 && priceIsValid) {
        this.setState({
          disabled: false
        });
      }
    }
  }

  changeValue (e, type) {
    if (type === 'price') {
      this.etherPrice();
    }
    const nextState = {};
    nextState[type] = e.target.value;
    this.setState(nextState, () => {
      this.isDisabled();
    });
  }

  _handleKeyPress (e) {
    if (e.key === 'Enter') {
      if (!this.state.disabled) {
        this.login(e);
      }
    }
  }

  submit (e) {
    const { isAuthenticated } = this.props.auth;
    if (isAuthenticated()) {
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
        who: this.state.who
      })
        .then(response => history.replace('/calendar'));
    }
  }

  selectTimezone (event, index, value) {
    this.setState({ timezone: value });
  }

  render () {
    const { isAuthenticated } = this.props.auth;
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-md-offset-0">
            <div style={{ paddingLeft: '34px' }} >
              {isAuthenticated() && (
                <div className="" onKeyPress={e => this._handleKeyPress(e)}>
                  <Paper style={style}>
                    <div className="text-center">
                      <h2>Fill Out Your Expert Profile:</h2>
                      {this.state.waiting ? <CircularProgress size={80} thickness={5} /> : (
                        <div className="col-md-12">
                          {this.state.profile.given_name && (
                            <TextField
                              hintText={`${this.state.profile.given_name} ${this.state.profile.family_name}`}
                              type="name"
                              disabled
                              fullWidth
                            />
                          )}
                          {(!this.state.profile.given_name && this.state.profile[`${process.env.REACT_APP_AUTH0_DOMAIN}`]) && (
                            <TextField
                              hintText={`${this.state.profile[`${process.env.REACT_APP_AUTH0_DOMAIN}`].given_name} ${this.state.profile[`${process.env.REACT_APP_AUTH0_DOMAIN}`].family_name}`}
                              type="name"
                              disabled
                              fullWidth
                            />
                          )}
                          <div style={{ color: this.state.image ? 'black' : 'red', paddingTop: '20px' }}>
                            <Dropzone
                              multiple={false}
                              accept="image/*"
                              onDrop={e => this.onImageDrop(e)}
                              style={dropzoneStyle}
                            >
                              <p className="dropzone">
                                Profile Picture: Drop an image here or click to  upload.
                              </p>
                            </Dropzone>
                          </div>
                          <TextField
                            // hintText="Area of expertise"
                            floatingLabelText="Your Title (Full-Time Trader, Dapp Developer, Researcher, etc...)"
                            type="description"
                            value={this.state.description}
                            style={{marginTop: '8px'}}
                            // errorText={this.state.description_error_text}
                            onChange={e => this.changeValue(e, 'description')}
                            fullWidth
                          />
                          <TextField
                            // hintText="Link to another site's profile"
                            floatingLabelText="Link to site (twitter, youtube, blog, etc..) that showcases your expertise (not required)"
                            type="otherProfile"
                            value={this.state.otherProfile}
                            fullWidth
                            // errorText={this.state.tel_error_text}
                            onChange={e => this.changeValue(e, 'otherProfile')}
                          />
                          <SelectField
                            floatingLabelText="Timezone"
                            value={this.state.timezone}
                            onChange={(event, index, value) => this.selectTimezone(event, index, value, 'id')}
                            maxHeight={200}
                            fullWidth
                            style={{ textAlign: 'start' }}
                          >
                            {timezones.map(timezone => (
                              <MenuItem
                                value={timezone.value}
                                key={timezone.value}
                                primaryText={timezone.name}
                              />
                            ))}
                          </SelectField>
                          <TextField
                            floatingLabelText="Price Per 30 Minutes (in dollars)"
                            type="price"
                            value={this.state.price}
                            errorText={this.state.priceErrorText}
                            fullWidth
                            onChange={e => this.changeValue(e, 'price')}
                          />
                          <p> Currently one Ether is {this.state.etherPrice} dollars,
                            so your price would be {Number(Math.round((this.state.price / this.state.etherPrice)+'e3')+'e-3')}
                            {' '}ETH/half-hour.  It will be set when someone books one of your timeslots.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="text-center">
                      <div className="col-md-12">
                        <div style={{ textAlign: 'left', paddingTop: '30px' }}>
                          <TextField
                            // hintText="Who are you?"
                            floatingLabelText="Who are you?"
                            type="who"
                            fullWidth
                            value={this.state.who}
                            // errorText={this.state.tel_error_text}
                            multiLine
                            rows={2}
                            rowsMax={6}
                            onChange={e => this.changeValue(e, 'who')}
                          />
                          <Subheader style={{ paddingLeft: '0px', marginTop: '-14px' }}>This is a good place to brag of your success and convince users that it is worth their ETH to speak to you.</Subheader>
                        </div>
                        <div style={{ textAlign: 'left', paddingTop: '30px' }}>
                          <TextField
                            // hintText="What is your crypto origin story?"
                            floatingLabelText="What is your crypto origin story?"
                            type="origin"
                            fullWidth
                            value={this.state.origin}
                            // errorText={this.state.tel_error_text}
                            multiLine
                            rows={2}
                            rowsMax={6}
                            onChange={e => this.changeValue(e, 'origin')}
                          />
                          <Subheader style={{ paddingLeft: '0px', marginTop: '-14px' }}>Let newer crypto enthusiasts know what got you started.</Subheader>
                        </div>

                        <div style={{ textAlign: 'left', paddingTop: '30px' }}>
                          <TextField
                            // hintText="What excites you about blockchain technology?"
                            floatingLabelText="What excites you about blockchain technology?"
                            type="excites"
                            value={this.state.excites}
                            fullWidth
                            // errorText={this.state.tel_error_text}
                            multiLine
                            rows={2}
                            rowsMax={6}
                            onChange={e => this.changeValue(e, 'excites')}
                          />
                          <Subheader style={{ paddingLeft: '0px', marginTop: '-14px' }}>Privacy, Voting, Contracts, Finance, Patents/Copyrights, Collectibles, Investing, etc...</Subheader>
                        </div>
                        <div style={{ textAlign: 'left', paddingTop: '30px' }}>
                          <TextField
                            // hintText="What can you help callers with?"
                            floatingLabelText="What can you help callers with?"
                            type="helps"
                            value={this.state.helps}
                            fullWidth
                            // errorText={this.state.tel_error_text}
                            multiLine
                            rows={2}
                            rowsMax={6}
                            onChange={e => this.changeValue(e, 'helps')}
                          />
                          <Subheader style={{ paddingLeft: '0px', marginTop: '-14px' }}>Suggestion: Provide questions that you’d like callers to ask you</Subheader>
                        </div>

                        <RaisedButton
                          disabled={this.state.disabled}
                          style={{ marginTop: 50 }}
                          label="Submit"
                          onClick={e => this.submit(e)}
                        />
                      </div>
                    </div>
                  </Paper>
                </div>
              )}
            </div>
          </div>
          <div className="col-md-6 col-md-offset-0">
            <div style={{ marginTop: '50px' }} >
              <div style={{ marginBottom: '64px', paddingLeft: '34px' }}>
                <h2> Preview: </h2>
              </div>
              <ProfileCard
                host={this.state.profile.given_name ? `${this.state.profile.given_name} ${this.state.profile.family_name}` : ' '}
                image={this.state.image}
                description={this.state.description ? this.state.description : ' '}
                who={this.state.who ? this.state.who : ' '}
                origin={this.state.origin ? this.state.origin : ' '}
                excites={this.state.excites ? this.state.excites : ' '}
                helps={this.state.helps ? this.state.helps : ' '}
                open={this.state.open}
                search={this.props.location.search}
                handleClose={() => this.handleClose()}
                deleteProfile={() => this.deleteProfile()}
                // title={title}
                // subtitle={subtitle}
                otherProfile={this.state.otherProfile}
                edit
                // linkToProfile={() => this.linkToProfile()}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EditProfile;
