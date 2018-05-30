import React from 'react';
import ReactStars from 'react-stars';
import Avatar from 'material-ui/Avatar';
import { ListItem } from 'material-ui/List';
import { withRouter } from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import IconButton from 'material-ui/IconButton';
import axios from 'axios';
import history from '../../history';
import NeedReview from './needReview';
import ProfileCard from './ProfileCard';
import './discussionprofile.css';

const colors = ['FF9A57', '01B48F', 'D0D2D3', 'C879B2', '44C7F4'];

class DP extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      open: false,
      etherPrice: '',
      email: '',
      emailOpen: false,
      waiting: true,
      vip: false
    };
  }

  componentDidMount () {
    this.getDiscussion();
  }

  async getDiscussion () {
    this.etherPrice();
    let requestUrl = this.props.location.pathname;
    if (requestUrl.includes('review=')) {
      const reviewId = requestUrl.substring(requestUrl.indexOf('/review=') + 8);
      requestUrl = requestUrl.substring(0, requestUrl.indexOf('/review='));
      const reviewNeeded = await axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/checkreviewid/${reviewId}`,
        {
          url: requestUrl.match(/\/([^/]+)\/?$/)[1]
        }
      );
      if (reviewNeeded.data.confirmed === 'confirmed') {
        this.setState({ reviewIdConfirmed: true, cid: reviewNeeded.data.cid });
      }
    } else if (requestUrl.includes('vip=')) {
      const vip = requestUrl.substring(requestUrl.indexOf('/vip=') + 5);
      requestUrl = requestUrl.substring(0, requestUrl.indexOf('/vip='));
      const vipCheck = await axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/checkvip/${vip}`,
        {
          url: requestUrl.match(/\/([^/]+)\/?$/)[1]
        }
      );
      if (vipCheck.data === 'confirmed') {
        this.setState({ vip: true, vipid: vip });
      }
    }
    
    const url = requestUrl.match(/\/([^/]+)\/?$/)[1];
    this.setState({ url });
    if (!requestUrl.startsWith('/expert')) {
      if (requestUrl.length === 0) {
        history.push('/home');
      }
      requestUrl = `/expert${requestUrl}`;
    }
    const { isAuthenticated } = this.props.auth;
    const { getAccessToken } = this.props.auth;
    let headers = {};
    if (isAuthenticated()) {
      headers = { Authorization: `Bearer ${getAccessToken()}` };
    }
    const response = await axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}${requestUrl}`, { headers });
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
      youtube: response.data.youtube,
      github: response.data.github,
      dp: response.data.id
    });
    this.setState({ waiting: false });
    if (response.data.reviewlist) {
      this.setState({
        averageRating: response.data.averageRating
      }, () => this.reviews(response.data.reviewlist));
    }
  }

  getEmail () {
    this.setState({ emailOpen: true });
  }

  reviews (reviews) {
    const reviewRender = [];
    reviews.forEach(i => {
      let image = 'https://www.clker.com/cliparts/Z/j/o/Z/g/T/turquoise-anonymous-man-md.png';
      if (i.guest_initials) {
        image = `https://ui-avatars.com/api/?name=${i.guest_initials.charAt(0)}+${i.guest_initials.charAt(1)}&rounded=true&background=${colors[Math.floor(Math.random() * colors.length)]}`;
      }
      reviewRender.push(<ListItem
        primaryText={i.comment}
        key={i.comment}
        disabled={true}
        leftAvatar={<Avatar src={image} />}
        leftIcon={
          <div
            style={{
              float: 'right', margin: 'auto', position: 'inherit', width: 'auto'
            }}
          >
            <ReactStars
              count={5}
              size={24}
              color2="#ffd700"
              value={i.stars}
              half={false}
              edit={false}
            />
          </div>
        }
      />);
    });
    this.setState({ reviewRender });
  }

  handleOpen () {
    this.setState({ open: true });
  }

  handleClose () {
    this.setState({ open: false });
  }

  async etherPrice () {
    const res = await axios.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD')
    if (res) {
      this.setState({ etherPrice: res.data.USD });
    }
  }

  deleteProfile () {
    const { isAuthenticated } = this.props.auth;
    const { getAccessToken } = this.props.auth;
    let headers = {};
    if (isAuthenticated()) {
      headers = { Authorization: `Bearer ${getAccessToken()}` };
    }
    axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/deleteDiscussion/${this.state.dp}`, { headers })
      .then((response) => {
        this.handleClose();
        history.replace('/home');
      })
      .catch(error => console.log(error));
  }

  emailClose () {
    this.setState({ emailOpen: false });
  }

  changeEmail (e) {
    this.setState({ email: e.target.value });
  }

  schedule () {
    history.push({
      pathname: `/availability/${this.state.dp}`,
      // search: conversationID,
      state: { vip: this.state.vip, host: this.state.host }
    });
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

  reviewed () {
    this.setState({ needReview: false, reviewIdConfirmed: false, thanks: true });
  }

  render () {
    if (this.state.nonExistant) {
      return <div> {"That profile doesn't exist"} </div>;
    }

    let averageRating = null;
    if (this.state.averageRating) {
      averageRating = (
        <IconButton tooltip={`${this.state.averageRating} average rating`} touch style={{ width: '100%' }} tooltipPosition="bottom-right" >
          <ReactStars
            value={this.state.averageRating}
            edit={false}
            count={5}
            size={24}
            color2="#ffc700"
          />
        </IconButton>
      );
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

    const title = `$${Number(this.state.price).toFixed(0)} per half hour`;
    const subtitle = `${Number(Math.round((this.state.price / this.state.etherPrice) + 'e3') + 'e-3')} Ether`;

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
        {(this.state.needReview || this.state.reviewIdConfirmed) &&
          <div style={{ margin: '0 auto', paddingLeft: '5%', paddingRight: '5%' }} >
            <NeedReview
              reviewed={() => this.reviewed()}
              url={this.state.url}
              auth={this.props.auth}
              cid={this.state.cid}
            />
          </div>
        }
        {this.state.waiting ? <div style={{ position: 'fixed', top: '20%', left: '50%' }}><CircularProgress size={80} thickness={5} /> </div>: (
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
            youtube={this.state.youtube}
            medium={this.state.medium}
            reviews={this.state.reviewRender}
            averageRating={averageRating}
            schedule={() => this.schedule()}
          />
        )}
      </div>
    );
  }
}

const DiscussionProfile = withRouter(DP);
export default DiscussionProfile;
