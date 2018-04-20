import React from 'react';
import Subheader from 'material-ui/Subheader';
import ReactStars from 'react-stars';
import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import CircularProgress from 'material-ui/CircularProgress';
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
      etherPrice: '',
      email: '',
      emailOpen: false,
      waiting: true
    };
  }

  componentDidMount () {
    const { isAuthenticated } = this.props.auth;
    const { getAccessToken } = this.props.auth;
    let headers = {};
    if (isAuthenticated()) {
      headers = { Authorization: `Bearer ${getAccessToken()}`};
    }
    this.getDiscussion(headers);
  }

  getDiscussion (headers) {
    this.etherPrice();
    let requestUrl = this.props.location.pathname;
    if (!requestUrl.startsWith('/expert')) {
      requestUrl = `/expert${this.props.location.pathname}`;
    }
    axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}${requestUrl}`, { headers })
      .then((response) => {
        if (response.data === 'not an expert yet') {
          this.setState({ notExpert: true });
        } else if (response.data === 'does not exist') {
          this.setState({ nonExistant: true });
          return;
        } else if (response.data === 'editProfile') {
          history.push(`/editProfile${this.props.location.pathname}`);
        } else if (response.data === 404) {
          this.setState({ four0four: true });
          return;
        }
        this.etherPrice();
        this.setState({
          host: `${response.data.first_name} ${response.data.last_name}`,
          image: response.data.image,
          description: response.data.description,
          is_users: response.data.is_users,
          price: response.data.price,
          needReview: response.data.needReview,
          origin: response.data.origin,
          who: response.data.who,
          excites: response.data.excites,
          helps: response.data.helps,
          linkedin: response.data.linkedin,
          medium: response.data.medium,
          twitter: response.data.twitter,
          github: response.data.github,
          dp: response.data.id
        });
        this.setState({ waiting: false });
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
    axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/deleteDiscussion/${this.state.dp}`, { headers })
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

  getEmail () {
    this.setState({ emailOpen: true });
  }

  emailClose () {
    this.setState({ emailOpen: false });
  }

  changeEmail (e) {
    this.setState({ email: e.target.value });
  }

  async submitEmail () {
    try {
      await axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/addemail`, {
        email: this.state.email
      });
    } catch (err) {
      this.emailClose();
    }
    this.emailClose();
  }

  linkToProfile (profile){
    // window.open(
    //   profile,
    //   '_blank' // <- This is what makes it open in a new window.
    // );
    //commented out because we don't need to link in seed profiles.
  return;
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

    const ok = [
      <FlatButton
        label="No Thanks"
        primary
        onClick={() => this.emailClose()}
      />,
      <FlatButton
        label="Submit"
        primary
        onClick={() => this.submitEmail()}
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

    if (this.state.four0four) {
      return <div>404 - this page does not exist</div>
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
        {this.state.waiting ? <CircularProgress size={80} thickness={5} /> : (
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
            name={this.props.location.pathname.split('/').pop().trim()} // get the last part of expert/jon
            handleClose={() => this.handleClose()}
            deleteProfile={() => this.deleteProfile()}
            title={title}
            subtitle={subtitle}
            otherProfile={this.state.otherProfile}
            linkToProfile={() => this.linkToProfile()}
            actions={actions}
            is_users={this.state.is_users}
            dp={this.state.dp}
            handleOpen={() => this.handleOpen()}
            getEmail={() => this.getEmail()}
            emailOpen={this.state.emailOpen}
            emailClose={() => this.emailClose()}
            email={this.state.email}
            changeEmail={e => this.changeEmail(e)}
            ok={ok}
            linkedin={this.state.linkedin}
            github={this.state.github}
            twitter={this.state.twitter}
            medium={this.state.medium}
          />
        )}
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
        <div style={{ width: '100%', margin: '0 auto', textAlign: 'center', paddingBottom: '35px' }} >
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