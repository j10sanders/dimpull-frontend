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
        price: response.data.price ? response.data.price : 0,
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
    history.replace('/calendar');
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
        <Markdown>{`
**DIMPULL INC.**

**EXPERT AGREEMENT**

**THIS EXPERT AGREEMENT**
(the “Agreement”) is made and entered into as of the date you
submit your initial availability schedule (the “Effective Date”)
by and between Dimpull Inc., a Delaware corporation with its
principal place of business in New York (“Dimpull” or the
“Company”), and you, a individual (the
“Expert”) (herein referred to collectively as the “Parties”).
This Agreement incorporates by reference The Company Expert
Marketplace Legal Terms & Conditions, outlined below.

**Definition of Services**

The
Company allows its users to pay to book consultations with experts in
Blockchain technology, including, but not limited to, Blockchain
asset technical review, ICO roadmapping, software code analysis (the
“Services”) and pay via Ethereum via The Company’s website
(currently located at www.dimpull.com) and any successor and
affiliated websites (the “Website”). Website includes profiles of
Experts and user reviews to help users select a Expert based on their
needs. The Company is a third-party in this transaction, connecting
Company users with experts such as Expert, who is operating
independently as a contractor subject to our limited rules and
restrictions.

**Expert Service Delivery**

Expert
will provide all Services booked via Company virtually to users
(e.g., phone) and will not meet Company users in person. In-person
meetings are strictly prohibited, void all warranty under this
Agreement as it relates to that client, and may result in the
immediate termination of this Agreement.

**Expert Code of Conduct**

Professionalism
is at the heart of all we do at Company, and giving our users a
consistently great experience is really important to us. By working
with Company, Expert recognizes the following Code of Conduct:

- Expert
  will be respectful towards Company users, and will alert Company in
  writing if a user is acting with disrespect towards Expert.  
- Expert
  will hold and maintain in strict confidence all Company user
  information to which they are privy while performing the Services,
  except as may be required by a court or governmental authority. 
- Expert
  will keep their availability up to date on Company Website to avoid
  over-booking. Canceling or over-booking users may lead to Expert
  being removed from Company Website and termination of this
  Agreement. 
- Experts
  will not conduct in person meeting with users. 
- Experts
  will reframe from providing any financial advice as more fully
  described in Section 4 of the Legal Terms & Conditions. 
- Expert
  may not consider an Expert Sessions “missed’ by a Client unless
  and until the Client is more than 15 minutes late without
  explanation. 

**Pricing and Payment Terms**

Company’s
Ethereum based smart contract will only pay Expert for Services
completed according to the Service Details and Pricing Plan (Exhibit
A), which is subject to change at any time, with notice to Expert. 

Prices
on the Website may differ from Expert pricing on other platforms.

**Intellectual
Property **

Expert
will retain full copyright to original works owned by Expert and used
or created in the performance of the Services. Expert warrants and
represents that all intellectual property used in performance of
Services is owned wholly and exclusively by Expert and that it does
not infringe on any third party intellectual property rights or
publicity rights. 

Expert
grants Company the right to create a profile for Expert on the
Website to promote to Company audience, using Expert’s likeness as
submitted by Expert. This profile is subject to change at any time,
and Expert may suggest changes to Company. Expert shall provide such
materials, and otherwise cooperate, as may be reasonably requested by
Company.

**Promotional
Uses**

Company
may include Expert’s name and likeness in promotional materials,
including without limitation, for promotion of Expert and Company to
users on-site and off-site.

Expert
may use Company name and logo in their own promotion off-site,
subject to Company permission.

**Termination**

Both
Parties may terminate the Agreement at any time, for any reason. 
Company reserves the right to refuse Expert access to the Services at
any time for any reason. If Expert terminates the Agreement or
reduces the number of Services offered on Company, Expert is
responsible for completing any existing Services booked prior to
termination, at the discretion of Company. If Company terminates the
Agreement or reduces the number of Services that Expert may offer on
Company, Company will pay out any outstanding undisputed amounts due
for Services completed, and may allow for partially completed
Services to be fulfilled by Expert, at Company’s discretion. 

**Non-Solicitation
and Non-Competition **

Any
action by Expert to avoid transacting with Company users via Company
Website is considered fee avoidance, violating section 3 of the Legal
Terms & Conditions, and is strictly prohibited by Company. This
includes, for example, encouraging or allowing users to purchase
Services offered by Expert on Company through another venue. Expert
may only take Company users on as clients through another venue for
Services which Company does not allow Expert to list. Any
transactions, bookings, or services that are booked outside of
Company Website are not covered by this Agreement or any warranty,
term, provision contained herein. 

**Dispute
resolution**

In
the case of a dispute between Expert and user, Company will have sole
discretion in the resolution of the matter, and whether or not the
Services were completed and will be paid out. 

**EXHIBIT
A**

**SERVICE
DETAILS AND PRICING PLAN**

Dimpull
Inc. (the “Company”) will pay Expert only for Services actually
completed, or otherwise not completed through no fault of the Expert,
according to the Service Details and Pricing Plan below:

Company’s
Ethereum based smart contract will distribute payment for Services as
follows:

1. 18%
  to Dimpull 
2. balance
  to the Expert. 

**DIMPULL
EXPERTING MARKETPLACE LEGAL TERMS**

_1.
Independent Contractor_

_Dimpull
Inc. (the “Company”) and Expert hereby agree that Expert be
engaged as an independent contractor, retaining control over and
responsibility for Expert’s own operations and personnel, if
applicable. Expert shall control the time, manner, and medium of
performance of the Agreement. Expert agrees to devote such effort and
time as is reasonably required to fulfill Expert’s duties in
connection with the Agreement hereunder. In addition, Expert shall
not use any sub-contractors to perform the Agreement without the
prior written approval of the Company. Expert will not be considered
an employee or agent of the Company as a result of this Agreement,
nor will Expert have the authority to contract in the name of or bind
the Company based on the consulting relationship established
hereunder. All fees payable to Expert hereunder shall be paid in
full, without any withholding, deduction, or offset of any federal,
state, or local income taxes, employment taxes, or other
withholdings. Expert acknowledges and agrees that Expert shall not
have any right to any compensation or benefits that the Company
grants its employees, including, without limitation, any salary,
pension, stock, bonus, profit sharing, insurance of any kind, health,
or other benefits. Expert agrees that Expert shall be solely
responsible for and shall pay all income taxes, payroll taxes, and
other withholdings (both employer and employee portions) with respect
to all fees paid by the Company hereunder, and agrees to indemnify
and hold the Company harmless from and against any and all loss,
liability, claim, cause of action, suit, fine, damage, judgment,
cost, or expense (including reasonable attorneys’ fees) arising out
of or in connection with any tax liability or other tax obligations
relating to payments made to Expert pursuant to this Agreement,
including, without limitation, any such taxes and withholdings
imposed as a result of any claim, or determination by any taxing
authority or otherwise, that Expert is not an independent contractor
with respect to the services performed hereunder. Expert may not hold
himself or herself as anything other than an “Expert” with
respect to his or her relationship with Dimpull._

_2.
Confidentiality_

_Each
party acknowledges that in connection with this Agreement it may
receive certain confidential or proprietary technical, business
and/or personal information and materials of the other party, and
customers, clients, vendors, and contacts of the Company
(“Confidential Information”). Each party, its agents, and
employees shall hold and maintain in strict confidence all
Confidential Information, shall not disclose Confidential Information
to any third party, and shall not use any Confidential Information
except as is necessary to perform the obligations described herein,
except as may be required by a court or governmental authority.
Notwithstanding the foregoing, Confidential Information shall not
include any information that is in the public domain or becomes
publicly known through no fault of the receiving party, or is
otherwise properly received from a third party without an obligation
of confidentiality._

_3.
Non-Circumvention_

_Except
as described in Expert’s Expert Agreement, Expert agrees not to in
any way whatsoever, directly or indirectly, in writing or orally,
circumvent the Company by soliciting, contacting, having discussions
with, dealing with, or contracting with any individuals, clients,
vendors, contacts, or employees revealed from the Company’s
Confidential Information, or through the course of engagement, and
for one (1) year thereafter. _

_4.
Waiver / Limitation of Liability  _

_EXCEPT
FOR THE EXPRESS REPRESENTATIONS AND WARRANTIES STATED IN THIS
AGREEMENT, NEITHER PARTY HERETO MAKES ANY WARRANTY WHATSOEVER. EACH
PARTY EXPLICITLY DISCLAIMS ANY OTHER WARRANTIES OF ANY KIND, EITHER
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF
MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE, LOST PROFITS,
INCREASED PROFITS, FAVORABLE OUTCOMES, IMPROVEMENTS, OR COMPLIANCE
WITH LAWS OR GOVERNMENT RULES OR REGULATIONS APPLICABLE TO THE
AGREEMENT. BREACH OF ANY OF THESE TERMS OR BUSINESS TERMS WILL
OTHERWISE VOID ANY REPRENTATIONS AND WARRANTIES PREVIOUSLY IN EFFECT._

_TO
THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, EXCEPT FOR EITHER
PARTY’S INDEMNIFICATION OBLIGATIONS, DAMAGES ARISING FROM A PARTY’S
WILLFUL MISCONDUCT, GROSS NEGLIGENCE, OR FRAUD (A) IN NO EVENT SHALL
EITHER PARTY BE LIABLE TO THE OTHER PARTY HEREUNDER FOR ANY LOST
PROFITS OR LOST BUSINESS, OR FOR ANY CONSEQUENTIAL, INCIDENTAL,
SPECIAL, OR INDIRECT DAMAGES OF ANY KIND, WHETHER ARISING IN
CONTRACT, TORT OR OTHERWISE, AND REGARDLESS OF WHETHER SUCH PARTY HAS
BEEN NOTIFIED OF THE POSSIBILITY OF SUCH DAMAGES; AND (B) EITHER
PARTY’S MAXIMUM AGGREGATE LIABILITY FOR ANY DAMAGES CLAIM RELATING
TO THIS AGREEMENT SHALL NOT EXCEED FIVE THOUSAND DOLLARS ($5,000)._

_4.
Representations & Warranties_

_Each
party represents and warrants to the other that such party is
authorized, empowered, and able to enter into and fully perform its
obligations under this Agreement; neither this Agreement nor the
fulfillment hereof infringes or will infringe the rights of any third
party; such factual representations made by such party to the other
are wholly truthful and verifiable; and any intellectual property
furnished by such party to the other is original and will infringe
upon the rights of any third-parties.  _

_Expert
represents and warrants that (i) Expert has read the Coinbase A
Securities Law Framework for Blockchain Tokens
(https://www.coinbase.com/legal/securities-law-framework.pdf), (ii)
Expert understands that certain Blockchain assets may be considered
securities by the SEC; (iii) Expert understands that to give an
opinion about the relative price or financial performance of a
security or other investment is to give “financial advice” (iv)
Expert will not use the Company’s platform to give, solicit,
disseminate or provide “financial advice” to or from any user of
the Services; (v) giving or receiving financial advice will wholly
void and nullify this Agreement and any benefits or warranties._

_5.
Indemnification_

_Each
party agrees to indemnify and hold harmless the other and its
principals, shareholders, agents, officers, directors, consultants,
and employees form or against third-party claims, damages, payments,
deficiencies, fines, judgments, settlements, liabilities, losses,
costs, and expenses arising from or relating to any third-party
claim, suit, action or proceeding arising out of the breach of either
party’s representations and warranties contained herein. _

_6.
Miscellaneous_

_a.
Severability. The invalidity or unenforceability of any particular
provision of this Agreement shall not affect the other provisions
hereof and this Agreement shall be construed in all respects as if
such invalid or unenforceable provision were omitted._

_b.
Governing Law. This Agreement shall be governed by, and construed in
accordance with, the laws of the State of New York pertaining to
contracts made and to be wholly performed within such state, without
taking into account conflicts of laws principles. To the extent
Section 6(c) does not control, the parties agree that the courts
situated in New York, New York shall have exclusive jurisdiction
related to the claims arising out of or related to the Agreement._

_c.
Arbitration. To the extent not specifically prohibited by applicable
law, any dispute arising out of or relating to this Agreement, or any
transaction or relationship resulting from it that is not settled by
the parties themselves, will be resolved by binding arbitration in
New York, New York in accordance with (i) the U.S. Federal
Arbitration Act; (ii) the law governing this Agreement, to the extent
not inconsistent with the arbitral law; and (iii) the Commercial
Arbitration Rules of the American Arbitration Association (AAA) in
effect at the time of the demand for arbitration, to the extent not
inconsistent with this Agreement and items (i) and (ii) of this
section._

_d.
No Assignment by Expert. This Agreement may not be assigned, in whole
or in part, by Expert without the prior written consent of the
Company, and such consent may be withheld for any reason or no
reason._

_e.
Notices. Any notice or other communication required or permitted
under this Agreement shall be in writing and shall be deemed to have
been duly given if delivered via First Class Mail to each party at
their respective address above._

_f.
Non-Disparagement. Neither party will disparage the other or its
products or services to customers, potential customers, or the
public._
`}
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
