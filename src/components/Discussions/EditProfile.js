import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import axios from 'axios';
import SelectField from 'material-ui/SelectField';
import Subheader from 'material-ui/Subheader';
import request from 'superagent';
import Dropzone from 'react-dropzone';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import PropTypes from 'prop-types';
import menuTimeZones from '../../timezones/timezones';
import ProfileCard from './ProfileCard';
import history from '../../history';
import './discussionprofile.css';
import { expertAgreement } from '../../utils/agreements';

const Markdown = require('react-remarkable');
const WAValidator = require('wallet-address-validator');

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
  height: '100px',
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
      initialsErrorText: 'Initialize form in order to accept',
      description: '',
      image: '',
      // otherProfile: '',
      price: '',
      disabled: true,
      timezone: 'America/New_York',
      etherPrice: '',
      who: '',
      origin: '',
      excites: '',
      helps: '',
      walletAddress: '',
      waiting: true,
      open: false,
      linkedin: '',
      twitter: '',
      youtube: '',
      github: '',
      medium: '',
      title: 'Looks great!  Make sure to set your availability too.',
      submitFull: false, // so server knows if it's a full profile
      tc: false
    };
  }

  componentWillMount () {
    this.setState({ profile: {} });
    const { isAuthenticated } = this.props.auth;
    if (isAuthenticated()) {
      const { userProfile, getProfile } = this.props.auth;
      if (!userProfile) {
        getProfile((err, profile) => {
          this.setState({ profile });
        });
      } else {
        this.setState({ profile: userProfile });
      }
    } else {
      this.props.auth.login(this.props.location.pathname);
    }
  }

  componentDidMount () {
    this.etherPrice();
    const { isAuthenticated } = this.props.auth;
    const { getAccessToken } = this.props.auth;
    let headers = {};
    if (isAuthenticated()) {
      headers = { Authorization: `Bearer ${getAccessToken()}` };
    } else {
      this.props.auth.login(this.props.location.pathname);
    }
    this.fillForms(headers);
  }

  onImageDrop (files) {
    this.handleImageUpload(files[0]);
  }

  async fillForms (headers) {
    const terms = await axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/checkTerms`, { headers });
    if (terms.data === 'terms') {
      this.setState({ tc: true, waiting: false });
    }
    const response = await axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}${this.props.location.pathname}`, { headers });
    if (response.data === 404) {
      this.props.auth.login('/newProfile');
    }
    if (response.data.dp) {
      history.replace(`/editProfile/${response.data.url}`);
    }
    if (response.data !== "Not this user's") {
      this.setState({
        price: response.data.price ? response.data.price : 30,
        image: response.data.image_url ? response.data.image_url : '',
        description: response.data.description ? response.data.description : '',
        // otherProfile: response.data.otherProfile ? response.data.otherProfile : '',
        origin: response.data.origin ? response.data.origin : '',
        excites: response.data.excites ? response.data.excites : '',
        helps: response.data.helps ? response.data.helps : '',
        who: response.data.who ? response.data.who : '',
        url: response.data.url ? response.data.url : '',
        linkedin: response.data.linkedin,
        twitter: response.data.twitter,
        youtube: response.data.youtube,
        github: response.data.github,
        medium: response.data.medium,
        walletAddress: response.data.walletAddress ? response.data.walletAddress : '',
        first_name: response.data.first_name,
        last_name: response.data.last_name
      }, () => this.isDisabled());
    } else {
      this.setState({ title: "Doesn't look like your profile.  Please contact admin@dimpull.com if you are sure you logged in with the same profile", open: true });
    }
  }

  etherPrice () {
    axios.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD')
      .then(res => this.setState({ etherPrice: res.data.USD }));
  }

  handleImageUpload (file) {
    this.setState({ waiting: true });
    const upload = request.post(CLOUDINARY_UPLOAD_URL)
      .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
      .field('file', file);
    upload.end((err, response) => {
      if (err) {
        console.error(err);
      }
      if (response.body.secure_url !== '') {
        const image = response.body.secure_url;
        const n = image.indexOf('upload');
        const scaledImage = `${image.substring(0, n + 7)}c_scale,h_595/${image.substring(n + 7)}`;
        this.setState({
          image: scaledImage, waiting: false
        });
      }
    });
  }

  async isDisabled () {
    const validWallet = await this.validWallet();
    this.setState({ waiting: false });
    let priceIsValid = false;
    if (this.state.price.length === 0) {
      this.setState({
        priceErrorText: null
      });
    } else if (!isNaN(this.state.price) && Number(this.state.price) > 5) {
      priceIsValid = true;
      this.setState({
        priceErrorText: null
      });
    } else {
      this.setState({
        priceErrorText: 'Enter a valid number, greater than $5'
      });
    }
    if (this.state.url.length !== 0 && this.state.url && this.state.url.trim()) {
      this.setState({ urlError: null });
    } else {
      this.setState({ urlError: 'enter a URL' });
    }
    if (this.state.description && this.state.image) {
      if (this.state.description.length !== 0 &&
        this.state.image.length !== 0 &&
        priceIsValid && validWallet && this.state.url.length !== 0) {
        this.setState({
          disabled: false,
          title: 'Looks great!  Make sure to set your availability too.'
        });
      } else if (this.state.disabled === false) {
        this.setState({
          disabled: true,
          title: "Come back anytime to finish your profile.  We won't make it public in the meantime."
        });
      }
    } else if (this.state.disabled === false) {
      this.setState({
        disabled: true,
        title: "Come back anytime to finish your profile.  We won't make it public in the meantime."
      });
    }
  }

  validWallet () {
    const valid = WAValidator.validate(this.state.walletAddress, 'ethereum');
    if (valid) {
      this.setState({ walletError: null });
      return true;
    } else if (this.state.walletAddress === '') {
      this.setState({ walletError: null });
      return false;
    }
    this.setState({ walletError: 'Not a valid ETH Wallet' });
    return false;
  }

  async accept () {
    this.setState({ tc: false });
    const { getAccessToken } = this.props.auth;
    let headers = {};
    headers = { Authorization: `Bearer ${getAccessToken()}` };
    const response = await axios.post(
      `${process.env.REACT_APP_USERS_SERVICE_URL}/acceptTerms`,
      {
        accepted: true
      }, { headers }
    );
    if (response.data === 'confirmed') {
      this.setState({ tc: false });
    }
  }

  changeValue (e, type) {
    const nextState = {};
    nextState[type] = e.target.value;
    if (type === 'initials') {
      if (e.target.value.length > 1 && e.target.value.length < 4) {
        this.setState({ initialsErrorText: null });
      } else {
        this.setState({ initialsErrorText: 'Initialize form in order to accept' });
      }
    }
    this.setState(nextState, () => {
      this.isDisabled();
    });
  }

  async submit (e) {
    if (e === 'save'){
      this.setState({ title: "We saved your work."});
    } else {
      this.setState({ submitFull: true });
    }
    const { isAuthenticated } = this.props.auth;
    const { getAccessToken } = this.props.auth;
    let headers = {};
    if (isAuthenticated()) {
      headers = { Authorization: `Bearer ${getAccessToken()}` };
    }
    if (!this.state.url || this.state.url.length === 0) {
      this.setState({ urlError: 'Enter a url' });
      return;
    }
    const urls = {
      github: this.state.github,
      twitter: this.state.twitter,
      youtube: this.state.youtube,
      linkedin: this.state.linkedin,
      medium: this.state.medium
    };

    const httpsUrls = {};

    Object.keys(urls).map(function(key, index) {
      if (!/^https?:\/\//i.test(urls[key]) && urls[key] !== '' && urls[key] !== ' ') {
        httpsUrls[key] = 'https://' + urls[key];
      } else {
        httpsUrls[key] = urls[key]
      }
      return httpsUrls;
    });

    let pathname = this.props.location.pathname
    pathname = pathname.endsWith('editProfile') ? `${pathname}/${this.state.url}` : pathname;
    const urlvalid = await axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/urlcheck/${this.state.url}`, { headers });
    if (urlvalid.data === 'available') {
      if (isAuthenticated()) {
        const posted = await axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}${pathname}`, {
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
          url: this.state.url,
          submitFull: this.state.submitFull,
          walletAddress: this.state.walletAddress,
          linkedin: httpsUrls['linkedin'],
          medium: httpsUrls['medium'],
          twitter: httpsUrls['twitter'],
          youtube: httpsUrls['youtube'],
          github: httpsUrls['github']
        }, { headers });
        if (posted.data === 'success') {
          this.setState({ open: true });
        }
      }
    } else {
      this.setState({ urlError: `${this.state.url} is not available` });
    }
  }

  handleOpen () {
    this.setState({
      open: true
    });
  }

  handleClose () {
    this.setState({ open: false });
    if (this.state.disabled) {
      history.push('/home');
    } else {
      history.push('/calendar');
    }
  }

  selectTimezone (event, index, value) {
    this.setState({ timezone: value });
  }

  render () {
    const { isAuthenticated } = this.props.auth;
    const actions = [
      <FlatButton
        label="Sounds good"
        primary
        onClick={() => this.handleClose()}
      />
    ];

    const tAndC = [
      <FlatButton
        label="I Do Not Acccept"
        primary
        onClick={() => this.handleClose()}
      />,
      <FlatButton
        label="I Accept the Terms of Service"
        primary
        disabled={this.state.initialsErrorText !== null}
        onClick={() => this.accept()}
      />
    ];

    if (!this.state.tc) {
      return (
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-md-offset-0">
              <div id="editSection" >
                {isAuthenticated() && (
                  <div className="">
                    <Paper style={style}>
                      <div className="text-center">
                        <h2>Fill Out Your Expert Profile:</h2>
                        {this.state.waiting ? <CircularProgress size={80} thickness={5} /> : (
                          <div className="col-md-12">
                            <div style={{ color: this.state.image ? 'black' : 'red', width: '50%', margin: 'auto', height: '100px', paddingTop: '30px', marginBottom: '30px' }}>
                              <Dropzone
                                multiple={false}
                                accept="image/*"
                                onDrop={e => this.onImageDrop(e)}
                                style={dropzoneStyle}
                              >
                                <p className="dropzone" style={{ fontSize: '14px' }}>
                                  Profile Picture: Drop an image here or click to  upload.
                                </p>
                              </Dropzone>
                            </div>
                            <div id="editInputs" >
                              <TextField
                                floatingLabelText="Your Title (Full-Time Trader, Dapp Developer, Founder, etc)"
                                type="description"
                                value={this.state.description}
                                style={{ marginTop: '8px' }}
                                onChange={e => this.changeValue(e, 'description')}
                                fullWidth
                              />
                              <SelectField
                                floatingLabelText="Timezone"
                                value={this.state.timezone}
                                onChange={(event, index, value) => this.selectTimezone(event, index, value, 'id')}
                                maxHeight={200}
                                fullWidth
                                style={{ textAlign: 'start' }}
                              >
                                {menuTimeZones}
                              </SelectField>
                              <TextField
                                floatingLabelText="Price Per 30 Minutes (in dollars)"
                                type="price"
                                value={this.state.price}
                                errorText={this.state.priceErrorText}
                                fullWidth
                                onChange={e => this.changeValue(e, 'price')}
                              />
                              <p style={{ fontSize: '14px' }} > Currently one Ether is {this.state.etherPrice} dollars,
                                so you will earn {Number(Math.round((this.state.price / this.state.etherPrice)+'e3')+'e-3')}
                                {' '}ETH/half-hour.  It will be set when someone books one of your timeslots.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="text-center">
                        <div className="col-md-12">
                          <div style={{ textAlign: 'left', paddingTop: '30px' }} id="editInputs">
                            <TextField
                              floatingLabelText="Who are you? (required)"
                              type="who"
                              fullWidth
                              value={this.state.who}
                              multiLine
                              rows={2}
                              rowsMax={6}
                              onChange={e => this.changeValue(e, 'who')}
                            />
                            <Subheader style={{ paddingLeft: '0px', marginTop: '-4px', lineHeight: '23px' }}>This is a good place to brag of your success and convince users that it is worth their ETH to speak to you.</Subheader>
                          </div>
                          <div style={{ textAlign: 'left', paddingTop: '30px' }} id="editInputs">
                            <TextField
                              floatingLabelText="What is your crypto origin story? (optional)"
                              type="origin"
                              fullWidth
                              value={this.state.origin}
                              multiLine
                              rows={2}
                              rowsMax={6}
                              onChange={e => this.changeValue(e, 'origin')}
                            />
                            <Subheader style={{ paddingLeft: '0px', marginTop: '-4px', lineHeight: '23px' }}>Let newer crypto enthusiasts know what got you started.</Subheader>
                          </div>
                          <div style={{ textAlign: 'left', paddingTop: '30px' }} id="editInputs">
                            <TextField
                              floatingLabelText="What excites you about blockchain tech? (optional)"
                              type="excites"
                              value={this.state.excites}
                              fullWidth
                              multiLine
                              rows={2}
                              rowsMax={6}
                              onChange={e => this.changeValue(e, 'excites')}
                            />
                            <Subheader style={{ paddingLeft: '0px', marginTop: '-4px', lineHeight: '23px' }}>Privacy, Voting, Contracts, Finance, Patents/Copyrights, Collectibles, Investing, etc...</Subheader>
                          </div>
                          <div style={{ textAlign: 'left', paddingTop: '30px' }} id="editInputs">
                            <TextField
                              floatingLabelText="What can you help callers with? (required)"
                              type="helps"
                              value={this.state.helps}
                              fullWidth
                              multiLine
                              rows={2}
                              rowsMax={6}
                              onChange={e => this.changeValue(e, 'helps')}
                            />
                            <Subheader style={{ paddingLeft: '0px', marginTop: '-4px', lineHeight: '23px' }}>Suggestion: Provide questions that you’d like callers to ask you</Subheader>
                          </div>
                          <div style={{ textAlign: 'left', paddingTop: '30px' }} id="editInputs">
                            <TextField
                              // hintText="What can you help callers with?"
                              floatingLabelText="Ethereum Wallet Address"
                              type="walletAddress"
                              value={this.state.walletAddress}
                              fullWidth
                              errorText={this.state.walletError}
                              onChange={e => this.changeValue(e, 'walletAddress')}
                            />
                          </div>
                          <div style={{ textAlign: 'left', paddingTop: '30px' }} id="editInputs">
                            <TextField
                              floatingLabelText="Public URL"
                              type="url"
                              value={this.state.url}
                              errorText={this.state.urlError}
                              onChange={e => this.changeValue(e, 'url')}
                            />
                            <Subheader style={{ paddingLeft: '0px', marginTop: '-4px', lineHeight: '23px' }}>dimpull.com/{this.state.url}</Subheader>
                          </div>
                          <br />
                          <h4>Optional social links</h4>
                          <TextField
                            floatingLabelText="Github URL"
                            type="github"
                            value={this.state.github}
                            style={{ marginLeft: '2px', marginRight: '2px' }}
                            onChange={e => this.changeValue(e, 'github')}
                          />
                          <TextField
                            floatingLabelText="LinkedIn URL"
                            type="linkedin"
                            value={this.state.linkedin}
                            style={{ marginLeft: '2px', marginRight: '2px' }}
                            onChange={e => this.changeValue(e, 'linkedin')}
                          />
                          <br />
                          <TextField
                            floatingLabelText="Twitter URL"
                            type="otherProfile"
                            value={this.state.twitter}
                            style={{ marginLeft: '2px', marginRight: '2px' }}
                            onChange={e => this.changeValue(e, 'twitter')}
                          />
                          <TextField
                            floatingLabelText="YouTube URL"
                            type="otherProfile"
                            value={this.state.youtube}
                            style={{ marginLeft: '2px', marginRight: '2px' }}
                            onChange={e => this.changeValue(e, 'youtube')}
                          />
                          <TextField
                            floatingLabelText="Medium URL"
                            type="medium"
                            value={this.state.medium}
                            style={{ marginLeft: '2px', marginRight: '2px' }}
                            onChange={e => this.changeValue(e, 'medium')}
                          />
                          <br />
                          {this.state.disabled && (
                            <RaisedButton
                              style={{ marginTop: 50, marginRight: '4px' }}
                              label="Not done?  Save for your edits for later"
                              onClick={() => this.submit('save')}
                            />
                          )}
                          <RaisedButton
                            disabled={this.state.disabled}
                            style={{ marginTop: 50 }}
                            label="Save"
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
                <div>
                  <h2> Preview: </h2>
                </div>
                <ProfileCard
                  host={this.state.first_name ? `${this.state.first_name} ${this.state.last_name}` : ' '}
                  image={this.state.image ? this.state.image : 'https://res.cloudinary.com/dtvc9q04c/image/upload/v1523630798/grey.jpg'}
                  description={this.state.description ? this.state.description : ' '}
                  who={this.state.who}
                  origin={this.state.origin}
                  excites={this.state.excites}
                  helps={this.state.helps}
                  open={this.state.open}
                  search={this.props.location.search}
                  handleClose={() => this.handleClose()}
                  deleteProfile={() => this.deleteProfile()}
                  twitter={this.state.twitter}
                  youtube={this.state.youtube}
                  github={this.state.github}
                  medium={this.state.medium}
                  linkedin={this.state.linkedin}
                  edit
                />
                {this.state.disabled && (
                  <div style={{ paddingLeft: '15px' }} id="saveForLater">
                    <RaisedButton
                      style={{ marginLeft: '10%', marginTop: '30px' }}
                      label="Haven't finished?  Save your edits for later"
                      onClick={() => this.submit('save')}
                      primary
                    />
                  </div>
                )}
              </div>
              
            </div>
          </div>
          <Dialog
            title={this.state.title}
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={() => this.handleClose.bind(this)}
          >
          </Dialog>
        </div>
      );
    }

    return (
      <Dialog
        title="Terms and Conditions"
        actions={tAndC}
        modal={false}
        open={this.state.tc}
        onRequestClose={this.handleCloseTC}
        autoScrollBodyContent={true}
      >
        <Markdown>{expertAgreement}
</Markdown> 
<TextField
  floatingLabelText="Initials"
  type="initials"
  value={this.state.initials}
  errorText={this.state.initialsErrorText}
  onChange={e => this.changeValue(e, 'initials')}
/></Dialog>
    );
  }
}

EditProfile.propTypes = {
  auth: PropTypes.shape({
    isAuthenticated: PropTypes.func,
    getAccessToken: PropTypes.func,
    login: PropTypes.func,
    userProfile: PropTypes.object,
    getProfile: PropTypes.func
  })
};

EditProfile.defaultProps = {
  auth: PropTypes.object
};

export default EditProfile;
