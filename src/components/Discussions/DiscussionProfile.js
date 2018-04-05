import React from 'react';
import Subheader from 'material-ui/Subheader';
import ReactStars from 'react-stars';
import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import { Link } from 'react-router-dom';
import axios from 'axios';
import history from '../../history';
import NeedReview from './needReview';
import ProfileCard from './ProfileCard';
import './discussionprofile.css';

const colors = ['FF9A57', '01B48F', 'D0D2D3', 'C879B2', '44C7F4'];

class DiscussionProfile extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      open: false,
      etherPrice: ''
    };
  }

  componentDidMount () {
    const { isAuthenticated } = this.props.auth;
    const { getAccessToken } = this.props.auth;
    let headers = {};
    if (isAuthenticated()) {
      headers = { 'Authorization': `Bearer ${getAccessToken()}`};
    }
    this.getDiscussion(headers);
  }

  getDiscussion (headers) {
    this.etherPrice();
    axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}${this.props.location.pathname}`, { headers })
      .then((response) => {
        if (response.data === 'not an expert yet') {
          this.setState({ notExpert: true });
        } else if (response.data === 'does not exist') {
          this.setState({ nonExistant: true });
          return;
        } else if (response.data === 'editProfile') {
          history.push(`/editProfile${this.props.location.search}`);
        }
        this.etherPrice();
        this.setState({
          host: `${response.data.first_name} ${response.data.last_name}`,
          image: response.data.image,
          // auth_image: response.data.auth_pic,
          description: response.data.description,
          // anonymous_phone_number: response.data.anonymous_phone_number,
          is_users: response.data.is_users,
          price: response.data.price,
          other_profile: response.data.otherProfile,
          needReview: response.data.needReview,
          origin: response.data.origin,
          who: response.data.who,
          excites: response.data.excites,
          helps: response.data.helps,
          dp: response.data.id
        });
        if (response.data.reviewlist) {
          this.setState({
            reviews: response.data.reviewlist,
            averageRating: response.data.averageRating
          });
        }
      }).catch(error => console.log(error));
  }

  etherPrice () {
    axios.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD')
      .then((res) => {
        this.setState({ etherPrice: res.data.USD });
      });
  }

  deleteProfile () {
    const { isAuthenticated } = this.props.auth;
    const { getAccessToken } = this.props.auth;
    let headers = {};
    if (isAuthenticated()) {
      headers = { 'Authorization': `Bearer ${getAccessToken()}` };
    }
    axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/deleteDiscussion${this.props.location.search}`, { headers })
      .then((response) => {
        this.handleClose();
        history.replace('/discussions');
      })
      .catch(error => console.log(error));
  }

  handleOpen () {
    this.setState({ open: true });
  }

  handleClose () {
    this.setState({ open: false });
  }

  linkToProfile (profile){
    // window.open(
    //   profile,
    //   '_blank' // <- This is what makes it open in a new window.
    // );
    //commented out because we don't need to link in seed profiles.
  return;
  }

  submit (e) {
    const { isAuthenticated } = this.props.auth;
    if (isAuthenticated()) {
      axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/editProfile${this.props.location.search}`, { 
        user_id: this.state.profile.sub,
        description: this.state.description,
        image_url: this.state.image,
        otherProfile: this.state.otherProfile,
        price: this.state.price,
        timezone: this.state.timezone,
        origin: this.state.origin,
        who: this.state.who,
        excites: this.state.excites,
        helps: this.state.help,
      }).then(response => history.replace('/calendar'));
    }
  }

  reviewed () {
    this.setState({ needReview: false, thanks: true });
  }

  render () {
    if (this.state.nonExistant) {
      return <div> {"That profile doesn't exist"} </div>;
    }
    const reviews = [];
    if (this.state.reviews) {
      for (let i of this.state.reviews) {
        let image = "https://www.clker.com/cliparts/Z/j/o/Z/g/T/turquoise-anonymous-man-md.png"
        if (i.guest_initials){
          image = `https://ui-avatars.com/api/?name=${i.guest_initials.charAt(0)}+${i.guest_initials.charAt(1)}&rounded=true&background=${colors[Math.floor(Math.random() * colors.length)]}`
        }
        reviews.push(
          <ListItem
            primaryText = {i.comment}
            key={i.comment}
            leftAvatar = {<Avatar src={image} />}
            leftIcon={
              <div style={{ float: 'right', margin: 'auto', position: 'inherit', width: 'auto' }}>
                <ReactStars
                  count={5}
                  size={24}
                  color2={'#ffd700'}
                  value={i.stars}
                  half={false}
                  edit={false}
                />
              </div>
            }
          />
        )
      }
    }

    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onClick={() => this.handleClose()}
      />,
      <FlatButton
        label="Confirm: Delete this profile"
        primary
        onClick={() => this.deleteProfile()}
      />
    ];

    // `${Number(Math.round((this.state.price/this.state.etherPrice)+'e2')+'e-2')} Ether`
    const title = `$${Number(this.state.price).toFixed(0)} per half hour`;
    const subtitle = `${Number(Math.round((this.state.price/this.state.etherPrice)+'e3')+'e-3')} Ether`;
    if (this.state.notExpert) {
      return (
        <div id="unconfirmed">
          <h1>This user isn't a confimed expert yet...</h1>
        </div>
      );
    }

    return (
      <div style={{ paddingBottom: '10px' }}>
        {this.state.thanks && (
          <h2>Thanks for your review!</h2>
        )}
        {this.state.needReview &&
          <NeedReview
            reviewed={() => this.reviewed()}
            discussion_id={this.props.location.search.slice(4)}
            auth={this.props.auth}
          />
        }
        <ProfileCard
          host={this.state.host}
          description={this.state.description}
          image={this.state.image}
          who={this.state.who}
          origin={this.state.origin}
          excites={this.state.excites}
          helps={this.state.helps}
          open={this.state.open}
          search={this.props.location.search}
          handleClose={() => this.handleClose()}
          deleteProfile={() => this.deleteProfile()}
          title={title}
          subtitle={subtitle}
          otherProfile={this.state.otherProfile}
          linkToProfile={() => this.linkToProfile()}
          actions={actions}
          is_users={this.state.is_users}
          dp={this.state.dp}
        />
        {this.state.reviews &&
          <div id="Reviews" style={{ paddingTop: '30px' }}>
            <h1> Reviews </h1>
            <List>
              <Subheader>
                You can leave a review once you have a conversation with {this.state.host}.
              </Subheader>
              {reviews}
            </List>
          </div>
        }
        <div style={{ width: '100%', margin: '0 auto', textAlign: 'center' }} >
          <Divider style={{ marginTop: '80px' }} />
          <h2 style={{ paddingTop: '40px' }}>Are You an Expert?</h2>
          <RaisedButton
            containerElement={<Link to="/newProfile" />}
            label="Become a Dimpull Expert"
            secondary
            style={{ marginTop: '20px', marginBottom: '20px' }}
          />
        </div>
      </div>
    );
  }
}

export default DiscussionProfile;